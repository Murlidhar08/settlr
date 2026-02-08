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

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

export function UserConfigProvider({ config, children }: { config: Omit<userSettings, 'setTheme'>, children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(config.theme)
  const { setTheme: setNextTheme } = useTheme()

  // Sync state with server config when it updates
  useEffect(() => {
    setThemeState(config.theme)
  }, [config.theme])

  useEffect(() => {
    if (theme) {
      const themeMap: Record<ThemeMode, string> = {
        [ThemeMode.AUTO]: 'system',
        [ThemeMode.LIGHT]: 'light',
        [ThemeMode.DARK]: 'dark',
      }
      setNextTheme(themeMap[theme])
    }
  }, [theme, setNextTheme])

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme)
  }

  return (
    <UserConfigContext.Provider value={{ ...config, theme, setTheme }}>
      {children}
    </UserConfigContext.Provider>
  )
}


