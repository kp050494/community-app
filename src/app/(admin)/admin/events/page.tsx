"use client"

import { useLanguage } from "@/lib/language-context"
import { EventsClient } from "./components/events-client"

export default function AdminEventsPage() {
  const { t } = useLanguage()
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold font-heading tracking-tight text-foreground">{t.admin.events.title}</h2>
        <p className="text-sm text-muted-foreground">{t.admin.events.subtitle}</p>
      </div>
      <EventsClient />
    </div>
  )
}
