import { prisma } from "./prisma";
import { getUserSession } from "./auth";
import { Currency, PaymentMode, ThemeMode } from "./generated/prisma/enums";

export async function getUserConfig() {
  const session = await getUserSession()
  if (!session?.user?.id)
    return getDefaultConfig();

  const userSettings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id }
  });

  return userSettings ?? getDefaultConfig();
}

export function getDefaultConfig() {
  return {
    currency: Currency.INR,
    dateFormat: "DD/MM/YYYY",
    defaultPayment: PaymentMode.CASH,
    theme: ThemeMode.AUTO,
  }
}
