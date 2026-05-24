import { EventsClient } from "./components/events-client"

export const metadata = {
  title: "Events Management | SKPPMM Admin",
}

export default function AdminEventsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold font-heading tracking-tight text-foreground">Events Calendar</h2>
          <p className="text-sm text-muted-foreground">
            Manage upcoming celebrations, cultural festivals, meetings, and register attendee dues.
          </p>
        </div>
      </div>
      <EventsClient />
    </div>
  )
}
