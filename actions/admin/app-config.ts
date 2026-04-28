"use server";

import { prisma } from "@/lib/prisma/prisma";
import { getUserSession } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const appConfigSchema = z.object({
  appName: z.string().min(1),
  appDescription: z.string().min(1),
  smtpHost: z.string().optional().nullable(),
  smtpPort: z.number().int().optional().nullable(),
  smtpUser: z.string().optional().nullable(),
  smtpPass: z.string().optional().nullable(),
  smtpSecure: z.boolean().default(false),
  fromEmail: z.string().optional().nullable().or(z.literal("")),
  googleClientId: z.string().optional().nullable(),
  googleClientSecret: z.string().optional().nullable(),
  discordClientId: z.string().optional().nullable(),
  discordClientSecret: z.string().optional().nullable(),
});

export async function updateAppConfig(data: z.infer<typeof appConfigSchema>) {
  const session = await getUserSession();

  if (session?.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const validated = appConfigSchema.parse(data);

  // Convert empty strings to null before saving
  const dataToSave = Object.fromEntries(
    Object.entries(validated).map(([key, value]) => [
      key,
      value === "" ? null : value
    ])
  );

  await prisma.appConfig.upsert({
    where: { id: "singleton" },
    update: dataToSave,
    create: {
      id: "singleton",
      ...dataToSave,
    },
  });

  revalidatePath("/admin");
  return { success: true };
}
