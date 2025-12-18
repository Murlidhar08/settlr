"use server";

// Package
import { prisma } from "@/lib/prisma";
import { Transaction } from "@/lib/generated/prisma/client";

export async function addTransaction(transactionData: Transaction) {
    return await prisma.transaction.create({
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