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

  const newBusiness = await prisma.business.create({
    data: {
      name: name,
      ownerId: session.user.id
    }
  });

  revalidatePath("/dashboard")
  return newBusiness;
}

export async function switchBusiness(businessId: string, redirectTo?: string | null) {
  // 1. Get the session using the Better-Auth API for server context
  const session = await getUserSession();

  if (!session) {
    throw new Error("User is not logged in.");
  }

  // 2. Optimization: Skip if already active
  if (!businessId || session.user.activeBusinessId === businessId) {
    return { success: true };
  }

  try {
    // 3. Update the User record in the database
    // Better-Auth will pick this up on the next request/validation
    await prisma.user.update({
      where: { id: session.user.id },
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

export async function updateBusiness(id: string, name: string) {
  if (!name) throw new Error("Business name is required");

  const session = await getUserSession();
  if (!session) return null;

  const updated = await prisma.business.update({
    where: {
      id: id,
      ownerId: session.user.id // Security check
    },
    data: { name }
  });

  revalidatePath("/dashboard");
  revalidatePath("/business");
  return updated;
}

export async function deleteBusiness(id: string) {
  const session = await getUserSession();
  if (!session) return null;

  // Check if it's the only business - optional but recommended
  const count = await prisma.business.count({
    where: { ownerId: session.user.id }
  });

  if (count <= 1) {
    throw new Error("You must have at least one business.");
  }

  await prisma.business.delete({
    where: {
      id: id,
      ownerId: session.user.id // Security check
    }
  });

  // If the deleted business was active, switch to another one
  if (session.user.activeBusinessId === id) {
    const other = await prisma.business.findFirst({
      where: { ownerId: session.user.id }
    });
    if (other) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { activeBusinessId: other.id }
      });
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/business");
  return { success: true };
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

