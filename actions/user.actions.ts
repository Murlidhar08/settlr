"use server";

import { getUserSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/prisma";

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
            activeBusinessId: true,
            createdAt: true,
        }
    });

    return user;
}
