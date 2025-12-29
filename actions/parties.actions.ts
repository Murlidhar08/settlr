"use server";

// Package
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PartyType, TransactionDirection } from "@/lib/generated/prisma/enums";
import { Party, Prisma } from "@/lib/generated/prisma/client";
import { getUserSession } from "@/lib/auth";
import { PartyRes } from "@/types/party/PartyRes";

export async function addParties(partyData: Party): Promise<boolean> {
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

export async function getPartyList(type: PartyType): Promise<PartyRes[]> {
  const session = await getUserSession();
  const businessId = session?.session?.activeBusinessId;
  if (!businessId)
    return [];

  const parties = await prisma.party.findMany({
    where: {
      businessId,
      type: { in: [type, PartyType.BOTH] },
    },
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
