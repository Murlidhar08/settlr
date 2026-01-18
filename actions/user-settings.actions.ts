"use server";

import packageJson from "@/package.json"
import { prisma } from "@/lib/prisma";
import { auth, getUserSession } from "@/lib/auth";
import { Currency, PaymentMode, ThemeMode } from "@/lib/generated/prisma/enums";
import { headers } from "next/headers";
import { UserSettingsInput } from "@/types/user/UserSettingsInput";

export async function upsertUserSettings(data: UserSettingsInput) {
  const session = await getUserSession();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  return prisma.userSettings.upsert({
    where: { userId },
    create: {
      userId: userId,
      currency: data.currency ?? Currency.INR,
      dateFormat: data.dateFormat ?? "DD/MM/YYYY",
      defaultPayment: data.defaultPayment ?? PaymentMode.CASH,
      theme: data.theme ?? ThemeMode.AUTO,
    },
    update: {
      ...data,
    },
  });
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
