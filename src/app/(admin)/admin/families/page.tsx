import { FamiliesClient } from "./components/families-client"

export const metadata = {
  title: "Families Management | SKPPMM Admin",
}

export default function FamiliesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-heading">Families</h2>
          <p className="text-muted-foreground">
            Manage community households, track family members, and group individuals.
          </p>
        </div>
      </div>
      
      <FamiliesClient />
    </div>
  )
}
