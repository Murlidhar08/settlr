"use server";

// Lib
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";
import { Transaction } from "@/lib/generated/prisma/client";
import { redirect } from "next/navigation"


export async function addTransaction(transactionData: Transaction) {
  const session = await getUserSession();

  // If id exists and not zero -> update
  if (!!transactionData.id) {
    return await prisma.transaction.update({
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
  return await prisma.transaction.create({
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
