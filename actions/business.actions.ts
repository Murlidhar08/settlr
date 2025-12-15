"use server";

// Package
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addBusiness(name: string, ownerId: number) {
    if (!name) {
        throw new Error("Business name is required");
    }

    await prisma.business.create({
        data: {
            name,
            ownerId,
        },
    });

    revalidatePath("/dashboard")
}
