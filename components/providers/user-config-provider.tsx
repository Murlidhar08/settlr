"use client"

import { Currency, PaymentMode, ThemeMode } from "@/lib/generated/prisma/enums"
import { createContext, useContext } from "react"

interface userSettings {
  currency: Currency,
  dateFormat: string,
  defaultPayment: PaymentMode,
  theme: ThemeMode,
}

const UserConfigContext = createContext<userSettings | null>(null)

export const useUserConfig = () => {
  const ctx = useContext(UserConfigContext)
  if (!ctx) {
    throw new Error("useUserConfig must be used inside UserConfigProvider")
  }
  return ctx
}

export function UserConfigProvider({ config, children }: { config: userSettings, children: React.ReactNode }) {
  return (
    <UserConfigContext.Provider value={config}>
      {children}
    </UserConfigContext.Provider>
  )
}
