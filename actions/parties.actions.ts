"use server";

// Package
import { getUserSession } from "@/lib/auth/auth";
import { Transaction } from "@/lib/generated/prisma/client";
import { FinancialAccountType, PartyType } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma/prisma";
import { calculateAccountStats } from "@/lib/transaction-logic";
import { PartyInput, PartyRes } from "@/types/party/PartyRes";
import { revalidatePath } from "next/cache";

export async function getPartyDetails(partyId: string) {
  return await prisma.party.findFirst({
    where: { id: partyId, isDelete: false },
    select: {
      id: true,
      name: true,
      contactNo: true,
      isActive: true,
      financialAccounts: {
        select: { id: true, partyType: true },
        take: 1
      }
    }
  })
}

export async function getPartyList(type: PartyType, search?: string, includeInactive: boolean = false): Promise<PartyRes[]> {
  const session = await getUserSession();
  const businessId = session?.user?.activeBusinessId;
  if (!businessId)
    return [];

  const where: any = {
    businessId,
    isDelete: false,
    financialAccounts: {
      some: {
        partyType: type,
        isDelete: false,
      }
    }
  };

  if (!includeInactive) {
    where.isActive = true;
    where.financialAccounts.some.isActive = true;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { contactNo: { contains: search, mode: "insensitive" } },
    ];
  }

  // 1. Fetch parties without transactions
  const parties = await prisma.party.findMany({
    where,
    select: {
      id: true,
      name: true,
      contactNo: true,
      profileUrl: true,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  if (parties.length === 0)
    return [];

  const partyIds = parties.map(p => p.id);

  // 2. Fetch all transactions for these parties and their financial accounts
  const transactions = await prisma.transaction.findMany({
    where: {
      businessId,
      partyId: { in: partyIds },
      isDelete: false
    },
    select: {
      partyId: true,
      amount: true,
      fromAccountId: true,
      toAccountId: true,
    }
  });

  // 3. Get party financial accounts
  const partyAccounts = await prisma.financialAccount.findMany({
    where: {
      businessId,
      partyId: { in: partyIds },
      isDelete: false
    },
    select: {
      id: true,
      partyId: true
    }
  });

  const accountMap = new Map(partyAccounts.map(a => [a.partyId!, a.id]));

  // 4. Map balances to parties
  return parties.map((party) => {
    const pAccId = accountMap.get(party.id);
    const pTransactions = transactions.filter(t => t.partyId === party.id);

    const { balance } = calculateAccountStats(pTransactions, pAccId!, FinancialAccountType.PARTY);

    return {
      id: party.id,
      name: party.name,
      contactNo: party.contactNo,
      profileUrl: party.profileUrl,
      isActive: party.isActive,
      amount: Number(balance.toFixed(2)),
    };
  });
}

export async function addParties(partyData: PartyInput): Promise<boolean> {
  const session = await getUserSession();

  if (!session || !session.user.activeBusinessId) {
    console.error("User is not logged in.")
    return false;
  }

  const businessId = session.user.activeBusinessId;

  try {
    await prisma.$transaction(async (tx) => {
      const party = await tx.party.create({
        data: {
          businessId: businessId,
          contactNo: partyData.contactNo,
          name: partyData.name
        },
      });

      await tx.financialAccount.create({
        data: {
          name: `${party.name.toLowerCase().replace(/\s+/g, '_')}_Leger`,
          businessId: businessId,
          type: FinancialAccountType.PARTY,
          partyType: partyData.type,
          partyId: party.id,
        },
      });
    });

    revalidatePath("/parties")
    revalidatePath("/accounts")
    return true;
  } catch (error) {
    console.error("Failed to add party and account:", error);
    return false;
  }
}

export async function updateParty(partyId: string, partyData: Partial<PartyInput>): Promise<boolean> {
  const session = await getUserSession();

  if (!session || !session.user.activeBusinessId) {
    return false;
  }

  await prisma.party.update({
    where: {
      id: partyId,
      businessId: session.user.activeBusinessId
    },
    data: {
      name: partyData.name,
      contactNo: partyData.contactNo,
    },
  });

  revalidatePath("/parties");
  revalidatePath(`/parties/${partyId}`);
  return true;
}

export async function deleteParty(partyId: string): Promise<boolean> {
  const session = await getUserSession();

  if (!session || !session.user.activeBusinessId) {
    return false;
  }

  const businessId = session.user.activeBusinessId;

  // Check if transactions exist
  const transactionCount = await prisma.transaction.count({
    where: { partyId, businessId }
  });

  await prisma.$transaction([
    prisma.transaction.updateMany({
      where: { partyId, businessId },
      data: { isDelete: true }
    }),
    prisma.financialAccount.updateMany({
      where: { partyId, businessId },
      data: { isDelete: true }
    }),
    prisma.party.update({
      where: { id: partyId, businessId },
      data: { isDelete: true }
    })
  ]);

  revalidatePath("/parties");
  return true;
}

export async function getPartyTransactions(partyId: string): Promise<Transaction[]> {
  const session = await getUserSession();

  return await prisma.transaction.findMany({
    where: {
      businessId: session?.user.activeBusinessId || "",
      partyId: partyId,
      isDelete: false
    },
    include: {
      fromAccount: { select: { id: true, name: true, type: true } },
      toAccount: { select: { id: true, name: true, type: true } },
    },
    orderBy: [
      { date: "desc" },
      { createdAt: "desc" }
    ]
  })
}

export async function togglePartyActive(partyId: string, isActive: boolean): Promise<boolean> {
  const session = await getUserSession();

  if (!session || !session.user.activeBusinessId) {
    return false;
  }

  const businessId = session.user.activeBusinessId;

  try {
    await prisma.$transaction([
      prisma.party.update({
        where: { id: partyId, businessId },
        data: { isActive }
      }),
      prisma.financialAccount.updateMany({
        where: { partyId, businessId },
        data: { isActive }
      })
    ]);

    revalidatePath("/parties");
    revalidatePath(`/parties/${partyId}`);
    revalidatePath("/accounts");
    return true;
  } catch (error) {
    console.error("Failed to toggle party active status:", error);
    return false;
  }
}