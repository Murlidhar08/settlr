"use server";

import { getUserSession } from "@/lib/auth";
import { Transaction } from "@/lib/generated/prisma/client";
// Package
import { prisma } from "@/lib/prisma";
// import { TransactionData } from "@/types/transaction/TransactionData";

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