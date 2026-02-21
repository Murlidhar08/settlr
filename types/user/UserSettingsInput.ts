import { Currency, ThemeMode } from "@/lib/generated/prisma/client";

export interface UserSettingsInput {
  currency?: Currency
  dateFormat?: string
  timeFormat?: string
  theme?: ThemeMode
}
