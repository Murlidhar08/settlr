"use client";

import { FooterButtons } from "@/components/footer-buttons";
import AppTabs from "@/components/tab/app-tabs";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/generated/prisma/enums";
import { tran } from "@/lib/languages/i18n";
import { useAdminUsers } from "@/tanstacks/admin";
import { Plus, Settings as SettingsIcon, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { AdminSkeleton } from "./admin-skeleton";
import { AdminStats } from "./admin-stats";
import { AppSettingsTab } from "./app-settings-tab";
import { UserList } from "./user-list";

export function AdminContent() {
    const { data: users, isLoading } = useAdminUsers();

    if (isLoading) {
        return <AdminSkeleton />;
    }

    if (!users) return null;

    const totalUsers = users.length;
    const adminUsers = users.filter((u: any) => u.role === UserRole.admin).length;
    const bannedUsers = users.filter((u: any) => u.banned).length;
    const activeUsers = totalUsers - bannedUsers;

    return (
        <div className="flex-1 px-4 pb-34 pt-6 max-w-7xl mx-auto w-full">
            <AppTabs
                defaultTab="user-management"
                tabs={[
                    {
                        id: "user-management",
                        label: tran("admin.user_mng.title"),
                        icon: <Users size={20} />,
                        content: (
                            <>
                                <AdminStats
                                    totalUsers={totalUsers}
                                    activeUsers={activeUsers}
                                    bannedUsers={bannedUsers}
                                    adminUsers={adminUsers}
                                />

                                <UserList />

                                <FooterButtons bottomSpace={true}>
                                    <Button onClick={() => { redirect('/user/add' as any) }} className="h-14 w-14 md:w-auto md:px-12 rounded-full md:gap-3 font-semibold uppercase bg-primary text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 p-0 md:py-2">
                                        <Plus className="size-5 md:size-6" />
                                        <span className="hidden md:block text-center font-black tracking-[0.2em] text-sm">
                                            Add User
                                        </span>
                                    </Button>
                                </FooterButtons>
                            </>
                        )
                    },
                    {
                        id: "application-settings",
                        hidden: true,
                        label: tran("admin.app_config.title"),
                        icon: <SettingsIcon size={20} />,
                        content: <AppSettingsTab />
                    }
                ]}
            />
        </div>
    );
}
