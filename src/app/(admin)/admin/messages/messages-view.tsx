"use client"

import { MessageSquare, Phone, Mail, Clock, CheckCircle2 } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatDate } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"

type Message = {
  id: string
  name: string
  phone: string | null
  email: string | null
  message: string
  isRead: boolean
  createdAt: Date | string
}

export function MessagesView({ messages }: { messages: Message[] }) {
  const { t } = useLanguage()
  const msg = t.admin.messages

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold font-heading tracking-tight text-foreground">{msg.title}</h2>
        <p className="text-sm text-muted-foreground">{msg.subtitle}</p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <GlassCard className="p-12 text-center text-muted-foreground max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20 text-primary">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">{msg.emptyTitle}</h3>
            <p className="text-xs">{msg.emptyDesc}</p>
          </GlassCard>
        ) : (
          messages.map((m) => (
            <GlassCard key={m.id} hover className="p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start">
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-bold text-foreground">{m.name}</h3>
                  <StatusBadge status={m.isRead ? "success" : "pending"} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line bg-background/30 p-4 rounded-xl border border-white/5 font-medium">
                  {m.message}
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-mono">
                  {m.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-primary" />
                      <span>{m.phone}</span>
                    </div>
                  )}
                  {m.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-primary" />
                      <span>{m.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{formatDate(m.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex md:flex-col gap-2 shrink-0 pt-4 md:pt-0">
                <button className="px-4 py-2 text-xs font-bold text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition-all flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {msg.markRead}
                </button>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  )
}
