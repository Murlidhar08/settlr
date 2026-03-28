import { auth, getUserSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/prisma";
import { ShieldAlert } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminStats } from "./components/admin-stats";
import { UserList } from "./components/user-list";

export default async function AdminPage() {
    const session = await getUserSession();

    // Guard: Only admins can access this page
    const isAdmin = session?.user.role === "admin";
    
    const usersList = isAdmin ? await auth.api.listUsers({
        headers: await headers(),
        query: { limit: 100, sortBy: "createdAt", sortDirection: "desc" },
    }) : null;

    if (!isAdmin) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="relative">
                    <div className="absolute -inset-8 bg-rose-500/10 rounded-full blur-3xl" />
                    <div className="relative p-6 bg-rose-500/5 rounded-2xl border border-rose-500/20 shadow-sm">
                        <ShieldAlert className="text-rose-500 h-12 w-12" strokeWidth={1.5} />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Access Restricted</h2>
                    <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
                        You do not have the necessary permissions to access this administrative resource.
                    </p>
                </div>
                <a href="/dashboard">
                    <button className="px-10 py-3 bg-foreground text-background font-semibold rounded-xl hover:shadow-lg transition-all active:scale-[0.98] text-[11px] uppercase tracking-widest">
                        Return to Dashboard
                    </button>
                </a>
            </div>
        );
    }

    // Hide context user from the list
    const filteredUsers = usersList?.users.filter((u: any) => u.id !== session.user.id) || [];

    // Fetch counts for these users from Prisma
    const usersWithCounts = await prisma.user.findMany({
        where: { id: { in: filteredUsers.map((u: any) => u.id) } },
        select: {
            id: true,
            contactNo: true,
            _count: {
                select: {
                    createdBusinesses: true,
                    transactions: true
                }
            }
        }
    });

    const users = filteredUsers.map((u: any) => {
        const counts = usersWithCounts.find(uc => uc.id === u.id);
        return {
            ...u,
            contactNo: counts?.contactNo,
            businessCount: counts?._count.createdBusinesses || 0,
            transactionCount: counts?._count.transactions || 0
        };
    });

    const totalUsers = users?.length || 0;
    const adminUsers = users?.filter((u: any) => u.role === "admin").length || 0;
    const bannedUsers = users?.filter((u: any) => u.banned).length || 0;
    const activeUsers = totalUsers - bannedUsers;

    return (
        <div className="flex-1 px-4 space-y-6 pb-32 pt-6">
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
