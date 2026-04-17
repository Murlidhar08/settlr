import { Currency, ThemeMode } from "@/lib/generated/prisma/client";

export interface UserSettingsInput {
  currency?: Currency
  dateFormat?: string
  timeFormat?: string
  language?: string
  theme?: ThemeMode
  defAccId?: string | null
  defIncomeAccId?: string | null
  defExpenseAccId?: string | null
}
