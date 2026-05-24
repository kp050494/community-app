import { prisma } from "@/lib/prisma"
import { Settings, Shield, User, Landmark, HardDrive, Key, Bell, CheckCircle2 } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"

export const revalidate = 0

export default async function AdminSettingsPage() {
  const admin = await prisma.admin.findFirst({
    where: { role: "SUPER_ADMIN" }
  })

  const currentPlan = await prisma.membershipPlan.findFirst({
    where: { isActive: true },
    orderBy: { year: "desc" }
  })

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold font-heading tracking-tight text-foreground">System Settings</h2>
        <p className="text-sm text-muted-foreground">
          Update administrative accounts, manage membership price tiers, and configure portal details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Profile Card & Account Details */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard variant="gold" className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold font-heading text-foreground">Admin Account</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 text-sm">
                <span className="text-muted-foreground font-semibold">Account Name:</span>
                <span className="col-span-2 text-foreground font-bold">{admin?.name || "Super Admin"}</span>
              </div>
              <div className="grid grid-cols-3 text-sm">
                <span className="text-muted-foreground font-semibold">Email Contact:</span>
                <span className="col-span-2 text-foreground font-mono">{admin?.email || "super@skppmm.org"}</span>
              </div>
              <div className="grid grid-cols-3 text-sm">
                <span className="text-muted-foreground font-semibold">Access Level:</span>
                <span className="col-span-2 text-primary font-mono font-bold">{admin?.role || "SUPER_ADMIN"}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Key className="w-4 h-4 text-primary" />
                Change Password
              </h4>
              <div className="space-y-3">
                <input 
                  type="password" 
                  placeholder="New Secure Password"
                  className="w-full px-4 py-2 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm text-foreground"
                />
                <button className="px-4 py-2 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95 border border-primary/20 rounded-lg transition-colors shadow-sm">
                  Update Account Key
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Membership fee config */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Landmark className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold font-heading text-foreground">Membership Dues</h3>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Configure the annual dues amount collected from community families. Changes will affect new receipt billing generation.
              </p>
              
              <div className="grid grid-cols-3 text-sm items-center">
                <span className="text-muted-foreground font-semibold">Active Plan:</span>
                <span className="col-span-2 text-foreground font-bold">Year {currentPlan?.year || new Date().getFullYear()}</span>
              </div>

              <div className="grid grid-cols-3 text-sm items-center">
                <span className="text-muted-foreground font-semibold">Annual Charge:</span>
                <span className="col-span-2 text-foreground font-extrabold text-lg text-primary">₹{currentPlan?.amount || 500}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <h4 className="text-sm font-bold text-foreground">Update Dues Amount</h4>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="e.g. 500"
                    defaultValue={currentPlan?.amount || 500}
                    className="w-full px-4 py-2 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm text-foreground"
                  />
                  <button className="px-4 py-2 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95 border border-primary/20 rounded-lg transition-colors shrink-0">
                    Apply Price
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
