"use server";

// Package
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addBusiness(name: string) {
    if (!name) {
        throw new Error("Business name is required");
    }

    const session = await getUserSession();
    if (!session) {
        console.error("User is not logged in.")
        return null;
    }

    await prisma.business.create({
        data: {
            name: name,
            ownerId: session.user.id
        }
    });

    revalidatePath("/dashboard")
    return true;
}

export async function switchBusiness(businessId: string) {
    const session = await getUserSession();
    if (!session) {
        console.error("User is not logged in.")
        return null;
    }

    await prisma.session.update({
        where: { id: session.session.id, },
        data: { activeBusinessId: businessId },
    });

    revalidatePath("/dashboard")
    return true;
}