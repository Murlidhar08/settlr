"use client";

import { useAdminUsers } from "@/tanstacks/admin";
import { AdminSkeleton } from "./admin-skeleton";
import { AdminStats } from "./admin-stats";
import { UserList } from "./user-list";

export function AdminContent() {
    const { data: users, isLoading } = useAdminUsers();

    if (isLoading) {
        return <AdminSkeleton />;
    }

    if (!users) return null;

    const totalUsers = users.length;
    const adminUsers = users.filter((u: any) => u.role === "admin").length;
    const bannedUsers = users.filter((u: any) => u.banned).length;
    const activeUsers = totalUsers - bannedUsers;

    return (
        <div className="flex-1 px-4 space-y-6 pb-34 pt-6">
            {/* Stats Grid */}
            <AdminStats
                totalUsers={totalUsers}
                activeUsers={activeUsers}
                bannedUsers={bannedUsers}
                adminUsers={adminUsers}
            />

            {/* Main Content */}
            <UserList />
        </div>
    );
}
