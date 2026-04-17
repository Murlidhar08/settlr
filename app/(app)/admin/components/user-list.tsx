"use client";

import { useConfirm } from "@/components/providers/confirm-provider";
import { usePrompt } from "@/components/providers/prompt-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import {
    Ban,
    Check,
    Filter,
    MoreHorizontal,
    Phone,
    RefreshCw,
    Search,
    Shield,
    UserCircle,
    UserMinus,
    UserPlus,
    UserX
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { comprehensiveDeleteUser } from "@/actions/admin.actions";
import { useAdminUsers } from "@/tanstacks/admin";

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

export function UserList() {
    const confirm = useConfirm();
    const prompt = usePrompt();
    const { data: usersData, isLoading, refetch } = useAdminUsers();

    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterVerified, setFilterVerified] = useState<string>("all");

    const users = usersData || [];

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
        setActionLoading(userId);
        try {
            const res = await action();
            if (res?.error) {
                toast.error(res.error.message || res.error || "Something went wrong");
                return;
            }
            toast.success(successMsg);
            refetch();
        } catch (err) {
            toast.error("Failed to perform action");
        } finally {
            setActionLoading(null);
        }
    };

    const setRole = async (userId: string, role: string) => {
        await handleAction(
            userId,
            () => authClient.admin.setRole({ userId, role: role as "admin" | "user" }),
            `Role updated to ${role}`
        );
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
            () => comprehensiveDeleteUser(userId),
            "User and all associated data deleted successfully"
        );
    };


    const unbanUser = async (userId: string) => {
        await handleAction(
            userId,
            () => authClient.admin.unbanUser({ userId }),
            "User unbanned successfully"
        );
    };

    return (
        <div className="space-y-6">
            {/* SEARCH & FILTER UI */}
            <div className="p-4 sm:p-5 rounded-3xl bg-card border-2 border-primary/5 shadow-xl shadow-primary/5 flex flex-col gap-4">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40 group-focus-within:text-primary transition-all group-focus-within:scale-110" />
                    <Input
                        placeholder="Search users by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 h-12 rounded-2xl border-none bg-muted/40 shadow-inner focus-visible:ring-primary/20 transition-all text-sm font-bold placeholder:text-muted-foreground/40"
                    />
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button variant="outline" className="flex-1 sm:flex-none h-11 rounded-2xl gap-2 px-5 border-2 border-primary/10 bg-background hover:bg-primary/5 hover:border-primary/20 shadow-sm text-[11px] font-black uppercase tracking-widest text-primary/80 transition-all">
                                    <Shield className="h-4 w-4" />
                                    {filterRole === "all" ? "All Roles" : filterRole}
                                </Button>
                            }
                        />
                        <DropdownMenuContent className="rounded-2xl w-48 p-2 border-2 border-primary/5">
                            <DropdownMenuItem onClick={() => setFilterRole("all")} className="rounded-xl font-bold">All Roles</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterRole("admin")} className="rounded-xl font-bold text-indigo-600">Admins Only</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterRole("user")} className="rounded-xl font-bold">Users Only</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button variant="outline" className="flex-1 sm:flex-none h-11 rounded-2xl gap-2 px-5 border-2 border-emerald-500/10 bg-background hover:bg-emerald-500/5 hover:border-emerald-500/20 shadow-sm text-[11px] font-black uppercase tracking-widest text-emerald-600/80 transition-all">
                                    <Filter className="h-4 w-4" />
                                    {filterStatus === "all" ? "All Status" : filterStatus}
                                </Button>
                            }
                        />
                        <DropdownMenuContent className="rounded-2xl w-48 p-2 border-2 border-emerald-500/5">
                            <DropdownMenuItem onClick={() => setFilterStatus("all")} className="rounded-xl font-bold">All Status</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus("active")} className="rounded-xl font-bold text-emerald-600">Active</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus("banned")} className="rounded-xl font-bold text-rose-600">Banned</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button variant="outline" className="flex-1 sm:flex-none h-11 rounded-2xl gap-2 px-5 border-2 border-blue-500/10 bg-background hover:bg-blue-500/5 hover:border-blue-500/20 shadow-sm text-[11px] font-black uppercase tracking-widest text-blue-600/80 transition-all">
                                    <Check className="h-4 w-4" />
                                    {filterVerified === "all" ? "All Users" : filterVerified === "verified" ? "Verified" : "Unverified"}
                                </Button>
                            }
                        />
                        <DropdownMenuContent className="rounded-2xl w-48 p-2 border-2 border-blue-500/5">
                            <DropdownMenuItem onClick={() => setFilterVerified("all")} className="rounded-xl font-bold">All Users</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterVerified("verified")} className="rounded-xl font-bold text-blue-600">Verified</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterVerified("unverified")} className="rounded-xl font-bold text-amber-600">Unverified</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-[12px] font-bold uppercase tracking-widest text-foreground opacity-80 border-l-2 border-primary pl-3">Users Management</h2>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                            {filteredUsers.length} total
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {filteredUsers?.length === 0 ? (
                        <div className="text-center py-20 bg-muted/10 rounded-2xl border-2 border-dashed border-border/40">
                            <UserX className="mx-auto h-12 w-12 text-muted-foreground/10 mb-3" />
                            <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider">No matches found</p>
                        </div>
                    ) : (
                        filteredUsers?.map((user) => (
                            <div
                                key={user.id}
                                className="group flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-border/60 bg-card/40 hover:bg-card hover:border-primary/40 hover:shadow-xl shadow-primary/5 transition-all duration-300 gap-4"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="relative shrink-0">
                                        <Avatar className="h-12 w-12 border-2 border-background shadow-lg ring-2 ring-border/10">
                                            <AvatarImage src={user.image || ""} alt={user.name} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-black uppercase text-lg">
                                                {user.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        {user.banned && (
                                            <div className="absolute -bottom-1 -right-1 bg-rose-500 rounded-full p-1.5 border-2 border-background shadow-lg scale-90">
                                                <Ban size={10} className="text-white fill-white/20" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="font-black text-[16px] tracking-tight text-foreground truncate max-w-[140px] sm:max-w-none">
                                                {user.name}
                                            </span>
                                            {user.emailVerified && (
                                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest h-5 px-1.5 flex items-center gap-0.5 shadow-sm shadow-emerald-500/5">
                                                    <Check className="h-3 w-3 stroke-3" />
                                                    VERIFIED
                                                </Badge>
                                            )}
                                            {user.role === "admin" && (
                                                <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 text-[9px] font-black uppercase tracking-widest h-5 px-2 shadow-sm shadow-indigo-500/5">
                                                    ADMIN
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[12px] font-bold text-muted-foreground/60 truncate max-w-[180px]">{user.email}</span>
                                            {user.contactNo && (
                                                <div className="hidden md:flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest bg-muted/5 px-2 py-0.5 rounded border border-border/20">
                                                    <Phone size={10} className="text-primary/40" />
                                                    {user.contactNo}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="hidden sm:flex items-center gap-8 border-l border-border/30 pl-8 mr-2">
                                        <div className="flex flex-col items-center group/count">
                                            <span className="text-xl font-black tabular-nums tracking-tighter leading-none text-foreground/90 group-hover/count:text-primary transition-colors">{user.businessCount || 0}</span>
                                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mt-2">Orgs</span>
                                        </div>
                                        <div className="flex flex-col items-center group/count">
                                            <span className="text-xl font-black tabular-nums tracking-tighter leading-none text-foreground/90 group-hover/count:text-emerald-500 transition-colors">{user.transactionCount || 0}</span>
                                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mt-2">Rows</span>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-muted/30 border border-transparent hover:border-primary/20 hover:bg-primary/5 hover:text-primary transition-all duration-300 shadow-inner" disabled={actionLoading === user.id}>
                                                    <MoreHorizontal size={18} className="opacity-60" />
                                                </Button>
                                            }
                                        />
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
                        )))}
                </div>
            </div>
        </div>
    );
}
