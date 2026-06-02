"use client"

import { useEffect, useState } from "react"
import { Bell, Calendar, FileText, Search } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { FloatingOrbs } from "@/components/shared/floating-orbs"
import { SectionHeader } from "@/components/shared/section-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { useLanguage } from "@/lib/language-context"

type Notice = {
  id: string
  title: string
  description: string
  priority: string
  attachmentUrl: string | null
  createdAt: string
}

export default function PublicNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [search, setSearch] = useState("")
  const [priority, setPriority] = useState("")
  const { t } = useLanguage()

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (priority) params.set("priority", priority)
    fetch(`/api/notices?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const now = new Date()
          setNotices(data.data.filter((n: any) =>
            n.isVisible !== false &&
            (!n.expiryDate || new Date(n.expiryDate) >= now)
          ))
        }
      })
      .catch(() => {})
  }, [search, priority])

  const getPriorityBadgeStatus = (p: string) => {
    switch (p) {
      case "URGENT": return "error"
      case "HIGH": return "warning"
      case "MEDIUM": return "info"
      default: return "pending"
    }
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden py-16 px-4 md:px-8">
      <FloatingOrbs variant="gold" className="opacity-15" />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">

        <SectionHeader
          overline={t.notices.overline}
          title={t.notices.title}
          gujaratiSubtitle="સરકારી જાહેરાત અને સૂચના પત્રક"
          description={t.notices.description}
          centered
        />

        {/* Filter and Search Bar */}
        <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t.notices.searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm text-foreground"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="px-3 py-2 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm text-foreground"
              >
                <option value="">{t.notices.allPriorities}</option>
                <option value="URGENT">{t.notices.urgentOnly}</option>
                <option value="HIGH">{t.notices.highPriority}</option>
                <option value="MEDIUM">{t.notices.mediumPriority}</option>
                <option value="LOW">{t.notices.lowPriority}</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Notices Stack */}
        <div className="space-y-6">
          {notices.length === 0 ? (
            <GlassCard className="p-12 text-center text-muted-foreground">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20 text-primary">
                <Bell className="w-6 h-6 animate-pulse" />
              </div>
              <p className="font-semibold text-lg text-foreground">{t.notices.noNoticesTitle}</p>
              <p className="text-sm mt-1">{t.notices.noNoticesDesc}</p>
            </GlassCard>
          ) : (
            notices.map((notice) => (
              <GlassCard
                key={notice.id}
                variant={notice.priority === "URGENT" || notice.priority === "HIGH" ? "gold" : "default"}
                hover
                className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="flex md:flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                    notice.priority === "URGENT"
                      ? "bg-red-500/10 text-red-500 border-red-500/20"
                      : notice.priority === "HIGH"
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      : "bg-primary/10 text-primary border-primary/20"
                  }`}>
                    <Bell className="w-5 h-5" />
                  </div>
                  <StatusBadge status={getPriorityBadgeStatus(notice.priority)} size="sm" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-xl font-bold font-heading text-foreground">{notice.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(notice.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                    {notice.description}
                  </p>

                  {notice.attachmentUrl && (
                    <div className="pt-2">
                      <a
                        href={notice.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-foreground bg-primary/5 hover:bg-primary px-3 py-2 rounded-lg border border-primary/20 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {t.notices.downloadDoc}
                      </a>
                    </div>
                  )}
                </div>
              </GlassCard>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
