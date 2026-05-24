import { NoticesClient } from "./components/notices-client"

export const metadata = {
  title: "Notices Management | SKPPMM Admin",
}

export default function AdminNoticesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold font-heading tracking-tight text-foreground">Notice Board</h2>
          <p className="text-sm text-muted-foreground">
            Publish official announcements, bulletins, meeting guidelines, and upload PDF notices.
          </p>
        </div>
      </div>
      <NoticesClient />
    </div>
  )
}
