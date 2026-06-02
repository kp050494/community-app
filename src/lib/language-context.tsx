"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, type Language } from "./translations"

interface LanguageContextValue {
  language: Language
  toggleLanguage: () => void
  t: typeof translations.en
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language | null
    if (saved === "en" || saved === "gu") setLanguage(saved)
  }, [])

  function toggleLanguage() {
    setLanguage(prev => {
      const next: Language = prev === "en" ? "gu" : "en"
      localStorage.setItem("lang", next)
      return next
    })
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider")
  return ctx
}
