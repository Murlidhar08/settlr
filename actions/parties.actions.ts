"use server";

// Package
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PartyType, TransactionDirection } from "@/lib/generated/prisma/enums";
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

  const parties = await prisma.party.findMany({
    where,
    select: {
      id: true,
      name: true,
      contactNo: true,
      profileUrl: true,
      transactions: {
        select: {
          amount: true,
          direction: true,
          date: true
        },
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });


  return parties.map((party) => {
    const pending = party.transactions.reduce(
      (acc, tx) => {
        return tx.direction === TransactionDirection.OUT
          ? acc.minus(tx.amount)
          : acc.plus(tx.amount);
      },
      new Prisma.Decimal(0)
    );

    return {
      id: party.id,
      name: party.name,
      contactNo: party.contactNo,
      profileUrl: party.profileUrl,
      amount: Number(pending.toFixed(2)),
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
