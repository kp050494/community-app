"use client"

import { Users, Landmark, Map } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { ReportExportButtons } from "./report-export-buttons"
import { useLanguage } from "@/lib/language-context"

interface ReportsViewProps {
  totalMembers: number
  activeMembers: number
  totalFamilies: number
  males: number
  females: number
  membersByVatan: { kutchVatan: string | null; _count: number }[]
  membersByCity: { currentCity: string | null; _count: number }[]
}

export function ReportsView({
  totalMembers, activeMembers, totalFamilies, males, females,
  membersByVatan, membersByCity,
}: ReportsViewProps) {
  const { t } = useLanguage()
  const r = t.admin.reports

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-heading tracking-tight text-foreground">{r.title}</h2>
          <p className="text-sm text-muted-foreground">{r.subtitle}</p>
        </div>
        <ReportExportButtons
          totalMembers={totalMembers}
          totalFamilies={totalFamilies}
          males={males}
          females={females}
          membersByVatan={membersByVatan}
          membersByCity={membersByCity}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{r.totalMembers}</span>
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h4 className="text-3xl font-extrabold text-foreground font-heading">{totalMembers}</h4>
          <p className="text-xs text-muted-foreground mt-2">
            <span className="text-emerald-500 font-semibold">{activeMembers}</span> {r.activeMembers}
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{r.totalFamilies}</span>
            <Landmark className="w-5 h-5 text-primary" />
          </div>
          <h4 className="text-3xl font-extrabold text-foreground font-heading">{totalFamilies}</h4>
          <p className="text-xs text-muted-foreground mt-2">
            {(totalMembers / (totalFamilies || 1)).toFixed(1)} {r.members} / {r.families}
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{r.maleMembers}</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <h4 className="text-3xl font-extrabold text-foreground font-heading">{males}</h4>
          <p className="text-xs text-muted-foreground mt-2">
            {((males / (totalMembers || 1)) * 100).toFixed(1)}%
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{r.femaleMembers}</span>
            <Users className="w-5 h-5 text-rose-500" />
          </div>
          <h4 className="text-3xl font-extrabold text-foreground font-heading">{females}</h4>
          <p className="text-xs text-muted-foreground mt-2">
            {((females / (totalMembers || 1)) * 100).toFixed(1)}%
          </p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard variant="gold" className="p-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
            <Map className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold font-heading text-foreground">{r.topVatan}</h3>
          </div>
          <div className="space-y-4">
            {membersByVatan.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">{t.admin.common.noData}</p>
            ) : (
              membersByVatan.map((vatan, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-bold">{i + 1}</span>
                    <span className="text-sm font-semibold text-foreground">{vatan.kutchVatan || "Unknown"}</span>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground bg-muted border border-white/5 px-2.5 py-0.5 rounded-full">
                    {vatan._count} {r.families}
                  </span>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
            <Landmark className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold font-heading text-foreground">{r.topCities}</h3>
          </div>
          <div className="space-y-4">
            {membersByCity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">{t.admin.common.noData}</p>
            ) : (
              membersByCity.map((city, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs text-secondary-foreground font-bold">{i + 1}</span>
                    <span className="text-sm font-semibold text-foreground">{city.currentCity || "Unknown"}</span>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground bg-muted border border-white/5 px-2.5 py-0.5 rounded-full">
                    {city._count} {r.families}
                  </span>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
