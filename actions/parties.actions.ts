"use server";

// Package
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FinancialAccountType, PartyType } from "@/lib/generated/prisma/enums";
import { Prisma } from "@/lib/generated/prisma/client";
import { getUserSession } from "@/lib/auth";
import { PartyInput, PartyRes } from "@/types/party/PartyRes";

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

export async function getPartyList(type: PartyType, search?: string): Promise<PartyRes[]> {
  const session = await getUserSession();
  const businessId = session?.user?.activeBusinessId;
  if (!businessId)
    return [];

  const where: any = {
    businessId,
    isActive: true,
    financialAccounts: {
      some: {
        partyType: type,
        isActive: true
      }
    }
  };

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
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  if (parties.length === 0) return [];

  const partyIds = parties.map(p => p.id);

  // 2. Fetch all transactions for these parties and their financial accounts
  const transactions = await prisma.transaction.findMany({
    where: {
      businessId,
      partyId: { in: partyIds }
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
      partyId: { in: partyIds }
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

    let totalIn = new Prisma.Decimal(0);
    let totalOut = new Prisma.Decimal(0);

    pTransactions.forEach(t => {
      const amount = t.amount;
      if (t.toAccountId === pAccId) totalIn = totalIn.plus(amount);
      if (t.fromAccountId === pAccId) totalOut = totalOut.plus(amount);
    });

    // Net balance = IN (Receivable?) - OUT (Payable?)
    const netBalance = totalIn.minus(totalOut);

    return {
      id: party.id,
      name: party.name,
      contactNo: party.contactNo,
      profileUrl: party.profileUrl,
      amount: Number(netBalance.toFixed(2)),
    };
  });
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

  if (transactionCount > 0) {
    // Soft delete if transactions exist
    await prisma.$transaction([
      prisma.party.update({
        where: { id: partyId, businessId },
        data: { isActive: false }
      }),
      prisma.financialAccount.updateMany({
        where: { partyId, businessId },
        data: { isActive: false }
      })
    ]);
    revalidatePath("/parties");
    return true;
  }

  // Hard delete if no transactions
  await prisma.$transaction([
    prisma.financialAccount.deleteMany({
      where: { partyId, businessId }
    }),
    prisma.party.delete({
      where: { id: partyId, businessId }
    })
  ]);

  revalidatePath("/parties");
  return true;
}
