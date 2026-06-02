"use client"

import { User, Landmark, Key } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { useLanguage } from "@/lib/language-context"

interface SettingsViewProps {
  adminName: string | null
  adminEmail: string | null
  adminRole: string | null
  planYear: number | null
  planAmount: number | null
}

export function SettingsView({ adminName, adminEmail, adminRole, planYear, planAmount }: SettingsViewProps) {
  const { t } = useLanguage()
  const s = t.admin.settings

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold font-heading tracking-tight text-foreground">{s.title}</h2>
        <p className="text-sm text-muted-foreground">{s.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Admin Account */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard variant="gold" className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold font-heading text-foreground">{s.adminAccount}</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 text-sm">
                <span className="text-muted-foreground font-semibold">{s.accountName}</span>
                <span className="col-span-2 text-foreground font-bold">{adminName || "Super Admin"}</span>
              </div>
              <div className="grid grid-cols-3 text-sm">
                <span className="text-muted-foreground font-semibold">{s.emailContact}</span>
                <span className="col-span-2 text-foreground font-mono">{adminEmail || "super@skppmm.org"}</span>
              </div>
              <div className="grid grid-cols-3 text-sm">
                <span className="text-muted-foreground font-semibold">{s.accessLevel}</span>
                <span className="col-span-2 text-primary font-mono font-bold">{adminRole || "SUPER_ADMIN"}</span>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5 space-y-4">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Key className="w-4 h-4 text-primary" />
                {s.changePassword}
              </h4>
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder={s.newPassword}
                  className="w-full px-4 py-2 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm text-foreground"
                />
                <button className="px-4 py-2 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95 border border-primary/20 rounded-lg transition-colors shadow-sm">
                  {s.updateKey}
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Membership Dues */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Landmark className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold font-heading text-foreground">{s.membershipDues}</h3>
            </div>
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">{s.duesDesc}</p>
              <div className="grid grid-cols-3 text-sm items-center">
                <span className="text-muted-foreground font-semibold">{s.activePlan}</span>
                <span className="col-span-2 text-foreground font-bold">{s.year} {planYear || new Date().getFullYear()}</span>
              </div>
              <div className="grid grid-cols-3 text-sm items-center">
                <span className="text-muted-foreground font-semibold">{s.annualCharge}</span>
                <span className="col-span-2 text-foreground font-extrabold text-lg text-primary">₹{planAmount || 500}</span>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5 space-y-4">
              <h4 className="text-sm font-bold text-foreground">{s.updateDues}</h4>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    defaultValue={planAmount || 500}
                    className="w-full px-4 py-2 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm text-foreground"
                  />
                  <button className="px-4 py-2 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95 border border-primary/20 rounded-lg transition-colors shrink-0">
                    {s.applyPrice}
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  )
}
