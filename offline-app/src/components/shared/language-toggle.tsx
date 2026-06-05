"use client"

import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"

export function LanguageToggle({ className }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        "relative flex items-center gap-0.5 h-8 rounded-full border border-primary/40 bg-primary/10 px-1 text-xs font-bold tracking-wide transition-all hover:bg-primary/20 hover:border-primary/60",
        className
      )}
      aria-label="Toggle language"
      title={language === "en" ? "Switch to Gujarati" : "Switch to English"}
    >
      <span
        className={cn(
          "px-2.5 py-1 rounded-full transition-all duration-300",
          language === "en"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground"
        )}
      >
        EN
      </span>
      <span
        className={cn(
          "px-2.5 py-1 rounded-full transition-all duration-300",
          language === "gu"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground"
        )}
      >
        ગુ
      </span>
    </button>
  )
}
