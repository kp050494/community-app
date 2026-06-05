"use client"

import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { GlassCard } from "@/components/shared/glass-card"
import { useTransition, useState } from "react"

export function NoticesFilterClient({ initialSearch, initialPriority }: { initialSearch: string; initialPriority: string }) {
  const router = useRouter()
  const { t } = useLanguage()
  const n = t.notices
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(initialSearch)
  const [priority, setPriority] = useState(initialPriority)

  const apply = (s: string, p: string) => {
    const params = new URLSearchParams()
    if (s) params.set("search", s)
    if (p) params.set("priority", p)
    startTransition(() => {
      router.push(`/notices${params.size ? `?${params}` : ""}`)
    })
  }

  return (
    <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && apply(search, priority)}
            placeholder={n.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm text-foreground"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={priority}
            onChange={e => { setPriority(e.target.value); apply(search, e.target.value) }}
            className="px-3 py-2 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm text-foreground"
          >
            <option value="">{n.allPriorities}</option>
            <option value="URGENT">{n.urgentOnly}</option>
            <option value="HIGH">{n.highPriority}</option>
            <option value="MEDIUM">{n.mediumPriority}</option>
            <option value="LOW">{n.lowPriority}</option>
          </select>
          <button
            onClick={() => apply(search, priority)}
            disabled={isPending}
            className="px-5 py-2 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl text-sm transition-colors border border-primary/20 shadow-md disabled:opacity-70"
          >
            {isPending ? "..." : n.filter}
          </button>
        </div>
      </div>
    </GlassCard>
  )
}
