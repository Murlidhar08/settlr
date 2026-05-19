import { getUserSession } from "./auth/auth";
import { ThemeMode } from "./generated/prisma/enums";

export const getUserConfig = async () => {
  const session = await getUserSession()
  if (!session?.session?.userSettings)
    return getDefaultConfig();

  return session.session.userSettings;
};

export function getDefaultConfig() {
  return {
    dateFormat: "dd/MM/yyyy",
    timeFormat: "hh:mm a",
    language: "en",
    theme: ThemeMode.AUTO,
    defAccId: null as string | null,
    defIncomeAccId: null as string | null,
    defExpenseAccId: null as string | null,
  }
}
