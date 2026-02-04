import { Currency, PaymentMode, ThemeMode } from "@/lib/generated/prisma/client";

export interface UserSettingsInput {
  currency?: Currency
  dateFormat?: string
  defaultPayment?: PaymentMode
  theme?: ThemeMode
}
