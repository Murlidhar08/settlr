"use server";

import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";
import { Currency, PaymentMode, ThemeMode } from "@/lib/generated/prisma/enums";
import { UserSettings } from "@/lib/generated/prisma/client";

// type UpdateUserSettingsInput = {
//   currency?: Currency;
//   dateFormat?: string;
//   defaultPayment?: PaymentMode;
//   theme?: ThemeMode;
// };

export async function upsertUserSettings(data: UserSettings) {
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
