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

  if (!session?.session.activeBusinessId)
    return [];

  const suppliers = await prisma.party.findMany({
    where: {
      businessId: session.session.activeBusinessId,
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
        },
      },
    },
  });

  const supplierList = suppliers.map(supplier => {
    let balance = new Prisma.Decimal(0);

    for (const tx of supplier.transactions) {
      if (tx.direction === TransactionDirection.OUT)
        balance = balance.minus(tx.amount);   // payment made to supplier
      else
        balance = balance.plus(tx.amount);    // refund / credit received
    }

    return {
      id: supplier.id,
      name: supplier.name,
      contactNo: supplier.contactNo,
      profileUrl: supplier.profileUrl,
      amount: Number(balance), // +Advance | -Due
    };
  });

  return supplierList;
}
