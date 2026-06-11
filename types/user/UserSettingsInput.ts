import { Currency, ThemeMode } from "@/lib/generated/prisma/client";

export interface UserSettingsInput {
  dateFormat?: string
  timeFormat?: string
  language?: string
  theme?: ThemeMode
  currency?: Currency
  locale?: string;   // e.g., "en-US", "en-IN", "de-DE"
}
