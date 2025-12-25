"use server";

// Package
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PartyType } from "@/lib/generated/prisma/enums";
import { Party } from "@/lib/generated/prisma/client";
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
    const customerList = await prisma.party.findMany({
        where: {
            type: PartyType.CUSTOMER,
            businessId: session?.session.activeBusinessId || ""
        }
    });

    revalidatePath("/parties")
    return customerList;
}

export async function getSupplierList() {
    const session = await getUserSession();
    const supplierList = await prisma.party.findMany({
        where: {
            type: PartyType.SUPPLIER,
            businessId: session?.session.activeBusinessId || ""
        }
    });

    revalidatePath("/parties")
    return supplierList;
}

