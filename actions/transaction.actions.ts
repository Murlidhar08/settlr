"use server";

// Lib
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";
import { Transaction, Prisma } from "@/lib/generated/prisma/client";
import { MoneyType, FinancialAccountType, CategoryType } from "@/lib/generated/prisma/enums";
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache";

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
    prisma.financialAccount.findUnique({ where: { id: transactionData.fromAccountId } }),
    prisma.financialAccount.findUnique({ where: { id: transactionData.toAccountId } })
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
    const party = await prisma.party.findUnique({ where: { id: transactionData.partyId } });
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

export async function deleteTransaction(transactionId: string, partyId?: string) {
  const session = await getUserSession()

  if (!session?.user.activeBusinessId) {
    throw new Error("Unauthorized")
  }

  await prisma.transaction.delete({
    where: {
      id: transactionId,
      businessId: session.user.activeBusinessId,
    },
  })

  // Redirect after delete
  if (partyId)
    redirect(`/parties/${partyId}`)
  else
    redirect("/parties")

}

export async function getRecentTransactions() {
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
}

export async function getCashbookTransactions(filters: {
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
}

export async function getPartyStatement(partyId: string, filters: {
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
}

export async function getAccountTransactions(accountId: string) {
  const session = await getUserSession();
  const businessId = session?.user.activeBusinessId || "";

  const account = await prisma.financialAccount.findUnique({
    where: { id: accountId, businessId },
  });

  if (!account) {
    throw new Error("Account not found");
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      businessId,
      OR: [
        { fromAccountId: accountId },
        { toAccountId: accountId },
      ],
    },
    orderBy: { date: "desc" },
    include: {
      fromAccount: { select: { name: true, type: true } },
      toAccount: { select: { name: true, type: true } },
      party: { select: { name: true } }
    }
  });

  return {
    account,
    totalTransactions: transactions.length,
    transactions: transactions.map(tx => ({ ...tx, amount: Number(tx.amount) })),
  };
}
