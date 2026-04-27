"use server";

import { auth, getUserSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/prisma";
import { headers } from "next/headers";
import { getAppConfig } from "@/lib/app-config";

export async function getAdminAppConfig() {
    const session = await getUserSession();
    if (session?.user.role !== "admin") throw new Error("Unauthorized");

    return await getAppConfig();
}

export async function getAdminUsers() {
    const session = await getUserSession();
    if (session?.user.role !== "admin") throw new Error("Unauthorized");

    const usersList = await auth.api.listUsers({
        headers: await headers(),
        query: { limit: 100, sortBy: "createdAt", sortDirection: "desc" },
    });

    const filteredUsers = usersList.users.filter((u: any) => u.id !== session.user.id);

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

    return users;
}

export async function comprehensiveDeleteUser(userId: string) {
    const session = await getUserSession();
    if (session?.user.role !== "admin") throw new Error("Unauthorized");

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Find all businesses owned by the user
            const businesses = await tx.business.findMany({
                where: { ownerId: userId },
                select: { id: true }
            });
            const businessIds = businesses.map(b => b.id);

            // 2. Delete all parties in these businesses
            await tx.party.deleteMany({
                where: { businessId: { in: businessIds } }
            });

            // 3. Delete businesses (cascades to FinancialAccount and Transaction via businessId)
            await tx.business.deleteMany({
                where: { ownerId: userId }
            });

            // 4. Delete transactions created by the user (redundant if they only had their own businesses, but safe)
            await tx.transaction.deleteMany({
                where: { userId }
            });

            // 5. Delete the user (this cascades to Session, Account, TwoFactor, UserSettings)
            await tx.user.delete({
                where: { id: userId }
            });
        });

        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete user comprehensively:", error);
        return { error: error.message || "Failed to delete user" };
    }
}
