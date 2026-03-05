"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
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
    UserX,
    RefreshCw,
    Search,
    Filter,
    Phone,
    Calendar,
    Briefcase,
    Activity,
    Check
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useConfirm } from "@/components/providers/confirm-provider";
import { usePrompt } from "@/components/providers/prompt-provider";

interface User {
    id: string;
    email: string;
    name: string;
    role?: string | null;
    banned?: boolean | null;
    image?: string | null;
    createdAt: Date;
    contactNo?: string | null;
    businessCount?: number;
    transactionCount?: number;
    emailVerified?: boolean;
}

interface UserListProps {
    initialUsers: User[];
}

export function UserList({ initialUsers }: UserListProps) {
    const confirm = useConfirm();
    const prompt = usePrompt();
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [loading, setLoading] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterVerified, setFilterVerified] = useState<string>("all");

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());

        const matchesRole = filterRole === "all" || user.role === filterRole;
        const matchesStatus = filterStatus === "all" ||
            (filterStatus === "banned" ? user.banned : !user.banned);

        const matchesVerified = filterVerified === "all" ||
            (filterVerified === "verified" ? user.emailVerified : !user.emailVerified);

        return matchesSearch && matchesRole && matchesStatus && matchesVerified;
    });

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

    const setRole = async (userId: string, role: string) => {
        await handleAction(
            userId,
            () => authClient.admin.setRole({ userId, role: role as "admin" | "user" }),
            `Role updated to ${role}`
        );

        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    };

    const banUser = async (userId: string) => {
        const banReason = await prompt({
            title: "Ban User",
            description: "Please provide a reason for banning this user. This will be visible to the user.",
            placeholder: "e.g. Violation of terms, Spamming...",
            confirmText: "Ban User",
            destructive: true
        });

        if (!banReason) return;

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
        const isConfirmed = await confirm({
            title: "Delete User",
            description: "Are you sure you want to delete this user? This action is irreversible and will remove all associated data.",
            confirmText: "Delete User",
            destructive: true
        });

        if (!isConfirmed) return;

        await handleAction(
            userId,
            () => authClient.admin.removeUser({ userId }),
            "User deleted successfully"
        );
        setUsers(prev => prev.filter(u => u.id !== userId));
    };


    const unbanUser = async (userId: string) => {
        await handleAction(
            userId,
            () => authClient.admin.unbanUser({ userId }),
            "User unbanned successfully"
        );
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, banned: false } : u));
    };

    return (
        <div className="space-y-6">
            {/* SEARCH & FILTER UI */}
            <div className="p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] bg-muted/30 backdrop-blur-xl border border-border/40 flex flex-col gap-4">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 h-12 sm:h-14 rounded-2xl sm:rounded-3xl border-none bg-background shadow-sm focus-visible:ring-primary/20"
                    />
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="outline" className="flex-1 sm:flex-none h-10 sm:h-14 rounded-xl sm:rounded-3xl gap-2 px-4 sm:px-6 border-none bg-background shadow-sm text-[10px] sm:text-sm font-bold capitalize">
                                <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                                {filterRole === "all" ? "All Roles" : filterRole}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-2xl w-40">
                            <DropdownMenuItem onClick={() => setFilterRole("all")}>All Roles</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterRole("admin")}>Admins Only</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterRole("user")}>Users Only</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="outline" className="flex-1 sm:flex-none h-10 sm:h-14 rounded-xl sm:rounded-3xl gap-2 px-4 sm:px-6 border-none bg-background shadow-sm text-[10px] sm:text-sm font-bold capitalize">
                                <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                                {filterStatus === "all" ? "All Status" : filterStatus}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-2xl w-40">
                            <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Status</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus("active")}>Active</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus("banned")}>Banned</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="outline" className="flex-1 sm:flex-none h-10 sm:h-14 rounded-xl sm:rounded-3xl gap-2 px-4 sm:px-6 border-none bg-background shadow-sm text-[10px] sm:text-sm font-bold capitalize">
                                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                                {filterVerified === "all" ? "All Verified" : filterVerified === "verified" ? "Verified" : "Unverified"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-2xl w-40">
                            <DropdownMenuItem onClick={() => setFilterVerified("all")}>All Users</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterVerified("verified")}>Verified</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterVerified("unverified")}>Unverified</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 bg-muted/30 backdrop-blur-xl overflow-hidden">
                <div className="p-4 sm:p-8 pt-0">
                    <div className="space-y-3 mt-8">
                        {filteredUsers?.length === 0 ? (
                            <div className="text-center py-20 bg-background/20 rounded-[2rem] border border-dashed">
                                <UserX className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                                <p className="text-muted-foreground font-semibold">No users found matching your search</p>
                            </div>
                        ) : filteredUsers?.map((user) => (
                            <div
                                key={user.id}
                                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 rounded-[2rem] border border-border/40 bg-background/40 transition-all hover:bg-background/80 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.99] gap-4"
                            >
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className="relative shrink-0">
                                        <Avatar className="h-14 w-14 border-2 border-background shadow-xl text-xs">
                                            <AvatarImage src={user.image || ""} alt={user.name} />
                                            <AvatarFallback className="bg-primary/5 text-primary font-black uppercase text-lg">
                                                {user.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        {user.banned && (
                                            <div className="absolute -top-1 -right-1 bg-rose-500 rounded-full p-1.5 border-2 border-background shadow-lg scale-75">
                                                <Ban size={12} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-black text-lg tracking-tighter text-foreground/90 truncate max-w-[150px] sm:max-w-none">
                                                {user.name}
                                            </span>
                                            {user.emailVerified && (
                                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black uppercase tracking-[0.1em] h-5 px-1.5 flex items-center gap-1">
                                                    <Check className="h-3 w-3" />
                                                    Verified
                                                </Badge>
                                            )}
                                            {user.role === "admin" && (
                                                <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-500 border-none text-[9px] font-black uppercase tracking-[0.1em] h-5 px-2">
                                                    Admin
                                                </Badge>
                                            )}
                                            {user.banned && (
                                                <Badge variant="destructive" className="bg-rose-500/10 text-rose-500 border-none text-[9px] font-black uppercase tracking-[0.1em] h-5 px-2">
                                                    Banned
                                                </Badge>
                                            )}
                                        </div>
                                        <span className="text-xs font-semibold text-muted-foreground/50 tracking-wide truncate">{user.email}</span>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                                            <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                                <Calendar size={10} />
                                                {format(new Date(user.createdAt), "dd MMM yyyy")}
                                            </div>
                                            {user.contactNo && (
                                                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                                    <Phone size={10} />
                                                    {user.contactNo}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row items-center justify-between gap-4 w-full sm:w-auto mt-2 sm:mt-0 px-2 sm:px-0">
                                    <div className="flex items-center gap-4 sm:gap-6 sm:border-l sm:pl-6 border-border/30">
                                        <div className="flex flex-col items-center group/count">
                                            <div className="p-1.5 sm:p-2 bg-primary/5 rounded-lg sm:rounded-xl mb-1 group-hover/count:bg-primary/10 transition-colors">
                                                <Briefcase size={12} className="text-primary opacity-60 sm:hidden" />
                                                <Briefcase size={14} className="text-primary opacity-60 hidden sm:block" />
                                            </div>
                                            <span className="text-sm sm:text-lg font-black tracking-tighter leading-none">{user.businessCount || 0}</span>
                                            <span className="text-[6px] sm:text-[7px] font-black uppercase tracking-widest opacity-40 mt-1">Businesses</span>
                                        </div>
                                        <div className="flex flex-col items-center group/count">
                                            <div className="p-1.5 sm:p-2 bg-emerald-500/5 rounded-lg sm:rounded-xl mb-1 group-hover/count:bg-emerald-500/10 transition-colors">
                                                <Activity size={12} className="text-emerald-500 opacity-60 sm:hidden" />
                                                <Activity size={14} className="text-emerald-500 opacity-60 hidden sm:block" />
                                            </div>
                                            <span className="text-sm sm:text-lg font-black tracking-tighter leading-none">{user.transactionCount || 0}</span>
                                            <span className="text-[6px] sm:text-[7px] font-black uppercase tracking-widest opacity-40 mt-1">Records</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-background/50 border border-border/50 opacity-100 transition-all hover:bg-primary/10 hover:border-primary/50" disabled={loading === user.id}>
                                                    <MoreHorizontal size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-60 rounded-3xl p-2 border-none shadow-2xl bg-background/95 backdrop-blur-xl">
                                                <DropdownMenuGroup>
                                                    {/* Role Management */}
                                                    <DropdownMenuItem
                                                        onClick={() => setRole(user.id, user.role === "admin" ? "user" : "admin")}
                                                        className="rounded-2xl gap-3 p-3 focus:bg-indigo-500/10 focus:text-indigo-600 transition-all duration-300 cursor-pointer active:scale-95"
                                                    >
                                                        {user.role === "admin" ? (
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

                                                    {/* Impersonation */}
                                                    <DropdownMenuItem
                                                        onClick={() => impersonateUser(user.id)}
                                                        className="rounded-2xl gap-3 p-3 focus:bg-blue-500/10 focus:text-blue-600 transition-all duration-300 cursor-pointer active:scale-95 mt-1"
                                                    >
                                                        <div className="p-2 bg-blue-500/10 rounded-xl">
                                                            <UserCircle size={16} className="text-blue-500" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-sm">Impersonate</span>
                                                            <span className="text-[10px] text-muted-foreground">Login as this user</span>
                                                        </div>
                                                    </DropdownMenuItem>

                                                    {/* Revoke Sessions */}
                                                    <DropdownMenuItem
                                                        onClick={() => revokeSessions(user.id)}
                                                        className="rounded-2xl gap-3 p-3 focus:bg-orange-500/10 focus:text-orange-600 transition-all duration-300 cursor-pointer active:scale-95 mt-1"
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
                                                        className="rounded-2xl gap-3 p-3 focus:bg-rose-500/10 focus:text-rose-600 transition-all duration-300 cursor-pointer active:scale-95 mt-1"
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
                                                        className="rounded-2xl gap-3 p-3 focus:bg-rose-600 focus:text-white transition-all duration-300 cursor-pointer active:scale-95 mt-1"
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
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
