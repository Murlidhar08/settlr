"use server";

// Package
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { partyData } from "@/types/party/partyData";
import { PartyType } from "@/lib/generated/prisma/enums";
import { Party } from "@/lib/generated/prisma/client";

export async function addParties(partyData: partyData) {
    await prisma.party.create({
        data: {
            businessId: partyData.businessId,
            contactNo: partyData.contactNo,
            name: partyData.name,
            type: partyData.type,
        },
    });

    revalidatePath("/parties")
}

export async function getCustomerList() {
    const customerList = await prisma.party.findMany({
        where: {
            type: PartyType.CUSTOMER
        }
    });

    revalidatePath("/parties")
    return customerList;
}

export async function getSupplierList() {
    const supplierList = await prisma.party.findMany({
        where: {
            type: PartyType.SUPPLIER
        }
    });
    revalidatePath("/parties")
    return supplierList;
}

