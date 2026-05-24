import { prisma } from "@/lib/prisma"
import { Bell, Calendar, FileText, Search } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { FloatingOrbs } from "@/components/shared/floating-orbs"
import { SectionHeader } from "@/components/shared/section-header"
import { StatusBadge } from "@/components/shared/status-badge"

export const revalidate = 30 // Revalidate every 30 seconds

interface NoticesPageProps {
  searchParams: Promise<{
    search?: string
    priority?: string
  }>
}

export default async function PublicNoticesPage({ searchParams }: NoticesPageProps) {
  const resolvedSearchParams = await searchParams
  const search = resolvedSearchParams.search || ""
  const priority = resolvedSearchParams.priority || ""

  // Fetch notices from database
  const now = new Date()
  const notices = await prisma.notice.findMany({
    where: {
      isVisible: true,
      OR: [
        { expiryDate: null },
        { expiryDate: { gte: now } }
      ],
      AND: [
        search ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } }
          ]
        } : {},
        priority ? { priority: priority as any } : {}
      ]
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  // Map database priorities to status-badge compatible types
  const getPriorityBadgeStatus = (p: string) => {
    switch (p) {
      case "URGENT":
        return "error"
      case "HIGH":
        return "warning"
      case "MEDIUM":
        return "info"
      default:
        return "pending"
    }
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden py-16 px-4 md:px-8">
      <FloatingOrbs variant="gold" className="opacity-15" />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <SectionHeader
          overline="Official Announcements"
          title="Notice Board"
          gujaratiSubtitle="સરકારી જાહેરાત અને સૂચના પત્રક"
          description="Stay updated with the latest news, guidelines, meeting decisions, and community regulations."
          centered
        />

        {/* Filter and Search Bar */}
        <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <form method="GET" action="/notices" className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search notices by keyword..."
                className="w-full pl-9 pr-4 py-2 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm text-foreground"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                name="priority"
                defaultValue={priority}
                className="px-3 py-2 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm text-foreground"
              >
                <option value="">All Priorities</option>
                <option value="URGENT">Urgent Only</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>

              <button
                type="submit"
                className="px-5 py-2 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl text-sm transition-colors border border-primary/20 shadow-md"
              >
                Filter
              </button>
            </div>
          </form>
        </GlassCard>

        {/* Notices Stack */}
        <div className="space-y-6">
          {notices.length === 0 ? (
            <GlassCard className="p-12 text-center text-muted-foreground">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20 text-primary">
                <Bell className="w-6 h-6 animate-pulse" />
              </div>
              <p className="font-semibold text-lg text-foreground">No Notices Found</p>
              <p className="text-sm mt-1">Try resetting your search query or filters.</p>
            </GlassCard>
          ) : (
            notices.map((notice) => (
              <GlassCard key={notice.id} variant={notice.priority === "URGENT" || notice.priority === "HIGH" ? "gold" : "default"} hover className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                
                {/* Bell Icon & Priority */}
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
                  <StatusBadge 
                    status={getPriorityBadgeStatus(notice.priority)} 
                    size="sm" 
                  />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-xl font-bold font-heading text-foreground">
                      {notice.title}
                    </h3>
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
                        Download Attached Document
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
