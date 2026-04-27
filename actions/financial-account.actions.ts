"use server";

import { getUserSession } from "@/lib/auth/auth";
import { CategoryType, FinancialAccountType, MoneyType, PartyType } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

export async function getFinancialAccounts(includeInactive: boolean = false) {
    const session = await getUserSession();
    if (!session || !session.user.activeBusinessId) {
        return [];
    }

    const where: any = {
        businessId: session.user.activeBusinessId,
        isDelete: false,
    };

    if (!includeInactive) {
        where.isActive = true;
    }

    return await prisma.financialAccount.findMany({
        where
    });
}

export async function addFinancialAccount(data: {
    name: string;
    type: FinancialAccountType;
    moneyType?: MoneyType | null;
    partyType?: PartyType | null;
    categoryType?: CategoryType | null;
    partyId?: string | null;
}) {
    const session = await getUserSession();
    if (!session || !session.user.activeBusinessId) {
        throw new Error("Unauthorized");
    }

    const account = await prisma.financialAccount.create({
        data: {
            ...data,
            businessId: session.user.activeBusinessId,
        },
    });

    revalidatePath("/accounts");
    return account;
}

export async function updateFinancialAccount(id: string, data: {
    name: string;
    type: FinancialAccountType;
    moneyType?: MoneyType | null;
    partyType?: PartyType | null;
    categoryType?: CategoryType | null;
    partyId?: string | null;
}) {
    const session = await getUserSession();
    if (!session || !session.user.activeBusinessId) {
        throw new Error("Unauthorized");
    }

    const existing = await prisma.financialAccount.findUnique({
        where: { id, businessId: session.user.activeBusinessId, isDelete: false }
    });

    if (existing?.isSystem) {
        // For system accounts, we only allow updating the name.
        // We prevent updating type, types, or any other metadata.
        if (existing.type !== data.type ||
            existing.moneyType !== data.moneyType ||
            existing.partyType !== data.partyType ||
            existing.categoryType !== data.categoryType) {
            throw new Error("System account properties (Type/Category) cannot be modified. Only renaming is allowed.");
        }
    } else if (existing?.type !== data.type) {
        throw new Error("Account type cannot be changed. Please create a new account or perform a migration.");
    }

    const account = await prisma.financialAccount.update({
        where: {
            id,
            businessId: session.user.activeBusinessId,
        },
        data,
    });

    revalidatePath("/accounts");
    return account;
}

export async function deleteFinancialAccount(id: string) {
    const session = await getUserSession();
    if (!session || !session.user.activeBusinessId) {
        throw new Error("Unauthorized");
    }

    const existing = await prisma.financialAccount.findUnique({
        where: { id, businessId: session.user.activeBusinessId, isDelete: false }
    });

    if (!existing) {
        throw new Error("Account not found");
    }

    if (existing.isSystem) {
        throw new Error("System accounts cannot be deleted");
    }

    const transactionCount = await prisma.transaction.count({
        where: {
            OR: [
                { fromAccountId: id },
                { toAccountId: id }
            ],
            isDelete: false
        }
    });

    await prisma.financialAccount.update({
        where: { id, businessId: session.user.activeBusinessId },
        data: { isDelete: true }
    });

    revalidatePath("/accounts");
    return {
        success: true,
        message: transactionCount > 0
            ? "Account moved to recycle bin as it has transaction history."
            : "Account moved to recycle bin."
    };
}

export async function getFinancialAccountBalance(accountId: string) {
    const session = await getUserSession();
    if (!session || !session.user.activeBusinessId) {
        return 0;
    }

    const [totalIn, totalOut] = await Promise.all([
        prisma.transaction.aggregate({
            where: {
                toAccountId: accountId,
                businessId: session.user.activeBusinessId,
                isDelete: false,
            },
            _sum: {
                amount: true,
            },
        }),
        prisma.transaction.aggregate({
            where: {
                fromAccountId: accountId,
                businessId: session.user.activeBusinessId,
                isDelete: false,
            },
            _sum: {
                amount: true,
            },
        }),
    ]);

    return Number(totalIn._sum.amount || 0) - Number(totalOut._sum.amount || 0);
}

export async function toggleFinancialAccountActive(id: string, isActive: boolean) {
    const session = await getUserSession();
    if (!session || !session.user.activeBusinessId) {
        throw new Error("Unauthorized");
    }

    const account = await prisma.financialAccount.update({
        where: {
            id,
            businessId: session.user.activeBusinessId,
        },
        data: {
            isActive,
        },
    });

    revalidatePath("/accounts");
    revalidatePath(`/accounts/${id}`);
    return account;
}

export async function setAccountAsDefault(accountId: string, type: 'GENERAL' | 'INCOME' | 'EXPENSE') {
    const session = await getUserSession();
    if (!session || !session.user.activeBusinessId) {
        throw new Error("Unauthorized");
    }

    const businessId = session.user.activeBusinessId;

    const data: any = {};
    if (type === 'GENERAL') data.defAccId = accountId;
    if (type === 'INCOME') data.defIncomeAccId = accountId;
    if (type === 'EXPENSE') data.defExpenseAccId = accountId;

    await prisma.business.update({
        where: { id: businessId, ownerId: session.user.id },
        data
    });

    revalidatePath("/accounts");
    revalidatePath("/dashboard");
    return { success: true };
}
