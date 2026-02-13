"use server";

import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";
import { AccountType, FinancialAccount } from "@/lib/generated/prisma/client"; // Check import path
import { revalidatePath } from "next/cache";

// Type definition for creating an account
export type CreateAccountData = {
    name: string;
    type: AccountType;
    openingBalance?: number;
    partyId?: string;
};

// Helper to get active business ID
async function getBusinessId() {
    const session = await getUserSession();
    if (!session?.session.activeBusinessId) throw new Error("No active business");
    return session.session.activeBusinessId;
}

export async function getAccounts(businessId?: string) {
    const currentBusinessId = businessId || (await getBusinessId());

    const accounts = await prisma.financialAccount.findMany({
        where: { businessId: currentBusinessId },
        include: {
            _count: {
                select: { sentTransactions: true, receivedTransactions: true },
            },
        },
        orderBy: { name: "asc" },
    });

    // Calculate balances
    // We need to aggregate transactions for each account.
    // Ideally, we'd use a raw query or groupBy, but for now we can do individual aggregations or fetch all transactions if volume is low.
    // Better approach: prisma.transaction.groupBy

    const [incoming, outgoing] = await Promise.all([
        prisma.transaction.groupBy({
            by: ["toAccountId"],
            where: { businessId: currentBusinessId },
            _sum: { amount: true },
        }),
        prisma.transaction.groupBy({
            by: ["fromAccountId"],
            where: { businessId: currentBusinessId },
            _sum: { amount: true },
        }),
    ]);

    const accountBalances = accounts.map((account) => {
        const totalIncoming =
            incoming.find((i) => i.toAccountId === account.id)?._sum.amount?.toNumber() || 0;
        const totalOutgoing =
            outgoing.find((o) => o.fromAccountId === account.id)?._sum.amount?.toNumber() || 0;

        return {
            ...account,
            balance: totalIncoming - totalOutgoing,
            totalIncoming,
            totalOutgoing,
        };
    });

    return accountBalances;
}

export async function createAccount(data: CreateAccountData) {
    const businessId = await getBusinessId();
    const session = await getUserSession(); // For transaction userId

    // check if account name exists
    const existing = await prisma.financialAccount.findFirst({
        where: { businessId, name: data.name },
    });
    if (existing) throw new Error("Account name already exists");

    // Create the account
    const account = await prisma.financialAccount.create({
        data: {
            businessId,
            name: data.name,
            type: data.type,
            partyId: data.partyId,
        },
    });

    // Handle Opening Balance
    if (data.openingBalance && data.openingBalance !== 0) {
        // specific "Opening Balance" account
        let openingAccount = await prisma.financialAccount.findFirst({
            where: { businessId, name: "Opening Balance Adjustments", isSystem: true },
        });

        if (!openingAccount) {
            openingAccount = await prisma.financialAccount.create({
                data: {
                    businessId,
                    name: "Opening Balance Adjustments",
                    type: "OPENING_BALANCE",
                    isSystem: true,
                },
            });
        }

        const amount = Math.abs(data.openingBalance);
        const isPositive = data.openingBalance > 0;

        await prisma.transaction.create({
            data: {
                businessId,
                amount,
                date: new Date(),
                description: "Opening Balance",
                userId: session?.user.id || "",
                fromAccountId: isPositive ? openingAccount.id : account.id,
                toAccountId: isPositive ? account.id : openingAccount.id,
            },
        });
    }

    revalidatePath("/accounts");
    return account;
}

export async function getAccountDetails(accountId: string) {
    const businessId = await getBusinessId();

    const account = await prisma.financialAccount.findFirst({
        where: { id: accountId, businessId },
    });

    if (!account) throw new Error("Account not found");

    const transactions = await prisma.transaction.findMany({
        where: {
            businessId,
            OR: [{ fromAccountId: accountId }, { toAccountId: accountId }],
        },
        include: {
            fromAccount: { select: { name: true, type: true } },
            toAccount: { select: { name: true, type: true } },
        },
        orderBy: { date: "desc" },
    });

    // Calculate stats
    let totalIncoming = 0;
    let totalOutgoing = 0;

    const formattedTransactions = transactions.map(tx => {
        const amount = tx.amount.toNumber();
        if (tx.toAccountId === accountId) totalIncoming += amount;
        if (tx.fromAccountId === accountId) totalOutgoing += amount;

        return {
            ...tx,
            amount,
            type: tx.toAccountId === accountId ? 'IN' : 'OUT',
            otherAccountName: tx.toAccountId === accountId ? tx.fromAccount.name : tx.toAccount.name
        };
    });

    return {
        account,
        balance: totalIncoming - totalOutgoing,
        totalIncoming,
        totalOutgoing,
        transactions: formattedTransactions,
    };
}
