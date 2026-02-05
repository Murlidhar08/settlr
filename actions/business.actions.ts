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

export async function switchBusiness(businessId: string, redirectTo?: string | null) {
  // 1. Get the session using the Better-Auth API for server context
  const session = await getUserSession();

  if (!session) {
    throw new Error("User is not logged in.");
  }

  // 2. Optimization: Skip if already active
  if (!businessId || session.session.activeBusinessId === businessId) {
    return { success: true };
  }

  try {
    // 3. Update the Session record in the database
    // Better-Auth will pick this up on the next request/validation
    await prisma.session.update({
      where: { id: session.session.id },
      data: { activeBusinessId: businessId },
    });

    // 4. Revalidate paths to clear Next.js Data Cache
    if (redirectTo) {
      revalidatePath(redirectTo);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to switch business:", error);
    return { success: false, error: "Internal Server Error" };
  }
}

export async function getBusinessList() {
  const session = await getUserSession();

  if (!session) {
    console.error("User is not logged in.")
    return null;
  }

  return await prisma.business?.findMany({
    select: {
      id: true,
      name: true
    },
    where: { ownerId: session?.user.id }
  });
}
