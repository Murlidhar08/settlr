"use server";

import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FinancialAccountType, MoneyType, PartyType, CategoryType } from "@/lib/generated/prisma/enums";

export async function getFinancialAccounts() {
    const session = await getUserSession();
    if (!session || !session.session.activeBusinessId) {
        return [];
    }

    return await prisma.financialAccount.findMany({
        where: {
            businessId: session.session.activeBusinessId,
        },
        orderBy: {
            createdAt: "desc",
        },
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
    if (!session || !session.session.activeBusinessId) {
        throw new Error("Unauthorized");
    }

    const account = await prisma.financialAccount.create({
        data: {
            ...data,
            businessId: session.session.activeBusinessId,
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
    if (!session || !session.session.activeBusinessId) {
        throw new Error("Unauthorized");
    }

    const existing = await prisma.financialAccount.findUnique({
        where: { id, businessId: session.session.activeBusinessId }
    });

    if (existing?.isSystem) {
        throw new Error("System accounts cannot be modified");
    }

    const account = await prisma.financialAccount.update({
        where: {
            id,
            businessId: session.session.activeBusinessId,
        },
        data,
    });

    revalidatePath("/accounts");
    return account;
}

export async function deleteFinancialAccount(id: string) {
    const session = await getUserSession();
    if (!session || !session.session.activeBusinessId) {
        throw new Error("Unauthorized");
    }

    const existing = await prisma.financialAccount.findUnique({
        where: { id, businessId: session.session.activeBusinessId }
    });

    if (existing?.isSystem) {
        throw new Error("System accounts cannot be deleted");
    }

    // Check if account has transactions before deleting? 
    // Let's check for transactions
    const transactionCount = await prisma.transaction.count({
        where: {
            OR: [
                { fromAccountId: id },
                { toAccountId: id }
            ]
        }
    });

    if (transactionCount > 0) {
        throw new Error("Cannot delete account with transactions");
    }

    await prisma.financialAccount.delete({
        where: {
            id,
            businessId: session.session.activeBusinessId,
        },
    });

    revalidatePath("/accounts");
    return { success: true };
}

export async function getFinancialAccountsWithBalance() {
    const session = await getUserSession();
    if (!session || !session.session.activeBusinessId) {
        return [];
    }
    const businessId = session.session.activeBusinessId;

    const accounts = await prisma.financialAccount.findMany({
        where: { businessId },
        orderBy: { createdAt: "desc" },
    });

    const transactions = await prisma.transaction.findMany({
        where: { businessId },
        select: {
            amount: true,
            fromAccountId: true,
            toAccountId: true,
        },
    });

    const balances: Record<string, number> = {};
    transactions.forEach(tx => {
        const amount = Number(tx.amount);
        balances[tx.fromAccountId] = (balances[tx.fromAccountId] || 0) - amount;
        balances[tx.toAccountId] = (balances[tx.toAccountId] || 0) + amount;
    });

    return accounts.map(acc => ({
        ...acc,
        balance: balances[acc.id] || 0,
    }));
}
