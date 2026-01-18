import { getUserSession } from "./auth"
import { Currency, PaymentMode, ThemeMode } from "./generated/prisma/enums";

export async function getUserConfig() {
  const session = await getUserSession()
  if (!session?.session?.userSettings)
    return getDefaultConfig();

  return session.session.userSettings;
}

export function getDefaultConfig() {
  return {
    currency: Currency.INR,
    dateFormat: "DD/MM/YYYY",
    defaultPayment: PaymentMode.CASH,
    theme: ThemeMode.AUTO,
  }
}
