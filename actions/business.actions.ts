"use server";

// Package
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { cookies, headers } from "next/headers";

export async function setActiveBusiness(businessId: string) {
    (await cookies())?.set("businessId", businessId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30 // 30 days
    })
}

export async function addBusiness(name: string) {
    if (!name) {
        throw new Error("Business name is required");
    }

    const session = await auth.api.getSession({ headers: await headers() });
    console.log("Session: ", session);

    await prisma.business.create({
        data: {
            id: `${Math.random()}`,
            name,
            ownerId: session?.user.id ?? "PENDING",
        },
    });

    revalidatePath("/dashboard")
}
