"use server";

// Lib
import { getUserSession } from "@/lib/auth/auth";
import { Prisma } from "@/lib/generated/prisma/client";
import { CategoryType, FinancialAccountType } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addTransaction(transactionData: any, pathToRevalidate?: string) {
  const session = await getUserSession();

  if (!session?.user.activeBusinessId) {
    throw new Error("No active business found in session");
  }

  const businessId = session.user.activeBusinessId;
  const userId = session.user.id;

  // Validation
  if (!transactionData.amount) throw new Error("Amount is required");
  if (!transactionData.fromAccountId) throw new Error("Source account is required");
  if (!transactionData.toAccountId) throw new Error("Destination account is required");

  // Fetch accounts to validate business and types
  const [fromAccount, toAccount] = await Promise.all([
    prisma.financialAccount.findUnique({ where: { id: transactionData.fromAccountId, isDelete: false } }),
    prisma.financialAccount.findUnique({ where: { id: transactionData.toAccountId, isDelete: false } })
  ]);

  if (!fromAccount || !toAccount) throw new Error("One or both accounts not found");

  // 1. BUSINESS ISOLATION
  if (fromAccount.businessId !== businessId || toAccount.businessId !== businessId) {
    throw new Error("Cross-business transactions are strictly prohibited.");
  }

  // 2. ACTIVE CHECK
  if (!fromAccount.isActive || !toAccount.isActive) {
    throw new Error("Cannot perform transactions with inactive accounts.");
  }

  // 3. CATEGORY TO CATEGORY RESTRICTION
  if (fromAccount.type === FinancialAccountType.CATEGORY && toAccount.type === FinancialAccountType.CATEGORY) {
    if (fromAccount.categoryType !== CategoryType.ADJUSTMENT && toAccount.categoryType !== CategoryType.ADJUSTMENT) {
      throw new Error("Direct Category to Category transfers are only allowed for Adjustments.");
    }
  }

  if (transactionData.partyId) {
    const party = await prisma.party.findUnique({ where: { id: transactionData.partyId, isDelete: false } });
    if (!party?.isActive) throw new Error("Cannot perform transactions with an inactive party.");
    if (party.businessId !== businessId) throw new Error("Party does not belong to this business.");
  }

  let result;

  // Handle Invalid Date
  const finalDate = (transactionData.date && !isNaN(new Date(transactionData.date).getTime()))
    ? new Date(transactionData.date)
    : new Date();

  // If id exists and not zero -> update
  if (!!transactionData.id) {
    result = await prisma.transaction.update({
      where: {
        id: transactionData.id,
      },
      data: {
        amount: new Prisma.Decimal(transactionData.amount),
        date: finalDate,
        description: transactionData.description || null,
        business: { connect: { id: businessId } },
        user: { connect: { id: userId } },
        fromAccount: { connect: { id: transactionData.fromAccountId } },
        toAccount: { connect: { id: transactionData.toAccountId } },
        party: transactionData.partyId
          ? { connect: { id: transactionData.partyId } }
          : { disconnect: true }
      },
    });
  }

  // Else -> create
  else {
    const createData: any = {
      amount: new Prisma.Decimal(transactionData.amount),
      date: finalDate,
      description: transactionData.description || null,
      business: { connect: { id: businessId } },
      user: { connect: { id: userId } },
      fromAccount: { connect: { id: transactionData.fromAccountId } },
      toAccount: { connect: { id: transactionData.toAccountId } },
    };

    if (transactionData.partyId) {
      createData.party = { connect: { id: transactionData.partyId } };
    }

    result = await prisma.transaction.create({
      data: createData,
    });
  }

  if (pathToRevalidate)
    revalidatePath(pathToRevalidate)

  return {
    ...result,
    amount: Number(result.amount)
  };
}

export async function deleteTransaction(transactionId: string, redirectPath?: string) {
  const session = await getUserSession()

  if (!session?.user.activeBusinessId) {
    throw new Error("Unauthorized")
  }

  await prisma.transaction.update({
    where: {
      id: transactionId,
      businessId: session.user.activeBusinessId,
    },
    data: {
      isDelete: true
    }
  })

  // Redirect after delete if path is provided
  if (redirectPath) {
    redirect(redirectPath as any)
  }

  return { success: true }
}

export const getRecentTransactions = async function getRecentTransactions() {
  const session = await getUserSession();
  let businessId = session?.user.activeBusinessId;

  if (!businessId && session?.user.id) {
    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true }
    });
    businessId = business?.id;
  }

  if (!businessId) return [];

  const transactions = await prisma.transaction.findMany({
    where: {
      businessId: businessId,
      isDelete: false
    },
    orderBy: {
      date: "desc",
    },
    take: 8,
    include: {
      party: {
        select: { name: true },
      },
      fromAccount: {
        select: { name: true, type: true }
      },
      toAccount: {
        select: { name: true, type: true }
      }
    },
  });

  return transactions.map(tx => ({
    ...tx,
    amount: Number(tx.amount)
  }));
};

export const getCashbookTransactions = async function getCashbookTransactions(filters: {
  category?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}) {
  const session = await getUserSession();
  let businessId = session?.user.activeBusinessId;

  if (!businessId && session?.user.id) {
    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true }
    });
    businessId = business?.id;
  }

  if (!businessId) return { transactions: [], totalIn: 0, totalOut: 0 };

  const where: any = {
    businessId,
    isDelete: false,
  };

  // Account type filter (Cash/Online) removed as mode is gone

  // Date range filter
  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) {
      const start = new Date(filters.startDate);
      start.setHours(0, 0, 0, 0);
      where.date.gte = start;
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate || filters.startDate!);
      end.setHours(23, 59, 59, 999);
      where.date.lte = end;
    }
  }

  // Search filter (description or amount)
  if (filters.search) {
    const searchNum = parseFloat(filters.search);
    where.OR = [
      { description: { contains: filters.search, mode: "insensitive" } },
      !isNaN(searchNum) ? { amount: { equals: searchNum } } : undefined,
    ].filter(Boolean);
  }

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: [
      { date: "desc" },
      { createdAt: "desc" },
    ],
    include: {
      fromAccount: { select: { name: true, type: true } },
      toAccount: { select: { name: true, type: true } },
      party: { select: { name: true } }
    }
  });

  let totalIn = 0;
  let totalOut = 0;

  transactions.forEach(tx => {
    const amount = Number(tx.amount);
    if (tx.toAccount.type === FinancialAccountType.MONEY) totalIn += amount;
    if (tx.fromAccount.type === FinancialAccountType.MONEY) totalOut += amount;
  });

  return {
    transactions: transactions.map(transaction => ({
      ...transaction,
      amount: Number(transaction.amount)
    })),
    totalIn,
    totalOut,
  };
};

export const getPartyStatement = async function getPartyStatement(partyId: string, filters: {
  mode?: string;
  direction?: string;
  startDate?: string;
  endDate?: string;
}) {
  const session = await getUserSession();
  const businessId = session?.user.activeBusinessId || "";

  const where: any = {
    businessId,
    partyId,
    isDelete: false,
  };

  // direction filter (translated to perspective in the component, but here we can handle it at DB if we know party account)
  if (filters.direction) {
    const partyAccount = await prisma.financialAccount.findFirst({
      where: { partyId, businessId },
      select: { id: true }
    });

    if (partyAccount) {
      if (filters.direction === "IN") {
        // Perspective IN means money flows FROM Party TO Us
        where.fromAccountId = partyAccount.id;
      } else if (filters.direction === "OUT") {
        // Perspective OUT means money flows FROM Us TO Party
        where.toAccountId = partyAccount.id;
      }
    }
  }

  // Date range filter
  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) {
      const start = new Date(filters.startDate);
      start.setHours(0, 0, 0, 0);
      where.date.gte = start;
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      where.date.lte = end;
    }
  }

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: "desc" },
    include: {
      fromAccount: { select: { name: true, type: true } },
      toAccount: { select: { name: true, type: true } }
    }
  });

  const party = await prisma.party.findUnique({
    where: { id: partyId },
    include: {
      financialAccounts: {
        select: { partyType: true },
        take: 1
      }
    }
  });

  const partyWithTyped = party ? {
    ...party,
    type: party.financialAccounts[0]?.partyType
  } : null;

  return {
    party: partyWithTyped,
    transactions: transactions.map(tx => ({ ...tx, amount: Number(tx.amount) })),
  };
};

export const getAccountStats = async function getAccountStats(accountId: string) {
  const session = await getUserSession();
  const businessId = session?.user.activeBusinessId || "";

  const account = await prisma.financialAccount.findUnique({
    where: { id: accountId, businessId },
  });

  if (!account) {
    throw new Error("Account not found");
  }

  const [inResult, outResult] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        businessId,
        toAccountId: accountId,
        isDelete: false,
      },
      _sum: {
        amount: true,
      },
    }),
    prisma.transaction.aggregate({
      where: {
        businessId,
        fromAccountId: accountId,
        isDelete: false,
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  const totalIn = Number(inResult._sum.amount || 0);
  const totalOut = Number(outResult._sum.amount || 0);

  // Logic for perspective flipping if it's a PARTY account
  // In Settlr, for a PARTY account:
  // getPartyTransactionPerspective flips the raw perspective.
  // raw IN (to party) => business perspective OUT
  // raw OUT (from party) => business perspective IN
  
  if (account.type === FinancialAccountType.PARTY) {
    return {
      totalIn: totalOut, // Flipped
      totalOut: totalIn, // Flipped
      balance: totalOut - totalIn,
    };
  }

  return {
    totalIn,
    totalOut,
    balance: totalIn - totalOut,
  };
};

export const getAccountTransactions = async function getAccountTransactions(
  accountId: string,
  pagination?: { limit?: number; page?: number }
) {
  const session = await getUserSession();
  const businessId = session?.user.activeBusinessId || "";

  const account = await prisma.financialAccount.findUnique({
    where: { id: accountId, businessId },
  });

  if (!account) {
    throw new Error("Account not found");
  }

  const limit = pagination?.limit || 20;
  const page = pagination?.page || 1;
  const skip = (page - 1) * limit;

  const [transactions, totalTransactions] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        businessId,
        OR: [
          { fromAccountId: accountId },
          { toAccountId: accountId },
        ],
        isDelete: false,
      },
      orderBy: { date: "desc" },
      take: limit,
      skip: skip,
      include: {
        fromAccount: { select: { name: true, type: true } },
        toAccount: { select: { name: true, type: true } },
        party: { select: { name: true } }
      }
    }),
    prisma.transaction.count({
      where: {
        businessId,
        OR: [
          { fromAccountId: accountId },
          { toAccountId: accountId },
        ],
        isDelete: false,
      }
    })
  ]);

  return {
    account,
    totalTransactions,
    transactions: transactions.map(tx => ({ ...tx, amount: Number(tx.amount) })),
  };
};

export const getBudgetInsights = async function getBudgetInsights() {
  const session = await getUserSession();
  const businessId = session?.user.activeBusinessId;

  if (!businessId) return null;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  // Fetch transactions for the current month
  const transactions = await prisma.transaction.findMany({
    where: {
      businessId,
      date: { gte: startOfMonth },
      isDelete: false
    },
    include: {
      fromAccount: { select: { name: true, type: true } },
      toAccount: { select: { name: true, type: true } }
    }
  });

  const categories: Record<string, number> = {};
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(tx => {
    const amount = Number(tx.amount);
    // Expense categorization
    if (tx.fromAccount.type === FinancialAccountType.MONEY && tx.toAccount.type === FinancialAccountType.CATEGORY) {
      categories[tx.toAccount.name] = (categories[tx.toAccount.name] || 0) + amount;
      totalExpense += amount;
    }
    // Income categorization
    if (tx.fromAccount.type === FinancialAccountType.CATEGORY && tx.toAccount.type === FinancialAccountType.MONEY) {
      totalIncome += amount;
    }
  });

  const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  const topExpense = sortedCategories[0];

  return {
    totalIncome,
    totalExpense,
    topExpense,
    hasTransactions: transactions.length > 0
  };
};

export async function getTransactionDetail(transactionId: string) {
  const session = await getUserSession();
  if (!session?.user.activeBusinessId) {
    throw new Error("Unauthorized");
  }

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      businessId: session.user.activeBusinessId,
    },
    include: {
      party: { select: { id: true, name: true, contactNo: true } },
      toAccount: { select: { id: true, name: true, type: true, moneyType: true, categoryType: true } },
      fromAccount: { select: { id: true, name: true, type: true, moneyType: true, categoryType: true } },
      user: { select: { name: true } }
    },
  });

  if (!transaction) return null;

  return {
    ...transaction,
    amount: Number(transaction.amount)
  };
}
