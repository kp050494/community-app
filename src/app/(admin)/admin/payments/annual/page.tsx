import { AnnualPaymentsClient } from "./components/annual-client"

export const metadata = {
  title: "Annual Fees Ledger | SKPPMM Admin",
}

export default function AnnualPaymentsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold font-heading tracking-tight text-foreground">Annual Membership Fees</h2>
        <p className="text-sm text-muted-foreground">
          Track yearly community dues, search transaction receipts, and record collection updates.
        </p>
      </div>
      <AnnualPaymentsClient />
    </div>
  )
}
