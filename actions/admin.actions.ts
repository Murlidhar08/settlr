"use server";

import { getAppConfig } from "@/lib/app-config";
import { auth, getUserSession } from "@/lib/auth/auth";
import { UserRole, UserStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma/prisma";
import { headers } from "next/headers";

export async function getAdminAppConfig() {
    const session = await getUserSession();
    if (session?.user.role !== UserRole.admin) throw new Error("Unauthorized");

    return await getAppConfig();
}

export async function getAdminUsers() {
    const session = await getUserSession();
    if (session?.user.role !== UserRole.admin) throw new Error("Unauthorized");

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
        }
    });

    const users = filteredUsers.map((u: any) => {
        const counts = usersWithCounts.find(uc => uc.id === u.id);
        return {
            ...u,
            contactNo: counts?.contactNo,
        };
    });

    return users;
}

export async function comprehensiveDeleteUser(userId: string) {
    const session = await getUserSession();
    if (session?.user.role !== UserRole.admin) throw new Error("Unauthorized");

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Delete the user (this cascades to Session, Account, TwoFactor, UserSettings)
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

export async function updateUserStatus(userId: string, status: UserStatus) {
    const session = await getUserSession();
    if (session?.user.role !== UserRole.admin) throw new Error("Unauthorized");

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { status }
        });

        return { success: true };
    } catch (error: any) {
        console.error("Failed to update user status:", error);
        return { error: error.message || "Failed to update user status" };
    }
}
