"use server";

// Package
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PartyType } from "@/lib/generated/prisma/enums";
import { Prisma } from "@/lib/generated/prisma/client";
import { getUserSession } from "@/lib/auth";
import { PartyInput, PartyRes } from "@/types/party/PartyRes";

export async function addParties(partyData: PartyInput): Promise<boolean> {
  const session = await getUserSession();

  if (!session || !session.session.activeBusinessId) {
    console.error("User is not logged in.")
    return false;
  }

  await prisma.party.create({
    data: {
      businessId: session.session.activeBusinessId,
      contactNo: partyData.contactNo,
      name: partyData.name,
      type: partyData.type,
    },
  });

  revalidatePath("/parties")
  return true;
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

  // 1. Fetch parties
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

  // 2. Resolve Financial Accounts for these parties (Map PartyId -> AccountId)
  const partyAccounts = await prisma.financialAccount.findMany({
    where: {
      businessId,
      partyId: { in: partyIds }
    },
    select: { id: true, partyId: true }
  });

  const partyIdToAccountId = new Map<string, string>();
  const accountIdToPartyId = new Map<string, string>();
  partyAccounts.forEach(acc => {
    if (acc.partyId) {
      partyIdToAccountId.set(acc.partyId, acc.id);
      accountIdToPartyId.set(acc.id, acc.partyId);
    }
  });

  const accountIds = partyAccounts.map(p => p.id);

  if (accountIds.length === 0) {
    return parties.map(p => ({
      id: p.id,
      name: p.name,
      contactNo: p.contactNo,
      profileUrl: p.profileUrl,
      amount: 0,
    }));
  }

  // 3. Aggregate Balances
  // Debit (Dr) = Receiver = Party Recvd = You Gave = Increases Receivable
  const debits = await prisma.transaction.groupBy({
    by: ['toAccountId'],
    where: { businessId, toAccountId: { in: accountIds } },
    _sum: { amount: true }
  });

  // Credit (Cr) = Giver = Party Paid = You Got = Decreases Receivable
  const credits = await prisma.transaction.groupBy({
    by: ['fromAccountId'],
    where: { businessId, fromAccountId: { in: accountIds } },
    _sum: { amount: true }
  });

  // 4. Map balances to parties
  return parties.map((party) => {
    const accId = partyIdToAccountId.get(party.id);

    if (!accId) {
      return {
        id: party.id,
        name: party.name,
        contactNo: party.contactNo,
        profileUrl: party.profileUrl,
        amount: 0,
      };
    }

    const totalDebit = debits.find(d => d.toAccountId === accId)?._sum.amount?.toNumber() || 0;
    const totalCredit = credits.find(c => c.fromAccountId === accId)?._sum.amount?.toNumber() || 0;

    // Net Balance (Receivable perspective) = Debit - Credit
    // If Result > 0: They Owe Us (Receivable)
    // If Result < 0: We Owe Them (Payable)
    const netBalance = totalDebit - totalCredit;

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

  // Cascading delete is handled by code to be safe, 
  // or you can rely on DB schema if onDelete: Cascade is set.
  // We'll do it manually to ensure all associated transactions are gone.
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
