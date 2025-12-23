"use server";

// Package
import { auth, getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function addBusiness(name: string) {
    if (!name) {
        throw new Error("Business name is required");
    }

    const session = await getUserSession()

    // no session → user not logged in
    if (!session) {
        console.error("User is not logged in.")
        return null;
    }

    console.log("Session :-", session.user)

    await prisma.business.create({
        data: {
            name: name,
            ownerId: session.user.id
        }
    })

    revalidatePath("/dashboard")
    return true;
}
