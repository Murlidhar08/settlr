"use server";

import { auth, getUserSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/prisma";
import { headers } from "next/headers";

export async function getCurrentUser() {
    const session = await getUserSession();
    if (!session?.user?.id) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            contactNo: true,
            role: true,
            createdAt: true,
        }
    });

    return user;
}

export async function getDeviceSessions() {
    const session = await getUserSession();
    if (!session?.user?.id) return null;

    return await auth.api.listDeviceSessions({
        headers: await headers()
    });
}

export async function setActiveSession(sessionToken: string) {
    return await auth.api.setActiveSession({
        body: { sessionToken },
        headers: await headers(),
    });
}

export async function revokeSession(sessionToken: string) {
    return await auth.api.revokeDeviceSession({
        body: { sessionToken },
        headers: await headers(),
    });
}