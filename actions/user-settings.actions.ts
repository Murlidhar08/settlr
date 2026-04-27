"use server";

import { auth, getUserSession } from "@/lib/auth/auth";
import { Currency, ThemeMode } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma/prisma";
import packageJson from "@/package.json";
import { UserSettingsInput } from "@/types/user/UserSettingsInput";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function upsertUserSettings(data: UserSettingsInput) {
  const session = await getUserSession();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const result = await prisma.userSettings.upsert({
    where: { userId },
    create: {
      userId: userId,
      currency: data.currency ?? Currency.INR,
      dateFormat: data.dateFormat ?? "dd/MM/yyyy",
      timeFormat: data.timeFormat ?? "hh:mm a",
      language: data.language ?? "en",
      theme: data.theme ?? ThemeMode.AUTO,
    },
    update: {
      currency: data.currency,
      dateFormat: data.dateFormat,
      timeFormat: data.timeFormat,
      language: data.language,
      theme: data.theme,
    },
  });

  revalidatePath("/", "layout");
  return result;
}

export async function getUserSettings() {
  const session = await getUserSession();

  if (!session?.user?.id) return null;

  return prisma.userSettings.findUnique({
    where: { userId: session.user.id },
  });
}

export async function getListUserAccounts() {
  return await auth.api.listUserAccounts({ headers: await headers() })
}

export async function getListSessions() {
  return await auth.api.listSessions({
    headers: await headers(),
  });
}

export async function getCredientialAccounts() {
  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  })

  const nonCredentialAccounts = accounts.filter(
    a => a.providerId !== "credential"
  )

  return nonCredentialAccounts;
}

export async function getAppVersion() {
  return packageJson.version;
}
