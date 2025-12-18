"use server";

// Package
import { prisma } from "@/lib/prisma";
import { TransactionData } from "@/types/transaction/TransactionData";

export async function addTransaction(transactionData: TransactionData) {
    // If id exists and not zero -> update
    if (transactionData.id && transactionData.id !== 0) {
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