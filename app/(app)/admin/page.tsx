import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminStats } from "./components/admin-stats";
import { UserList } from "./components/user-list";
import { UserType } from "@/lib/generated/prisma/enums";

export default async function AdminPage() {
    const session = await getUserSession();
    // Guard: Only admins can access this page
    if (!session || session.user.role !== UserType.ADMIN) {
        redirect("/dashboard");
    }

    // Fetch users using Prisma directly to avoid potential Better Auth API permission issues on the server
    let users = await prisma.user.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        take: 100
    });

    // Hide context user from the list
    users = users.filter((u: any) => u.id !== session.user.id);

    const totalUsers = users.length;
    const adminUsers = users.filter((u: any) => u.role === UserType.ADMIN).length;
    const bannedUsers = users.filter((u: any) => u.banned).length;
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
