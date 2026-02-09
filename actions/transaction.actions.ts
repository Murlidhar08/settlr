"use server";

// Lib
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";
import { Transaction } from "@/lib/generated/prisma/client";
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache";

export async function addTransaction(transactionData: Transaction, pathToRevalidate?: string) {
  const session = await getUserSession();
  let result

  // If id exists and not zero -> update
  if (!!transactionData.id) {
    result = await prisma.transaction.update({
      where: {
        id: transactionData.id,
      },
      data: {
        businessId: transactionData.businessId,
        amount: transactionData.amount,
        date: transactionData.date,
        description: transactionData.description,
        mode: transactionData.mode,
        direction: transactionData.direction,
        partyId: transactionData.partyId,
        userId: transactionData.userId,
      },
    });
  }

  // Else -> create
  else {
    result = await prisma.transaction.create({
      data: {
        businessId: session?.session.activeBusinessId || "",
        amount: transactionData.amount,
        date: transactionData.date,
        description: transactionData.description,
        mode: transactionData.mode,
        direction: transactionData.direction,
        partyId: transactionData.partyId,
        userId: session?.user.id || "",
      },
    });
  }

  if (pathToRevalidate)
    revalidatePath(pathToRevalidate)

  return result;
}

export async function deleteTransaction(transactionId: string, partyId?: string) {
  const session = await getUserSession()

  if (!session?.session.activeBusinessId) {
    throw new Error("Unauthorized")
  }

  await prisma.transaction.delete({
    where: {
      id: transactionId,
      businessId: session.session.activeBusinessId,
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
  let businessId = session?.session.activeBusinessId;

  if (!businessId && session?.user.id) {
    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true }
    });
    businessId = business?.id;
  }

  if (!businessId) return [];

  return await prisma.transaction.findMany({
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
    },
  });
}

export async function getCashbookTransactions(filters: {
  category?: string;
  search?: string;
  date?: string;
}) {
  const session = await getUserSession();
  let businessId = session?.session.activeBusinessId;

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
    partyId: null, // Cashbook transactions are those without a party
  };

  // Category filter (Cash/Online)
  if (filters.category === "Cash") {
    where.mode = "CASH";
  } else if (filters.category === "Online") {
    where.mode = { not: "CASH" };
  }

  // Date filter (defaults to today if specified in the logic)
  if (filters.date) {
    const startOfDay = new Date(filters.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(filters.date);
    endOfDay.setHours(23, 59, 59, 999);

    where.date = {
      gte: startOfDay,
      lte: endOfDay,
    };
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
  });

  let totalIn = 0;
  let totalOut = 0;

  transactions.forEach((tx) => {
    const amount = Number(tx.amount);
    if (tx.direction === "IN") totalIn += amount;
    else totalOut += amount;
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
  const businessId = session?.session.activeBusinessId || "";

  const where: any = {
    businessId,
    partyId,
  };

  // Mode filter
  if (filters.mode === "Cash") {
    where.mode = "CASH";
  } else if (filters.mode === "Online") {
    where.mode = { not: "CASH" };
  }

  // Direction filter
  if (filters.direction === "IN" || filters.direction === "OUT") {
    where.direction = filters.direction;
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
  });

  const party = await prisma.party.findUnique({
    where: { id: partyId },
  });

  return {
    party,
    transactions: transactions.map(tx => ({ ...tx, amount: Number(tx.amount) })),
  };
}
