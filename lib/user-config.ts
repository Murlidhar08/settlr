import { getUserSession } from "./auth/auth";
import { Currency, ThemeMode } from "./generated/prisma/enums";
import { prisma } from "./prisma/prisma";

export const getUserConfig = async () => {
  const session = await getUserSession()
  if (!session?.user?.id)
    return getDefaultConfig();

  const userSettings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id }
  });

  return userSettings ?? getDefaultConfig();
};


export function getDefaultConfig() {
  return {
    currency: Currency.INR,
    dateFormat: "dd/MM/yyyy",
    timeFormat: "hh:mm a",
    language: "en",
    theme: ThemeMode.AUTO,
  }
}
