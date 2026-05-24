import { prisma } from "@/lib/prisma"
import { Calendar, MapPin, Clock, IndianRupee } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { FloatingOrbs } from "@/components/shared/floating-orbs"
import { SectionHeader } from "@/components/shared/section-header"
import { StatusBadge } from "@/components/shared/status-badge"
import Link from "next/link"

export const revalidate = 60 // Revalidate every 60 seconds

export default async function PublicEventsPage() {
  const events = await prisma.event.findMany({
    where: {
      status: {
        in: ["UPCOMING", "ONGOING", "COMPLETED"],
      },
    },
    orderBy: {
      date: "desc",
    },
  })

  // Group events
  const now = new Date()
  const upcomingEvents = events.filter(e => new Date(e.date) >= now && e.status !== "COMPLETED")
  const pastEvents = events.filter(e => new Date(e.date) < now || e.status === "COMPLETED")

  return (
    <div className="relative min-h-screen bg-background overflow-hidden py-16 px-4 md:px-8">
      <FloatingOrbs variant="mixed" className="opacity-15" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Header */}
        <SectionHeader
          overline="Community Gatherings"
          title="Events & Celebrations"
          gujaratiSubtitle="સાંસ્કૃતિક ઉત્સવો અને કાર્યક્રમો"
          description="Join us in celebrating our culture, sharing knowledge, and building strong bonds through our seasonal festivals, business meets, and youth camps."
          centered
        />

        {/* Upcoming Events Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 border-b border-primary/20 pb-4">
            <h2 className="text-2xl font-bold font-heading text-foreground">Upcoming Events</h2>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {upcomingEvents.length === 0 ? (
            <GlassCard className="p-8 text-center text-muted-foreground">
              No upcoming events scheduled right now. Check back soon!
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <GlassCard key={event.id} variant="gold" hover className="flex flex-col h-full overflow-hidden group">
                  <div className="h-48 overflow-hidden relative bg-muted">
                    {event.bannerUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={event.bannerUrl} 
                        alt={event.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/30 text-primary">
                        <Calendar className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <StatusBadge status="paid" size="sm" />
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                    <div>
                      <h3 className="text-xl font-bold font-heading text-foreground group-hover:text-primary transition-colors">
                        {event.name}
                      </h3>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{new Date(event.date).toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      {event.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="line-clamp-1">{event.venue}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                      <span className="text-sm font-semibold flex items-center text-foreground">
                        {event.isFeeRequired ? (
                          <>
                            <IndianRupee className="w-3.5 h-3.5 mr-0.5 text-primary" />
                            {event.feeAmount} / person
                          </>
                        ) : (
                          <span className="text-emerald-500">Free Entry</span>
                        )}
                      </span>
                      <Link 
                        href={`/events/${event.id}`}
                        className="text-xs font-bold text-primary hover:text-primary-foreground bg-primary/10 hover:bg-primary px-3 py-2 rounded-lg transition-colors border border-primary/20"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

        {/* Past Events Section */}
        <div className="space-y-8 pt-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <h2 className="text-2xl font-bold font-heading text-foreground">Past Memories</h2>
          </div>

          {pastEvents.length === 0 ? (
            <GlassCard className="p-8 text-center text-muted-foreground">
              No past events recorded yet.
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event) => (
                <GlassCard key={event.id} hover className="flex flex-col h-full overflow-hidden opacity-85 hover:opacity-100 transition-opacity group">
                  <div className="h-44 overflow-hidden relative bg-muted grayscale group-hover:grayscale-0 transition-all duration-500">
                    {event.bannerUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={event.bannerUrl} 
                        alt={event.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/15 text-muted-foreground">
                        <Calendar className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold font-heading text-foreground">
                        {event.name}
                      </h3>
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>{new Date(event.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                      </div>
                      {event.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span className="line-clamp-1">{event.venue}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end pt-3 border-t border-white/10 mt-auto">
                      <Link 
                        href={`/events/${event.id}`}
                        className="text-xs font-bold text-muted-foreground hover:text-foreground hover:underline transition-all"
                      >
                        See Photos & details →
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
