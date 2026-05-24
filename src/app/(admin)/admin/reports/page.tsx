import { prisma } from "@/lib/prisma"
import { BarChart3, Users, Landmark, Download, FileSpreadsheet, Map, Award, HelpCircle } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"

export const revalidate = 0

export default async function AdminReportsPage() {
  // Run queries to gather insights
  const [
    totalMembers,
    activeMembers,
    totalFamilies,
    males,
    females,
    membersByVatan,
    membersByCity,
  ] = await Promise.all([
    prisma.member.count(),
    prisma.member.count({ where: { isActive: true } }),
    prisma.family.count(),
    prisma.member.count({ where: { gender: "MALE" } }),
    prisma.member.count({ where: { gender: "FEMALE" } }),
    prisma.family.groupBy({
      by: ["kutchVatan"],
      _count: true,
      orderBy: { _count: { kutchVatan: "desc" } },
      take: 5,
    }),
    prisma.family.groupBy({
      by: ["city"],
      _count: true,
      orderBy: { _count: { city: "desc" } },
      take: 5,
    }),
  ])

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-heading tracking-tight text-foreground">Reports & Census</h2>
          <p className="text-sm text-muted-foreground">
            Analyze Mandal demographics, village origins, member distributions, and download census archives.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 text-xs font-bold text-primary hover:text-primary-foreground bg-primary/10 hover:bg-primary border border-primary/20 rounded-xl transition-all flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            Export PDF Census
          </button>
          <button className="px-4 py-2 text-xs font-bold text-emerald-500 hover:text-emerald-500-foreground bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 rounded-xl transition-all flex items-center gap-2 shadow-sm">
            <FileSpreadsheet className="w-4 h-4" />
            Export Excel Sheet
          </button>
        </div>
      </div>

      {/* Demographics Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total Members</span>
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h4 className="text-3xl font-extrabold text-foreground font-heading">{totalMembers}</h4>
          <p className="text-xs text-muted-foreground mt-2">
            <span className="text-emerald-500 font-semibold">{activeMembers}</span> active residents
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total Households</span>
            <Landmark className="w-5 h-5 text-primary" />
          </div>
          <h4 className="text-3xl font-extrabold text-foreground font-heading">{totalFamilies}</h4>
          <p className="text-xs text-muted-foreground mt-2">
            Average {(totalMembers / (totalFamilies || 1)).toFixed(1)} members per family
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Male Members</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <h4 className="text-3xl font-extrabold text-foreground font-heading">{males}</h4>
          <p className="text-xs text-muted-foreground mt-2">
            {((males / (totalMembers || 1)) * 100).toFixed(1)}% of total census
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Female Members</span>
            <Users className="w-5 h-5 text-rose-500" />
          </div>
          <h4 className="text-3xl font-extrabold text-foreground font-heading">{females}</h4>
          <p className="text-xs text-muted-foreground mt-2">
            {((females / (totalMembers || 1)) * 100).toFixed(1)}% of total census
          </p>
        </GlassCard>
      </div>

      {/* Origin Vatan & City Distribution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Origin Villages (Kutch Vatan) */}
        <GlassCard variant="gold" className="p-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
            <Map className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold font-heading text-foreground">Top Kutch Villages (Vatan)</h3>
          </div>
          <div className="space-y-4">
            {membersByVatan.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No village distribution records found.</p>
            ) : (
              membersByVatan.map((vatan, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{vatan.kutchVatan || "Unknown"}</span>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground bg-muted border border-white/5 px-2.5 py-0.5 rounded-full">
                    {vatan._count} Households
                  </span>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        {/* Current City Distribution */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
            <Landmark className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold font-heading text-foreground">Current Residential Distribution</h3>
          </div>
          <div className="space-y-4">
            {membersByCity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No residential city records found.</p>
            ) : (
              membersByCity.map((city, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs text-secondary-foreground font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{city.city || "Unknown"}</span>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground bg-muted border border-white/5 px-2.5 py-0.5 rounded-full">
                    {city._count} Households
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
