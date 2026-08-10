"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Check,
    Filter,
    Search,
    Shield,
    UserX
} from "lucide-react";
import { useState } from "react";

import { UserRole, UserStatus } from "@/lib/generated/prisma/enums";
import { tran } from "@/lib/languages/i18n";
import { useAdminUsers } from "@/tanstacks/admin";
import { UserCard } from "./user-card";

interface User {
    id: string;
    email: string;
    name: string;
    role?: string | null;
    roles: string[];
    status?: UserStatus | null;
    banned?: boolean | null;
    image?: string | null;
    createdAt: Date;
    contactNo?: string | null;
    businessCount?: number;
    transactionCount?: number;
    emailVerified?: boolean;
}

export function UserList() {
    const { data: usersData, isLoading, refetch } = useAdminUsers();

    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterVerified, setFilterVerified] = useState<string>("all");

    const users = usersData || [];

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase());

        const matchesRole = filterRole === "all" || user.role === filterRole;
        const matchesStatus = filterStatus === "all" ||
            (filterStatus === "banned" ? user.banned : !user.banned);

        const matchesVerified = filterVerified === "all" ||
            (filterVerified === "verified" ? user.emailVerified : !user.emailVerified);

        return matchesSearch && matchesRole && matchesStatus && matchesVerified;
    });



    return (
        <div className="space-y-6">
            {/* SEARCH & FILTER UI */}
            <div className="p-4 sm:p-5 rounded-3xl bg-card border-2 border-primary/5 shadow-xl shadow-primary/5 flex flex-col gap-4">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40 group-focus-within:text-primary transition-all group-focus-within:scale-110" />
                    <Input
                        placeholder={tran("admin.user_mng.search_placeholder")}
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
                                    {filterRole === "all" ? tran("admin.user_mng.all_roles") : filterRole}
                                </Button>
                            }
                        />
                        <DropdownMenuContent className="rounded-2xl w-48 p-2 border-2 border-primary/5">
                            <DropdownMenuItem onClick={() => setFilterRole("all")} className="rounded-xl font-bold">{tran("admin.user_mng.all_roles")}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterRole(UserRole.admin)} className="rounded-xl font-bold text-indigo-600">{tran("admin.user_mng.admins_only")}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterRole(UserRole.user)} className="rounded-xl font-bold">{tran("admin.user_mng.users_only")}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button variant="outline" className="flex-1 sm:flex-none h-11 rounded-2xl gap-2 px-5 border-2 border-emerald-500/10 bg-background hover:bg-emerald-500/5 hover:border-emerald-500/20 shadow-sm text-[11px] font-black uppercase tracking-widest text-emerald-600/80 transition-all">
                                    <Filter className="h-4 w-4" />
                                    {filterStatus === "all" ? tran("admin.user_mng.all_status") : filterStatus === "active" ? tran("admin.user_mng.active") : tran("admin.user_mng.banned")}
                                </Button>
                            }
                        />
                        <DropdownMenuContent className="rounded-2xl w-48 p-2 border-2 border-emerald-500/5">
                            <DropdownMenuItem onClick={() => setFilterStatus("all")} className="rounded-xl font-bold">{tran("admin.user_mng.all_status")}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus("active")} className="rounded-xl font-bold text-emerald-600">{tran("admin.user_mng.active")}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus("banned")} className="rounded-xl font-bold text-rose-600">{tran("admin.user_mng.banned")}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button variant="outline" className="flex-1 sm:flex-none h-11 rounded-2xl gap-2 px-5 border-2 border-blue-500/10 bg-background hover:bg-blue-500/5 hover:border-blue-500/20 shadow-sm text-[11px] font-black uppercase tracking-widest text-blue-600/80 transition-all">
                                    <Check className="h-4 w-4" />
                                    {filterVerified === "all" ? tran("admin.user_mng.all_users") : filterVerified === "verified" ? tran("admin.user_mng.verified") : tran("admin.user_mng.unverified")}
                                </Button>
                            }
                        />
                        <DropdownMenuContent className="rounded-2xl w-48 p-2 border-2 border-blue-500/5">
                            <DropdownMenuItem onClick={() => setFilterVerified("all")} className="rounded-xl font-bold">{tran("admin.user_mng.all_users")}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterVerified("verified")} className="rounded-xl font-bold text-blue-600">{tran("admin.user_mng.verified")}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterVerified("unverified")} className="rounded-xl font-bold text-amber-600">{tran("admin.user_mng.unverified")}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-[12px] font-bold uppercase tracking-widest text-foreground opacity-80 border-l-2 border-primary pl-3">{tran("admin.user_mng.user_management_title")}</h2>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                            {filteredUsers.length} {tran("admin.user_mng.total_suffix")}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {filteredUsers?.length === 0 ? (
                        <div className="text-center py-20 bg-muted/10 rounded-2xl border-2 border-dashed border-border/40">
                            <UserX className="mx-auto h-12 w-12 text-muted-foreground/10 mb-3" />
                            <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider">{tran("admin.user_mng.no_matches")}</p>
                        </div>
                    ) : (
                        filteredUsers?.map((user) => (
                            <UserCard user={user} key={user.id} refetch={refetch} />
                        )))}
                </div>
            </div>
        </div>
    );
}
