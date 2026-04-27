"use client";

import { useAdminUsers } from "@/tanstacks/admin";
import { AdminSkeleton } from "./admin-skeleton";
import { AdminStats } from "./admin-stats";
import { UserList } from "./user-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Settings as SettingsIcon } from "lucide-react";
import { AppSettingsTab } from "./app-settings-tab";

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
        <div className="flex-1 px-4 pb-34 pt-6 max-w-7xl mx-auto w-full">
            <Tabs defaultValue="users" className="space-y-6">
                <div className="flex items-center justify-between">
                    <TabsList className="bg-muted/50 p-1 rounded-xl">
                        <TabsTrigger value="users" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Users className="w-4 h-4" />
                            User Management
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <SettingsIcon className="w-4 h-4" />
                            Application Settings
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="users" className="space-y-6 outline-none">
                    <AdminStats
                        totalUsers={totalUsers}
                        activeUsers={activeUsers}
                        bannedUsers={bannedUsers}
                        adminUsers={adminUsers}
                    />
                    <UserList />
                </TabsContent>

                <TabsContent value="settings" className="outline-none">
                    <AppSettingsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
