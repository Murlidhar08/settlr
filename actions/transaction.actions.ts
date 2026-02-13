"use server";

// Lib
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addTransaction(data: {
  amount: number;
  date: Date;
  description?: string;
  fromAccountId: string;
  toAccountId: string;
  partyId?: string; // Optional linkage, mainly for reference
}, pathToRevalidate?: string) {
  const session = await getUserSession();
  if (!session?.session.activeBusinessId) throw new Error("Unauthorized");

  const businessId = session.session.activeBusinessId;
  const userId = session.user.id;

  // Validate accounts exist and belong to business
  const count = await prisma.financialAccount.count({
    where: {
      businessId,
      id: { in: [data.fromAccountId, data.toAccountId] },
    },
  });

  if (count !== 2) throw new Error("Invalid accounts provided");

  const transaction = await prisma.transaction.create({
    data: {
      businessId,
      amount: data.amount,
      date: data.date,
      description: data.description,
      fromAccountId: data.fromAccountId,
      toAccountId: data.toAccountId,
      userId,
      partyId: data.partyId,
    },
  });

  if (pathToRevalidate) revalidatePath(pathToRevalidate);

  return transaction;
}

export async function deleteTransaction(transactionId: string) {
  const session = await getUserSession();
  if (!session?.session.activeBusinessId) throw new Error("Unauthorized");

  await prisma.transaction.delete({
    where: {
      id: transactionId,
      businessId: session.session.activeBusinessId,
    },
  });

  revalidatePath("/accounts");
}


import { AccountType } from "@/lib/generated/prisma/client";
import { PaymentMode, TransactionDirection } from "@/types/enums";


export async function addSmartTransaction(data: {
  amount: number;
  date: Date;
  description?: string;
  mode: PaymentMode;
  direction: TransactionDirection;
  partyId?: string | null;
}, path?: string) {
  const session = await getUserSession();
  if (!session?.session.activeBusinessId) throw new Error("Unauthorized");

  const businessId = session.session.activeBusinessId;

  // 1. Resolve "Payment" Account (Cash or Bank)
  const paymentAccountType = data.mode === PaymentMode.CASH ? AccountType.CASH : AccountType.BANK;

  let paymentAccount = await prisma.financialAccount.findFirst({
    where: { businessId, type: paymentAccountType },
  });

  // Auto-create default payment account if missing
  if (!paymentAccount) {
    paymentAccount = await prisma.financialAccount.create({
      data: {
        businessId,
        name: data.mode === PaymentMode.CASH ? "Cash Account" : "Bank Account",
        type: paymentAccountType,
      }
    });
  }

  // 2. Resolve "Other" Account (Party, Income, or Expense)
  let otherAccount;

  if (data.partyId) {
    // Find account linked to party
    otherAccount = await prisma.financialAccount.findFirst({
      where: { businessId, partyId: data.partyId }
    });

    // Auto-create party account if missing (should exist if party exists, but safety net)
    if (!otherAccount) {
      const party = await prisma.party.findUnique({ where: { id: data.partyId } });
      if (!party) throw new Error("Party not found");

      otherAccount = await prisma.financialAccount.create({
        data: {
          businessId,
          name: party.name,
          type: AccountType.PARTY,
          partyId: data.partyId,
        }
      });
    }
  } else {
    // No party -> Income or Expense
    const targetType = data.direction === TransactionDirection.IN ? AccountType.INCOME : AccountType.EXPENSE;
    const defaultName = data.direction === TransactionDirection.IN ? "General Income" : "General Expense";

    otherAccount = await prisma.financialAccount.findFirst({
      where: { businessId, type: targetType, name: defaultName }
    });

    if (!otherAccount) {
      otherAccount = await prisma.financialAccount.create({
        data: {
          businessId,
          name: defaultName,
          type: targetType
        }
      });
    }
  }

  // 3. Determine From/To based on Direction
  // IN: Other -> Payment (Money comes in)
  // OUT: Payment -> Other (Money goes out)
  const fromAccountId = data.direction === TransactionDirection.IN ? otherAccount.id : paymentAccount.id;
  const toAccountId = data.direction === TransactionDirection.IN ? paymentAccount.id : otherAccount.id;

  return await addTransaction({
    amount: data.amount,
    date: data.date,
    description: data.description,
    fromAccountId,
    toAccountId,
    partyId: data.partyId || undefined,
  }, path);
}

export async function getCashbookTransactions(params: {
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}) {
  const session = await getUserSession();
  const businessId = session?.session.activeBusinessId;
  if (!businessId) return { transactions: [], totalIn: 0, totalOut: 0 };

  // Find all Cash accounts
  const cashAccounts = await prisma.financialAccount.findMany({
    where: { businessId, type: AccountType.CASH },
    select: { id: true }
  });
  const cashAccountIds = cashAccounts.map(c => c.id);

  if (cashAccountIds.length === 0) return { transactions: [], totalIn: 0, totalOut: 0 };

  const whereCondition: any = {
    businessId,
    OR: [
      { fromAccountId: { in: cashAccountIds } },
      { toAccountId: { in: cashAccountIds } }
    ]
  };

  if (params.startDate && params.endDate) {
    whereCondition.date = {
      gte: new Date(params.startDate),
      lte: new Date(params.endDate),
    };
  }

  // Fetch transactions
  const transactions = await prisma.transaction.findMany({
    where: whereCondition,
    orderBy: { date: "desc" },
    include: {
      fromAccount: true,
      toAccount: true,
      party: true,
    }
  });

  // Process for frontend (add derived direction/mode)
  const formattedTransactions = transactions.map(tx => {
    // If money goes TO a cash account, it's IN (Receipt)
    const isIn = cashAccountIds.includes(tx.toAccountId);
    return {
      ...tx,
      amount: tx.amount.toNumber(),
      direction: isIn ? TransactionDirection.IN : TransactionDirection.OUT,
      mode: PaymentMode.CASH, // Implicit for cashbook
      otherAccountName: isIn ? tx.fromAccount.name : tx.toAccount.name
    };
  });

  // Calculate totals
  const totalIn = formattedTransactions
    .filter(t => t.direction === TransactionDirection.IN)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = formattedTransactions
    .filter(t => t.direction === TransactionDirection.OUT)
    .reduce((sum, t) => sum + t.amount, 0);

  return { transactions: formattedTransactions, totalIn, totalOut };
}

export async function getPartyTransactions(partyId: string) {
  const session = await getUserSession();
  const businessId = session?.session.activeBusinessId;
  if (!businessId) return { transactions: [], totalIn: 0, totalOut: 0 };

  const transactions = await prisma.transaction.findMany({
    where: { businessId, partyId },
    orderBy: { date: "desc" },
    include: {
      fromAccount: true,
      toAccount: true,
    }
  });

  // Resolve party account
  const partyAccount = await prisma.financialAccount.findFirst({
    where: { businessId, partyId }
  });

  if (!partyAccount) return { transactions: [], totalIn: 0, totalOut: 0 };

  const formattedTransactions = transactions.map(tx => {
    const isReceivedFromParty = tx.fromAccountId === partyAccount.id;

    // Determine the type of the OTHER account involved in the transaction
    const otherSideType = isReceivedFromParty ? tx.toAccount.type : tx.fromAccount.type;

    let mode = PaymentMode.OTHER;
    if (otherSideType === 'CASH') mode = PaymentMode.CASH;
    if (otherSideType === 'BANK') mode = PaymentMode.ONLINE;

    return {
      ...tx,
      amount: tx.amount.toNumber(),
      direction: isReceivedFromParty ? TransactionDirection.IN : TransactionDirection.OUT,
      mode: mode,
    };
  });

  const totalIn = formattedTransactions
    .filter(t => t.direction === TransactionDirection.IN)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = formattedTransactions
    .filter(t => t.direction === TransactionDirection.OUT)
    .reduce((sum, t) => sum + t.amount, 0);

  return { transactions: formattedTransactions, totalIn, totalOut };
}

export async function getRecentTransactions() {
  const session = await getUserSession();
  const businessId = session?.session.activeBusinessId;

  if (!businessId) return [];

  return await prisma.transaction.findMany({
    where: {
      businessId,
    },
    orderBy: {
      date: "desc",
    },
    take: 10,
    include: {
      fromAccount: { select: { name: true, type: true } },
      toAccount: { select: { name: true, type: true } },
      party: { select: { name: true } },
    },
  });
}

export async function getPartyStatement(partyId: string, filters?: {
  mode?: string;
  direction?: string;
  startDate?: string;
  endDate?: string
}) {
  const session = await getUserSession();
  const businessId = session?.session.activeBusinessId;
  if (!businessId) return { party: null, transactions: [] };

  const party = await prisma.party.findUnique({
    where: { id: partyId },
    select: { name: true, contactNo: true, profileUrl: true }
  });

  if (!party) return { party: null, transactions: [] };

  const where: any = { businessId, partyId };
  if (filters?.startDate && filters?.endDate) {
    where.date = {
      gte: new Date(filters.startDate),
      lte: new Date(filters.endDate)
    };
  }

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: "desc" },
    include: { fromAccount: true, toAccount: true }
  });

  const partyAccount = await prisma.financialAccount.findFirst({
    where: { businessId, partyId }
  });

  if (!partyAccount) return { party, transactions: [] };

  let formatted = transactions.map(tx => {
    const isReceivedFromParty = tx.fromAccountId === partyAccount.id;
    const otherSideType = isReceivedFromParty ? tx.toAccount.type : tx.fromAccount.type;
    let mode = PaymentMode.OTHER;
    if (otherSideType === 'CASH') mode = PaymentMode.CASH;
    if (otherSideType === 'BANK') mode = PaymentMode.ONLINE;

    return {
      ...tx,
      amount: tx.amount.toNumber(),
      direction: isReceivedFromParty ? TransactionDirection.IN : TransactionDirection.OUT,
      mode
    };
  });

  if (filters?.direction) {
    formatted = formatted.filter(t => t.direction === filters.direction);
  }
  if (filters?.mode) {
    formatted = formatted.filter(t => t.mode === filters.mode);
  }

  return { party, transactions: formatted };
}
