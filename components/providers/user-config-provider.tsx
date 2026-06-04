"use client"

import { Currency, ThemeMode } from "@/lib/generated/prisma/enums"
import { setActiveLanguage } from "@/lib/languages/i18n"
import { setGlobalUserConfig } from "@/utility/global-user-config"
import { useTheme } from "next-themes"
import { createContext, useContext, useEffect, useState } from "react"

interface userSettings {
  dateFormat: string
  timeFormat: string
  language: string
  theme: ThemeMode
  currency: Currency
  locale: string
  setTheme: (theme: ThemeMode) => void
  updateConfig: (updates: Partial<Omit<userSettings, 'setTheme' | 'updateConfig'>>) => void
}

const UserConfigContext = createContext<userSettings | null>(null)

export const useUserConfig = () => {
  const ctx = useContext(UserConfigContext)
  if (!ctx) {
    throw new Error("useUserConfig must be used inside UserConfigProvider")
  }
  return ctx
}


export function UserConfigProvider({ config, children }: { config: Omit<userSettings, 'setTheme' | 'updateConfig'>, children: React.ReactNode }) {
  const [state, setState] = useState(config)
  const [theme, setThemeState] = useState<ThemeMode>(config.theme)
  const { setTheme: setNextTheme } = useTheme()

  // Set the active language globally for hook-free translations
  setActiveLanguage(state.language)
  // Set the global user date/time preferences for hook-free formatting
  setGlobalUserConfig(state)

  // Sync state with server config when it updates
  useEffect(() => {
    setState(config)
    setThemeState(config.theme)
  }, [config])

  useEffect(() => {
    setActiveLanguage(state.language)
    setGlobalUserConfig(state)
  }, [state.language, state.locale, state.dateFormat, state.timeFormat])

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
    setState(prev => ({ ...prev, theme: newTheme }))
  }

  const updateConfig = (updates: Partial<Omit<userSettings, 'setTheme' | 'updateConfig'>>) => {
    setState(prev => {
      const next = { ...prev, ...updates }
      setActiveLanguage(next.language)
      setGlobalUserConfig(next)
      return next
    })
  }

  return (
    <UserConfigContext.Provider value={{ ...state, theme, setTheme, updateConfig }}>
      {children}
    </UserConfigContext.Provider>
  )
}


