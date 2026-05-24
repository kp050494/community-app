import { prisma } from "@/lib/prisma"
import { MessageSquare, Phone, Mail, Clock, ShieldCheck, CheckCircle2 } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatDate } from "@/lib/utils"

export const revalidate = 0

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold font-heading tracking-tight text-foreground">Contact Inbox</h2>
        <p className="text-sm text-muted-foreground">
          View inquiries, suggestion forms, and support requests submitted by community members.
        </p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <GlassCard className="p-12 text-center text-muted-foreground max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20 text-primary">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">Your Inbox is Empty</h3>
            <p className="text-xs">No public inquiries or messages have been submitted yet.</p>
          </GlassCard>
        ) : (
          messages.map((msg) => (
            <GlassCard key={msg.id} hover className="p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start">
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-bold text-foreground">{msg.name}</h3>
                  <StatusBadge status={msg.isRead ? "success" : "pending"} size="sm" />
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line bg-background/30 p-4 rounded-xl border border-white/5 font-medium">
                  {msg.message}
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-mono">
                  {msg.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-primary" />
                      <span>{msg.phone}</span>
                    </div>
                  )}
                  {msg.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-primary" />
                      <span>{msg.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{formatDate(msg.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex md:flex-col gap-2 shrink-0 pt-4 md:pt-0">
                <button className="px-4 py-2 text-xs font-bold text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition-all flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark Read
                </button>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  )
}
