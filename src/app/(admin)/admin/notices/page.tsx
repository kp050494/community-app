"use client"

import { useLanguage } from "@/lib/language-context"
import { NoticesClient } from "./components/notices-client"

export default function AdminNoticesPage() {
  const { t } = useLanguage()
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold font-heading tracking-tight text-foreground">{t.admin.notices.title}</h2>
        <p className="text-sm text-muted-foreground">{t.admin.notices.subtitle}</p>
      </div>
      <NoticesClient />
    </div>
  )
}
