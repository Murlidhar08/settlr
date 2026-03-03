import { auth, getUserSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminStats } from "./components/admin-stats";
import { UserList } from "./components/user-list";
import { authClient } from "@/lib/auth-client";
import { ShieldAlert } from "lucide-react";
import { headers } from "next/headers";

export default async function AdminPage() {
    const session = await getUserSession();

    // Guard: Only admins can access this page
    const isAdmin = session?.user.role === "admin";
    if (!isAdmin) {
        redirect("/dashboard");
    }

    const usersList = await auth.api.listUsers({
        headers: await headers(),
        query: { limit: 100, sortBy: "createdAt", sortDirection: "desc" },
    })

    if (!isAdmin) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="group relative">
                    <div className="absolute -inset-4 bg-rose-500/20 rounded-full blur-2xl group-hover:bg-rose-500/30 transition-all duration-500" />
                    <div className="relative p-6 bg-rose-500/10 rounded-[2.5rem] border border-rose-500/20 shadow-2xl shadow-rose-500/10">
                        <ShieldAlert className="text-rose-500 h-16 w-16" strokeWidth={1.5} />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-foreground">Access Restricted</h2>
                    <p className="text-muted-foreground font-semibold max-w-sm mx-auto leading-relaxed italic">
                        &quot;{"You do not have the necessary permissions to access this administrative resource."}&quot;
                    </p>
                </div>
                <div className="flex gap-4">
                    <a href="/dashboard">
                        <button className="px-8 py-3 bg-foreground text-background font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-foreground/10 active:scale-95 text-xs uppercase tracking-widest">
                            Go Back
                        </button>
                    </a>
                </div>
            </div>
        );
    }

    // Hide context user from the list
    const users = usersList?.users.filter((u: any) => u.id !== session.user.id);

    const totalUsers = users?.length || 0;
    const adminUsers = users?.filter((u: any) => u.role === "admin").length || 0;
    const bannedUsers = users?.filter((u: any) => u.banned).length || 0;
    const activeUsers = totalUsers - bannedUsers;

    return (
        <div className="flex-1 px-4 space-y-6 sm:space-y-8 pb-32 pt-4">
            {/* Stats Grid */}
            <AdminStats
                totalUsers={totalUsers}
                activeUsers={activeUsers}
                bannedUsers={bannedUsers}
                adminUsers={adminUsers}
            />

            {/* Main Content */}
            <UserList initialUsers={users as any} />
        </div>
    );
}
