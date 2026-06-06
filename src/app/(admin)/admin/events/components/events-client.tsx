"use client"

import { useState, useEffect } from "react"
import {
  Search, Plus,
  FileEdit, Trash2, Users, Calendar, MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
import { EventFormDialog } from "./event-form-dialog"
import { EventParticipantsDialog } from "./event-participants-dialog"
import { useLanguage } from "@/lib/language-context"
import { getCached, setCached, invalidateCache } from "@/lib/client-cache"

type EventItem = {
  id: string
  name: string
  date: string
  venue: string | null
  time: string | null
  isFeeRequired: boolean
  feeAmount: number | null
  status: 'DRAFT' | 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
  _count: {
    eventPayments: number
  }
}

export function EventsClient() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [participantsEvent, setParticipantsEvent] = useState<EventItem | null>(null)
  const [participantsOpen, setParticipantsOpen] = useState(false)
  const { t } = useLanguage()
  const e = t.admin.events

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    const cacheKey = "events:list"
    const cached = getCached(cacheKey)
    if (cached) {
      setEvents(cached); setIsLoading(false)
      fetch("/api/events?limit=100").then(r => r.json()).then(d => { if (d.data) { setCached(cacheKey, d.data); setEvents(d.data) } }).catch(() => {})
      return
    }
    try {
      setIsLoading(true)
      const res = await fetch("/api/events?limit=100")
      const data = await res.json()
      setEvents(data.data || [])
      setCached(cacheKey, data.data || [])
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(e.confirmDelete)) return
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" })
      if (res.ok) {
        invalidateCache("events:")
        fetchEvents()
      } else {
        alert(e.deleteFailed)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Filter events locally by search
  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.venue && event.venue.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getEventStatusBadge = (status: string, dateStr: string) => {
    if (status === "DRAFT")
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">{e.statusDraft}</span>
    if (status === "CANCELLED")
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive">{e.statusCancelled}</span>
    if (status === "COMPLETED")
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600">{e.statusCompleted}</span>
    if (status === "ONGOING")
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600">{e.statusOngoing}</span>

    const today = new Date(); today.setHours(0, 0, 0, 0)
    const eventDate = new Date(dateStr); eventDate.setHours(0, 0, 0, 0)
    const diffDays = Math.round((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0)
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive">{e.statusOverdue}</span>
    if (diffDays === 0)
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/15 text-primary">{e.statusToday}</span>
    if (diffDays === 1)
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600">{e.statusTomorrow}</span>
    if (diffDays <= 7)
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600">{t.admin.common.inDays} {diffDays} {t.admin.common.days}</span>
    if (diffDays <= 30)
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600">{t.admin.common.inDays} {diffDays} {t.admin.common.days}</span>
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">{t.admin.common.inDays} {diffDays} {t.admin.common.days}</span>
  }

  const openParticipants = (event: EventItem) => {
    setParticipantsEvent(event)
    setParticipantsOpen(true)
  }

  return (
    <div className="space-y-6">
      <EventFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchEvents}
      />
      <EventParticipantsDialog
        event={participantsEvent}
        open={participantsOpen}
        onOpenChange={setParticipantsOpen}
      />

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center w-full sm:w-auto space-x-2">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={e.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background/50 border-border/50 focus:border-primary"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            {e.addEvent}
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden premium-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">{e.colEventDetails}</TableHead>
              <TableHead className="font-semibold">{e.colDateTime}</TableHead>
              <TableHead className="font-semibold">{e.colVenue}</TableHead>
              <TableHead className="font-semibold">{e.colFees}</TableHead>
              <TableHead className="font-semibold">{e.colStatus}</TableHead>
              <TableHead className="text-right font-semibold">{e.colActions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-12 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-6 w-16 bg-muted animate-pulse rounded-full" /></TableCell>
                  <TableCell className="text-right"><div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  {e.noEvents}
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => (
                <TableRow key={event.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-foreground">
                        {event.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span className="text-foreground">{new Date(event.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                      <span className="text-muted-foreground text-xs">{event.time || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="line-clamp-1">{event.venue || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground font-semibold">
                    {event.isFeeRequired ? `₹${event.feeAmount}` : <span className="text-emerald-500 text-xs">{e.freeEntry}</span>}
                  </TableCell>
                  <TableCell>
                    {getEventStatusBadge(event.status, event.date)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        title="Manage Participants"
                        onClick={() => openParticipants(event)}
                        className="flex items-center gap-1 p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors text-xs font-medium"
                      >
                        <Users className="h-4 w-4" />
                        <span>{event._count.eventPayments}</span>
                      </button>
                      <button
                        title="Edit Event"
                        className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <FileEdit className="h-4 w-4" />
                      </button>
                      <button
                        title="Delete Event"
                        onClick={() => handleDelete(event.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
