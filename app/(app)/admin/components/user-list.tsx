"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    MoreHorizontal,
    Shield,
    ShieldAlert,
    UserMinus,
    UserPlus,
    Ban,
    Slash,
    UserCircle,
    LogOut,
    UserX,
    UserCog,
    RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { UserType } from "@/lib/generated/prisma/enums";

interface User {
    id: string;
    email: string;
    name: string;
    role?: string | null;
    banned?: boolean | null;
    image?: string | null;
    createdAt: Date;
}

interface UserListProps {
    initialUsers: User[];
}

export function UserList({ initialUsers }: UserListProps) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [loading, setLoading] = useState<string | null>(null);

    const handleAction = async (userId: string, action: () => Promise<any>, successMsg: string) => {
        setLoading(userId);
        try {
            const { error } = await action();
            if (error) {
                toast.error(error.message || "Something went wrong");
                return;
            }
            toast.success(successMsg);
            // Refresh user list (ideally we should fetch again, but for now we manually update)
            // Note: better-auth client doesn't automatically re-export listUsers so we might need to handle state carefully
        } catch (err) {
            toast.error("Failed to perform action");
        } finally {
            setLoading(null);
        }
    };

    const setRole = async (userId: string, role: UserType) => {
        await handleAction(
            userId,
            () => authClient.admin.setRole({ userId, role: role as any }),
            `Role updated to ${role}`
        );

        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    };

    const banUser = async (userId: string) => {
        const banReason = prompt("Reason for ban?", "Spamming") || "Spamming";
        await handleAction(
            userId,
            () => authClient.admin.banUser({ userId, banReason }),
            "User banned successfully"
        );
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, banned: true } : u));
    };

    const impersonateUser = async (userId: string) => {
        await handleAction(
            userId,
            () => authClient.admin.impersonateUser({ userId }),
            "Impersonating user..."
        );
        window.location.reload();
    };

    const revokeSessions = async (userId: string) => {
        await handleAction(
            userId,
            () => authClient.admin.revokeUserSessions({ userId }),
            "All sessions revoked"
        );
    };

    const deleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action is irreversible.")) return;

        await handleAction(
            userId,
            () => authClient.admin.removeUser({ userId }),
            "User deleted successfully"
        );
        setUsers(prev => prev.filter(u => u.id !== userId));
    };

    const { data: sessionData } = authClient.useSession();
    const isImpersonating = !!(sessionData?.session as any)?.impersonatedBy;

    const unbanUser = async (userId: string) => {
        await handleAction(
            userId,
            () => authClient.admin.unbanUser({ userId }),
            "User unbanned successfully"
        );
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, banned: false } : u));
    };

    const stopImpersonating = async () => {
        try {
            await authClient.admin.stopImpersonating();
            toast.success("Stopped impersonating");
            window.location.reload();
        } catch (err) {
            toast.error("Failed to stop impersonating");
        }
    };

    return (
        <div className="space-y-6">
            {isImpersonating && (
                <div className="flex items-center justify-between p-4 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500/20 rounded-2xl">
                            <ShieldAlert className="text-amber-600" size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-amber-900 text-sm tracking-tight leading-none mb-1">Impersonation Mode</span>
                            <span className="text-[10px] font-bold text-amber-700/60 uppercase tracking-wider">Actively viewing as {sessionData?.user.name}</span>
                        </div>
                    </div>
                    <Button
                        onClick={stopImpersonating}
                        className="rounded-xl bg-amber-500 text-white hover:bg-amber-600 font-bold text-xs h-9 px-4"
                    >
                        <LogOut size={14} className="mr-2" />
                        Stop
                    </Button>
                </div>
            )}
            <div className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 bg-muted/30 backdrop-blur-xl overflow-hidden">
                <div className="p-8 pt-0">
                    <div className="space-y-3">
                        {users?.map((user) => (
                            <div
                                key={user.id}
                                className="group flex items-center justify-between p-4 rounded-2xl border border-border/40 bg-background/40 transition-all hover:bg-background/80 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.99]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Avatar className="h-12 w-12 border-2 border-background shadow-xl text-xs">
                                            <AvatarImage src={user.image || ""} alt={user.name} />
                                            <AvatarFallback className="bg-primary/5 text-primary font-black uppercase">
                                                {user.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        {user.banned && (
                                            <div className="absolute -top-1 -right-1 bg-rose-500 rounded-full p-1 border-2 border-background shadow-lg scale-75">
                                                <Ban size={10} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-base tracking-tight text-foreground/90">
                                                {user.name}
                                            </span>
                                            {user.role === UserType.SUPERADMIN && (
                                                <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-none text-[9px] font-black uppercase tracking-[0.1em] h-4 scale-90 origin-left">
                                                    Superadmin
                                                </Badge>
                                            )}
                                            {user.role === UserType.ADMIN && (
                                                <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-500 border-none text-[9px] font-black uppercase tracking-[0.1em] h-4 scale-90 origin-left">
                                                    Admin
                                                </Badge>
                                            )}
                                            {user.banned && (
                                                <Badge variant="destructive" className="bg-rose-500/10 text-rose-500 border-none text-[9px] font-black uppercase tracking-[0.1em] h-4 scale-90 origin-left">
                                                    Banned
                                                </Badge>
                                            )}
                                        </div>
                                        <span className="text-xs font-semibold text-muted-foreground/50 tracking-wide">{user.email}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-background/50 border border-border/50 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:border-primary/20" disabled={loading === user.id}>
                                                <MoreHorizontal size={18} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-60 rounded-3xl p-2 border-none shadow-2xl bg-background/95 backdrop-blur-xl">
                                            <DropdownMenuGroup>
                                                <DropdownMenuLabel className="px-3 pt-3 pb-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">User Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator className="mx-2 bg-border/40" />

                                                {/* Role Management */}
                                                <DropdownMenuItem
                                                    onClick={() => setRole(user.id, user.role === UserType.SUPERADMIN ? UserType.ADMIN : UserType.SUPERADMIN)}
                                                    className="rounded-2xl gap-3 p-3 focus:bg-amber-500/10 focus:text-amber-600 transition-colors"
                                                >
                                                    <div className="p-2 bg-amber-500/10 rounded-xl">
                                                        <UserCog size={16} className="text-amber-500" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm">
                                                            {user.role === UserType.SUPERADMIN ? "Demote to Admin" : "Promote to Superadmin"}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground/60">Change authority level</span>
                                                    </div>
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onClick={() => setRole(user.id, user.role === UserType.ADMIN ? UserType.USER : UserType.ADMIN)}
                                                    className="rounded-2xl gap-3 p-3 focus:bg-indigo-500/10 focus:text-indigo-600 transition-colors"
                                                >
                                                    {user.role === UserType.ADMIN ? (
                                                        <>
                                                            <div className="p-2 bg-muted rounded-xl">
                                                                <UserMinus size={16} className="text-muted-foreground" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-sm">Demote to User</span>
                                                                <span className="text-[10px] text-muted-foreground/60">Remove admin privileges</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="p-2 bg-indigo-500/10 rounded-xl">
                                                                <Shield size={16} className="text-indigo-500" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-sm">Promote to Admin</span>
                                                                <span className="text-[10px] text-muted-foreground/60">Grant full access</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator className="mx-2 bg-border/40" />
                                                <DropdownMenuLabel className="px-3 pt-3 pb-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Advanced Powers</DropdownMenuLabel>

                                                {/* Impersonation */}
                                                <DropdownMenuItem
                                                    onClick={() => impersonateUser(user.id)}
                                                    className="rounded-2xl gap-3 p-3 focus:bg-blue-500/10 focus:text-blue-600 transition-colors"
                                                >
                                                    <div className="p-2 bg-blue-500/10 rounded-xl">
                                                        <UserCircle size={16} className="text-blue-500" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm">Impersonate</span>
                                                        <span className="text-[10px] text-muted-foreground/60">Login as this user</span>
                                                    </div>
                                                </DropdownMenuItem>

                                                {/* Revoke Sessions */}
                                                <DropdownMenuItem
                                                    onClick={() => revokeSessions(user.id)}
                                                    className="rounded-2xl gap-3 p-3 focus:bg-orange-500/10 focus:text-orange-600 transition-colors"
                                                >
                                                    <div className="p-2 bg-orange-500/10 rounded-xl">
                                                        <RefreshCw size={16} className="text-orange-500" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm">Revoke Sessions</span>
                                                        <span className="text-[10px] text-muted-foreground/60">Force logout everywhere</span>
                                                    </div>
                                                </DropdownMenuItem>

                                                {/* Ban Management */}
                                                <DropdownMenuItem
                                                    onClick={() => user.banned ? unbanUser(user.id) : banUser(user.id)}
                                                    className="rounded-2xl gap-3 p-3 text-rose-500 focus:bg-rose-500/10 focus:text-rose-600 transition-colors mt-1"
                                                >
                                                    {user.banned ? (
                                                        <>
                                                            <div className="p-2 bg-emerald-500/10 rounded-xl">
                                                                <UserPlus size={16} className="text-emerald-500" />
                                                            </div>
                                                            <div className="flex flex-col text-emerald-600">
                                                                <span className="font-bold text-sm">Unban User</span>
                                                                <span className="text-[10px] text-emerald-500/60">Restore access</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="p-2 bg-rose-500/10 rounded-xl">
                                                                <Ban size={16} />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-sm">Ban User</span>
                                                                <span className="text-[10px] text-rose-500/60">Restrict access</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </DropdownMenuItem>

                                                {/* Delete User */}
                                                <DropdownMenuItem
                                                    onClick={() => deleteUser(user.id)}
                                                    className="rounded-2xl gap-3 p-3 text-rose-600 focus:bg-rose-600 focus:text-white transition-colors mt-1 hover:bg-rose-600"
                                                >
                                                    <div className="p-2 bg-rose-100 rounded-xl">
                                                        <UserX size={16} className="text-rose-600" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm">Delete User</span>
                                                        <span className="text-[10px] opacity-70">Permanent removal</span>
                                                    </div>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
