import { ThemeMode } from "@/lib/generated/prisma/client";

export interface UserSettingsInput {
  dateFormat?: string
  timeFormat?: string
  language?: string
  theme?: ThemeMode
}
