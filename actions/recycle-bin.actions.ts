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
    if (!session || !session.user.id) throw new Error("Unauthorized");

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
    revalidatePath("/business");
    return { success: true };
}

export async function permanentlyDeleteItem(id: string, type: DeletedItem["type"]) {
    const session = await getUserSession();
    if (!session || !session.user.id) throw new Error("Unauthorized");

    const businessId = session.user.activeBusinessId;

    switch (type) {
        case "Business": {
            const business = await prisma.business.findFirst({
                where: { id, ownerId: session.user.id }
            });
            if (!business) throw new Error("Business not found");

            await prisma.$transaction([
                prisma.transaction.deleteMany({
                    where: { businessId: id }
                }),
                prisma.financialAccount.deleteMany({
                    where: { businessId: id }
                }),
                prisma.party.deleteMany({
                    where: { businessId: id }
                }),
                prisma.business.delete({
                    where: { id, ownerId: session.user.id }
                })
            ]);

            if (session.user.activeBusinessId === id) {
                const nextBusiness = await prisma.business.findFirst({
                    where: { ownerId: session.user.id, isDelete: false }
                });
                await prisma.user.update({
                    where: { id: session.user.id },
                    data: { activeBusinessId: nextBusiness?.id || null }
                });
            }
            break;
        }
        case "FinancialAccount": {
            if (!businessId) throw new Error("No active business");
            await prisma.$transaction([
                prisma.transaction.deleteMany({
                    where: {
                        businessId,
                        OR: [
                            { fromAccountId: id },
                            { toAccountId: id }
                        ]
                    }
                }),
                prisma.financialAccount.delete({
                    where: { id, businessId }
                })
            ]);
            break;
        }
        case "Party": {
            if (!businessId) throw new Error("No active business");
            const partyAccounts = await prisma.financialAccount.findMany({
                where: { partyId: id, businessId },
                select: { id: true }
            });
            const partyAccountIds = partyAccounts.map(a => a.id);

            await prisma.$transaction([
                prisma.transaction.deleteMany({
                    where: {
                        businessId,
                        OR: [
                            { partyId: id },
                            ...(partyAccountIds.length > 0 ? [
                                { fromAccountId: { in: partyAccountIds } },
                                { toAccountId: { in: partyAccountIds } }
                            ] : [])
                        ]
                    }
                }),
                prisma.financialAccount.deleteMany({
                    where: { partyId: id, businessId }
                }),
                prisma.party.delete({
                    where: { id, businessId }
                })
            ]);
            break;
        }
        case "Transaction": {
            if (!businessId) throw new Error("No active business");
            await prisma.transaction.delete({
                where: { id, businessId }
            });
            break;
        }
    }

    revalidatePath("/(app)/settings/recycle-bin");
    revalidatePath("/dashboard");
    revalidatePath("/accounts");
    revalidatePath("/parties");
    revalidatePath("/business");
    return { success: true };
}

export async function emptyRecycleBin() {
    const session = await getUserSession();
    if (!session || !session.user.id) throw new Error("Unauthorized");

    const businessId = session.user.activeBusinessId;

    // 1. Get all deleted businesses for this user
    const deletedBusinesses = await prisma.business.findMany({
        where: {
            ownerId: session.user.id,
            isDelete: true
        },
        select: { id: true }
    });
    const deletedBusinessIds = deletedBusinesses.map(b => b.id);

    // 2. If there are deleted businesses, clean up their child records first to respect FK constraints
    if (deletedBusinessIds.length > 0) {
        await prisma.$transaction([
            prisma.transaction.deleteMany({
                where: { businessId: { in: deletedBusinessIds } }
            }),
            prisma.financialAccount.deleteMany({
                where: { businessId: { in: deletedBusinessIds } }
            }),
            prisma.party.deleteMany({
                where: { businessId: { in: deletedBusinessIds } }
            }),
            prisma.business.deleteMany({
                where: { id: { in: deletedBusinessIds }, ownerId: session.user.id }
            })
        ]);

        // If the active business was deleted, switch to an active business or null
        if (businessId && deletedBusinessIds.includes(businessId)) {
            const nextBusiness = await prisma.business.findFirst({
                where: { ownerId: session.user.id, isDelete: false }
            });
            await prisma.user.update({
                where: { id: session.user.id },
                data: { activeBusinessId: nextBusiness?.id || null }
            });
        }
    }

    // 3. For the active business (if present and not deleted)
    const currentActiveBusinessId = (businessId && !deletedBusinessIds.includes(businessId))
        ? businessId
        : null;

    if (currentActiveBusinessId) {
        // Find deleted parties in active business
        const deletedParties = await prisma.party.findMany({
            where: { businessId: currentActiveBusinessId, isDelete: true },
            select: { id: true }
        });
        const deletedPartyIds = deletedParties.map(p => p.id);

        // Find deleted accounts (or accounts of deleted parties)
        const deletedAccounts = await prisma.financialAccount.findMany({
            where: {
                businessId: currentActiveBusinessId,
                OR: [
                    { isDelete: true },
                    ...(deletedPartyIds.length > 0 ? [{ partyId: { in: deletedPartyIds } }] : [])
                ]
            },
            select: { id: true }
        });
        const deletedAccountIds = deletedAccounts.map(a => a.id);

        const txConditions: any[] = [{ isDelete: true }];
        if (deletedPartyIds.length > 0) {
            txConditions.push({ partyId: { in: deletedPartyIds } });
        }
        if (deletedAccountIds.length > 0) {
            txConditions.push({ fromAccountId: { in: deletedAccountIds } });
            txConditions.push({ toAccountId: { in: deletedAccountIds } });
        }

        await prisma.$transaction([
            prisma.transaction.deleteMany({
                where: {
                    businessId: currentActiveBusinessId,
                    OR: txConditions
                }
            }),
            prisma.financialAccount.deleteMany({
                where: {
                    businessId: currentActiveBusinessId,
                    OR: [
                        { isDelete: true },
                        ...(deletedPartyIds.length > 0 ? [{ partyId: { in: deletedPartyIds } }] : [])
                    ]
                }
            }),
            prisma.party.deleteMany({
                where: {
                    businessId: currentActiveBusinessId,
                    isDelete: true
                }
            })
        ]);
    }

    revalidatePath("/(app)/settings/recycle-bin");
    revalidatePath("/dashboard");
    revalidatePath("/accounts");
    revalidatePath("/parties");
    revalidatePath("/business");
    return { success: true };
}
