"use server";

// Package
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PartyType, TransactionDirection } from "@/lib/generated/prisma/enums";
import { Party, Prisma } from "@/lib/generated/prisma/client";
import { getUserSession } from "@/lib/auth";

export async function addParties(partyData: Party) {
  const session = await getUserSession();

  if (!session) {
    console.error("User is not logged in.")
    return null;
  }

  await prisma.party.create({
    data: {
      businessId: session.session.activeBusinessId || undefined,
      contactNo: partyData.contactNo,
      name: partyData.name,
      type: partyData.type,
    },
  });

  revalidatePath("/parties")
}

export async function getCustomerList() {
  const session = await getUserSession();

  if (!session?.session.activeBusinessId) return [];

  const customers = await prisma.party.findMany({
    where: {
      type: PartyType.CUSTOMER,
      businessId: session.session.activeBusinessId,
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

  return customers.map((customer) => {
    let pending = new Prisma.Decimal(0);

    for (const tx of customer.transactions) {
      if (tx.direction === TransactionDirection.OUT) {
        pending = pending.minus(tx.amount);   // credit given
      } else {
        pending = pending.plus(tx.amount);  // payment received
      }
    }

    return {
      id: customer.id,
      name: customer.name,
      contactNo: customer.contactNo,
      profileUrl: customer.profileUrl,
      amount: Number(pending), // +620 or -1200
    };
  });
}

export async function getSupplierList() {
  const session = await getUserSession();

  if (!session?.session.activeBusinessId) return [];

  const suppliers = await prisma.party.findMany({
    where: {
      type: PartyType.SUPPLIER,
      businessId: session.session.activeBusinessId,
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

  const supplierList = suppliers.map((supplier) => {
    let balance = new Prisma.Decimal(0);

    for (const tx of supplier.transactions) {
      if (tx.direction === TransactionDirection.OUT) {
        balance = balance.minus(tx.amount);   // payment made to supplier
      } else {
        balance = balance.plus(tx.amount);    // refund / credit received
      }
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

