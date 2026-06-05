"use client"

import { useLanguage } from "@/lib/language-context"

type EventLabelKey = keyof typeof import("@/lib/translations").translations.en.events

export function EventsLabels({ labelKey }: { labelKey: EventLabelKey }) {
  const { t } = useLanguage()
  return <>{t.events[labelKey]}</>
}
