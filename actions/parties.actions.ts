"use server";

// Package
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FinancialAccountType, PartyType, TransactionDirection } from "@/lib/generated/prisma/enums";
import { Prisma } from "@/lib/generated/prisma/client";
import { getUserSession } from "@/lib/auth";
import { PartyInput, PartyRes } from "@/types/party/PartyRes";

export async function addParties(partyData: PartyInput): Promise<boolean> {
  const session = await getUserSession();

  if (!session || !session.session.activeBusinessId) {
    console.error("User is not logged in.")
    return false;
  }

  const businessId = session.session.activeBusinessId;

  try {
    await prisma.$transaction(async (tx) => {
      const party = await tx.party.create({
        data: {
          businessId: businessId,
          contactNo: partyData.contactNo,
          name: partyData.name,
          type: partyData.type,
        },
      });

      await tx.financialAccount.create({
        data: {
          name: `${party.name.toLowerCase().replace(/\s+/g, '_')}_Leger`,
          businessId: businessId,
          type: FinancialAccountType.PARTY,
          partyType: party.type,
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
  const businessId = session?.session?.activeBusinessId;
  if (!businessId)
    return [];

  const where: any = {
    businessId,
    type: { in: [type, PartyType.BOTH] },
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

  // 2. Fetch aggregated balances for these parties
  const balances = await prisma.transaction.groupBy({
    by: ['partyId', 'direction'],
    where: {
      businessId,
      partyId: { in: partyIds }
    },
    _sum: { amount: true }
  });

  // 3. Map balances to parties
  return parties.map((party) => {
    // Find all balance entries for this party
    const partyBalances = balances.filter(b => b.partyId === party.id);

    let totalIn = new Prisma.Decimal(0);
    let totalOut = new Prisma.Decimal(0);

    partyBalances.forEach(b => {
      const amount = b._sum.amount ? b._sum.amount : new Prisma.Decimal(0);
      if (b.direction === TransactionDirection.IN) totalIn = totalIn.plus(amount);
      else totalOut = totalOut.plus(amount);
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

  if (!session || !session.session.activeBusinessId) {
    return false;
  }

  await prisma.party.update({
    where: {
      id: partyId,
      businessId: session.session.activeBusinessId
    },
    data: {
      name: partyData.name,
      contactNo: partyData.contactNo,
      type: partyData.type,
    },
  });

  revalidatePath("/parties");
  revalidatePath(`/parties/${partyId}`);
  return true;
}

export async function deleteParty(partyId: string): Promise<boolean> {
  const session = await getUserSession();

  if (!session || !session.session.activeBusinessId) {
    return false;
  }

  await prisma.$transaction([
    prisma.transaction.deleteMany({
      where: {
        partyId: partyId,
        businessId: session.session.activeBusinessId
      }
    }),
    prisma.party.delete({
      where: {
        id: partyId,
        businessId: session.session.activeBusinessId
      }
    })
  ]);

  revalidatePath("/parties");
  return true;
}
