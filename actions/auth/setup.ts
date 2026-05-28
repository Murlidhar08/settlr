"use server";

import { auth } from "@/lib/auth/auth";
import { UserRole, UserStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";

const setupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3).regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
});

export async function setupAdmin(formData: FormData) {
  // 1. Check if users exist
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    redirect("/login");
  }

  const rawData = Object.fromEntries(formData.entries());
  const validatedData = setupSchema.parse(rawData);

  // 2. Create the user using Better Auth to handle password hashing
  const user = await auth.api.signUpEmail({
    body: {
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
      username: validatedData.username,
    }
  });

  if (!user) {
    throw new Error("Failed to create user");
  }

  // 3. Update the user to be admin and verified
  // We use direct prisma update because we want to bypass the verification flow for the first admin
  await prisma.user.update({
    where: { id: user.user.id },
    data: {
      role: UserRole.admin,
      emailVerified: true,
      status: UserStatus.approved
    },
  });

  // Default business and accounts are created by the auth hook in auth.ts
  // Redirect to login after successful setup
  redirect("/login");
}
