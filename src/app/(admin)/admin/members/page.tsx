"use client"

import { useLanguage } from "@/lib/language-context"
import { MembersClient } from "./components/members-client"

export default function MembersPage() {
  const { t } = useLanguage()
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-heading">{t.admin.members.title}</h2>
        <p className="text-muted-foreground">{t.admin.members.subtitle}</p>
      </div>
      <MembersClient />
    </div>
  )
}
