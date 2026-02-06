"use client"

import { Currency, PaymentMode, ThemeMode } from "@/lib/generated/prisma/enums"
import { createContext, useContext } from "react"

interface userSettings {
  currency: Currency,
  dateFormat: string,
  defaultPayment: PaymentMode,
  theme: ThemeMode,
  setTheme: (theme: ThemeMode) => void,
}

const UserConfigContext = createContext<userSettings | null>(null)

export const useUserConfig = () => {
  const ctx = useContext(UserConfigContext)
  if (!ctx) {
    throw new Error("useUserConfig must be used inside UserConfigProvider")
  }
  return ctx
}

import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"

export function UserConfigProvider({ config, children }: { config: Omit<userSettings, 'setTheme'>, children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(config.theme)

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme)
  }

  return (
    <UserConfigContext.Provider value={{ ...config, theme, setTheme }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </UserConfigContext.Provider>
  )
}

