"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

// Import translation files
import uzTranslations from "@/app/locales/uz.json"
import ruTranslations from "@/app/locales/ru.json"
import enTranslations from "@/app/locales/en.json"

type Locale = "uz" | "ru" | "en"
type Translations = Record<string, string>

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

const allTranslations: Record<Locale, Translations> = {
  uz: uzTranslations,
  ru: ruTranslations,
  en: enTranslations,
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("uz") // Default to Uzbek

  useEffect(() => {
    // Try to get locale from localStorage or browser preference
    const storedLocale = localStorage.getItem("locale") as Locale
    if (storedLocale && allTranslations[storedLocale]) {
      setLocaleState(storedLocale)
    } else {
      const browserLang = navigator.language.split("-")[0]
      if (browserLang === "ru") {
        setLocaleState("ru")
      } else if (browserLang === "en") {
        setLocaleState("en")
      } else {
        setLocaleState("uz")
      }
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    if (allTranslations[newLocale]) {
      setLocaleState(newLocale)
      localStorage.setItem("locale", newLocale)
    }
  }, [])

  const t = useCallback(
    (key: string): string => {
      return allTranslations[locale][key] || key // Return key if translation not found
    },
    [locale],
  )

  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }
  return context
}
