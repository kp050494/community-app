import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Calendar, MapPin, Clock, ArrowLeft, ShieldAlert, Users, Award, IndianRupee } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { FloatingOrbs } from "@/components/shared/floating-orbs"
import { StatusBadge } from "@/components/shared/status-badge"
import Link from "next/link"

export const revalidate = 30 // Revalidate every 30 seconds

interface EventDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PublicEventDetailPage({ params }: EventDetailPageProps) {
  const resolvedParams = await params
  const event = await prisma.event.findUnique({
    where: {
      id: resolvedParams.id,
    },
    include: {
      createdBy: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!event) {
    notFound()
  }

  const isCompleted = new Date(event.date) < new Date() || event.status === "COMPLETED"

  // Map event status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ONGOING":
        return <StatusBadge status="warning" size="md" />
      case "COMPLETED":
        return <StatusBadge status="success" size="md" />
      case "CANCELLED":
        return <StatusBadge status="error" size="md" />
      default:
        return <StatusBadge status="paid" size="md" />
    }
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden py-12 px-4 md:px-8">
      <FloatingOrbs variant="mixed" className="opacity-15" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Navigation back */}
        <Link 
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all events
        </Link>

        {/* Banner Area */}
        <div className="relative h-64 md:h-96 w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-muted">
          {event.bannerUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={event.bannerUrl} 
              alt={event.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-background to-secondary/30 flex items-center justify-center text-primary">
              <Calendar className="w-24 h-24 opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6 md:p-8">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                {getStatusBadge(event.status)}
                {event.isFeeRequired ? (
                  <span className="bg-primary/25 border border-primary/50 text-primary-foreground text-xs px-2.5 py-0.5 rounded-full font-bold">
                    Paid Registration
                  </span>
                ) : (
                  <span className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    Free Event
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold font-heading text-white tracking-tight">
                {event.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Detail Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-6">
            <GlassCard className="p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold font-heading text-foreground mb-4">Event Overview</h2>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {event.description || "No full description has been provided for this event yet."}
                </p>
              </div>

              {event.organizer && (
                <div className="pt-6 border-t border-white/5">
                  <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    Organizer Details
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    This event is coordinated by **{event.organizer}** under the patronage of Pandesara Mitra Mandal Committee.
                  </p>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Quick Stats Panel */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard variant="gold" className="p-6 space-y-5">
              <h3 className="text-lg font-bold font-heading text-foreground">Schedule & Venue</h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Date</h4>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {new Date(event.date).toLocaleDateString("en-IN", { dateStyle: "full" })}
                    </p>
                  </div>
                </div>

                {event.time && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground">Time</h4>
                      <p className="text-muted-foreground text-xs mt-0.5">{event.time}</p>
                    </div>
                  </div>
                )}

                {event.venue && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground">Location</h4>
                      <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{event.venue}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-4">
                <h3 className="text-lg font-bold font-heading text-foreground">Registration Dues</h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fee Amount:</span>
                  <span className="text-lg font-extrabold text-foreground flex items-center">
                    {event.isFeeRequired ? (
                      <>
                        <IndianRupee className="w-4 h-4 mr-0.5 text-primary" />
                        {event.feeAmount}
                      </>
                    ) : (
                      <span className="text-emerald-500">Free Entry</span>
                    )}
                  </span>
                </div>

                {event.maxAttendees && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Capacity Limit:</span>
                    <span className="font-semibold text-foreground">{event.maxAttendees} seats</span>
                  </div>
                )}

                {event.deadline && (
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Deadline to Register:</span>
                      <p className="mt-0.5">
                        {new Date(event.deadline).toLocaleDateString("en-IN", { dateStyle: "long" })}
                      </p>
                    </div>
                  </div>
                )}

                {!isCompleted && event.isFeeRequired && (
                  <div className="text-xs text-center text-muted-foreground pt-2">
                    * Annual and event registration fees are collected at the Mandal Office. Please bring your Member ID card.
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

        </div>

      </div>
    </div>
  )
}
