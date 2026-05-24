import { MembersClient } from "./components/members-client"

export const metadata = {
  title: "Members Management | SKPPMM Admin",
}

export default function MembersPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-heading">Members</h2>
          <p className="text-muted-foreground">
            Manage community members, add new profiles, and update details.
          </p>
        </div>
      </div>
      
      <MembersClient />
    </div>
  )
}
