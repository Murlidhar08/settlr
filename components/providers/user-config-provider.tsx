"use client"

import { ThemeMode } from "@/lib/generated/prisma/enums"
import { setActiveLanguage } from "@/lib/languages/i18n"
import { setGlobalUserConfig } from "@/utility/dateTimeFn"
import { useTheme } from "next-themes"
import { createContext, useContext, useEffect, useState } from "react"

interface userSettings {
  dateFormat: string,
  timeFormat: string,
  language: string,
  theme: ThemeMode,
  defAccId?: string | null,
  defIncomeAccId?: string | null,
  defExpenseAccId?: string | null,
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


export function UserConfigProvider({ config, children }: { config: Omit<userSettings, 'setTheme'>, children: React.ReactNode }) {
  // Set the active language globally for hook-free translations
  setActiveLanguage(config.language)
  // Set the global user date/time preferences for hook-free formatting
  setGlobalUserConfig(config)

  const [theme, setThemeState] = useState<ThemeMode>(config.theme)
  const { setTheme: setNextTheme } = useTheme()

  // Sync state with server config when it updates
  useEffect(() => {
    setThemeState(config.theme)
  }, [config.theme])

  useEffect(() => {
    setActiveLanguage(config.language)
    setGlobalUserConfig(config)
  }, [config.language, config.dateFormat, config.timeFormat])

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


