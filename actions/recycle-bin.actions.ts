"use server";

import { getUserSession } from "@/lib/auth/auth";
import { FinancialAccountType } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

export type DeletedItem = {
    id: string;
    name: string;
    type: "Business" | "FinancialAccount" | "Party" | "Transaction";
    category?: string;
    deletedAt: Date;
    details?: string;
};

export async function getDeletedItems() {
    const session = await getUserSession();
    if (!session || !session.user.id) {
        throw new Error("Unauthorized");
    }

    const businessId = session.user.activeBusinessId;

    // Fetch deleted items from all tables
    const [businesses, accounts, parties, transactions] = await Promise.all([
        prisma.business.findMany({
            where: { ownerId: session.user.id, isDelete: true },
            select: { id: true, name: true, updatedAt: true }
        }),
        businessId ? prisma.financialAccount.findMany({
            where: {
                businessId,
                isDelete: true,
                type: { not: FinancialAccountType.PARTY }
            },
            select: { id: true, name: true, type: true, updatedAt: true }
        }) : Promise.resolve([]),
        businessId ? prisma.party.findMany({
            where: { businessId, isDelete: true },
            select: { id: true, name: true, contactNo: true, updatedAt: true }
        }) : Promise.resolve([]),
        businessId ? prisma.transaction.findMany({
            where: { businessId, isDelete: true },
            select: { id: true, amount: true, date: true, description: true, updatedAt: true }
        }) : Promise.resolve([])
    ]);

    const items: DeletedItem[] = [
        ...businesses.map(b => ({
            id: b.id,
            name: b.name,
            type: "Business" as const,
            deletedAt: b.updatedAt,
        })),
        ...accounts.map(a => ({
            id: a.id,
            name: a.name,
            type: "FinancialAccount" as const,
            category: a.type,
            deletedAt: a.updatedAt,
        })),
        ...parties.map(p => ({
            id: p.id,
            name: p.name,
            type: "Party" as const,
            details: p.contactNo || undefined,
            deletedAt: p.updatedAt,
        })),
        ...transactions.map(t => ({
            id: t.id,
            name: `Transaction: ${t.amount}`,
            type: "Transaction" as const,
            details: t.description || undefined,
            deletedAt: t.updatedAt,
        }))
    ];

    return items.sort((a, b) => b.deletedAt.getTime() - a.deletedAt.getTime());
}

export async function restoreItem(id: string, type: DeletedItem["type"]) {
    const session = await getUserSession();
    if (!session) throw new Error("Unauthorized");

    const businessId = session.user.activeBusinessId;

    switch (type) {
        case "Business":
            await prisma.business.update({
                where: { id, ownerId: session.user.id },
                data: { isDelete: false }
            });
            break;
        case "FinancialAccount":
            if (!businessId) throw new Error("No active business");
            await prisma.financialAccount.update({
                where: { id, businessId },
                data: { isDelete: false }
            });
            break;
        case "Party":
            if (!businessId) throw new Error("No active business");
            await prisma.$transaction([
                prisma.party.update({
                    where: { id, businessId },
                    data: { isDelete: false }
                }),
                prisma.financialAccount.updateMany({
                    where: { partyId: id, businessId },
                    data: { isDelete: false }
                }),
                prisma.transaction.updateMany({
                    where: { partyId: id, businessId },
                    data: { isDelete: false }
                })
            ]);
            break;
        case "Transaction":
            if (!businessId) throw new Error("No active business");
            await prisma.transaction.update({
                where: { id, businessId },
                data: { isDelete: false }
            });
            break;
    }

    revalidatePath("/(app)/settings/recycle-bin");
    revalidatePath("/dashboard");
    revalidatePath("/accounts");
    revalidatePath("/parties");
    return { success: true };
}

export async function permanentlyDeleteItem(id: string, type: DeletedItem["type"]) {
    const session = await getUserSession();
    if (!session) throw new Error("Unauthorized");

    const businessId = session.user.activeBusinessId;

    switch (type) {
        case "Business":
            await prisma.business.delete({
                where: { id, ownerId: session.user.id }
            });
            break;
        case "FinancialAccount":
            if (!businessId) throw new Error("No active business");
            await prisma.financialAccount.delete({
                where: { id, businessId }
            });
            break;
        case "Party":
            if (!businessId) throw new Error("No active business");
            await prisma.$transaction([
                // First delete all related data
                prisma.transaction.deleteMany({
                    where: { partyId: id, businessId }
                }),
                prisma.financialAccount.deleteMany({
                    where: { partyId: id, businessId }
                }),
                prisma.party.delete({
                    where: { id, businessId }
                })
            ]);
            break;
        case "Transaction":
            if (!businessId) throw new Error("No active business");
            await prisma.transaction.delete({
                where: { id, businessId }
            });
            break;
    }

    revalidatePath("/(app)/settings/recycle-bin");
    return { success: true };
}

export async function emptyRecycleBin() {
    const session = await getUserSession();
    if (!session) throw new Error("Unauthorized");

    const businessId = session.user.activeBusinessId;

    await prisma.$transaction([
        prisma.transaction.deleteMany({
            where: { businessId: businessId || undefined, isDelete: true }
        }),
        prisma.party.deleteMany({
            where: { businessId: businessId || undefined, isDelete: true }
        }),
        prisma.financialAccount.deleteMany({
            where: { businessId: businessId || undefined, isDelete: true }
        }),
        prisma.business.deleteMany({
            where: { ownerId: session.user.id, isDelete: true }
        }),
    ]);

    revalidatePath("/(app)/settings/recycle-bin");
    return { success: true };
}
