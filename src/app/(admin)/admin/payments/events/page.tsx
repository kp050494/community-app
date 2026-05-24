import { prisma } from "@/lib/prisma"
import { Calendar, Search, CreditCard, CheckSquare, XSquare, Clock, ShieldAlert } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatDate } from "@/lib/utils"

export const revalidate = 0

export default async function EventPaymentsPage() {
  const eventPayments = await prisma.eventPayment.findMany({
    include: {
      member: {
        select: {
          fullName: true,
          memberId: true,
        }
      },
      event: {
        select: {
          name: true,
          date: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  // Calculate stats
  const totalCollected = eventPayments.reduce((sum, item) => sum + item.amountPaid, 0)
  const totalPending = eventPayments.reduce((sum, item) => sum + item.pendingAmount, 0)

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold font-heading tracking-tight text-foreground">Event Registration Payments</h2>
        <p className="text-sm text-muted-foreground">
          Track registration fees, ticket revenues, and attendee balances for community assemblies and programs.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard variant="gold" className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total Event Revenue</span>
            <h4 className="text-3xl font-extrabold text-foreground font-heading">₹{totalCollected.toLocaleString("en-IN")}</h4>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Event Fees Outstanding</span>
            <h4 className="text-3xl font-extrabold text-foreground font-heading">₹{totalPending.toLocaleString("en-IN")}</h4>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </GlassCard>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden premium-card p-6">
        <h3 className="text-xl font-bold font-heading text-foreground mb-4">Attendee Dues Register</h3>
        
        {eventPayments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No event payment history found in the database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-muted-foreground">
              <thead className="text-xs text-foreground uppercase bg-muted/50 font-bold border-b border-border">
                <tr>
                  <th className="px-6 py-4">Event Function</th>
                  <th className="px-6 py-4">Attendee Name</th>
                  <th className="px-6 py-4">Required Fee</th>
                  <th className="px-6 py-4">Amount Paid</th>
                  <th className="px-6 py-4">Txn Ref</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {eventPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-white/5 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{payment.event.name}</span>
                        <span className="text-xs text-muted-foreground">{new Date(payment.event.date).toLocaleDateString("en-IN")}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{payment.member.fullName}</span>
                        <span className="text-xs font-mono">{payment.member.memberId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      ₹{payment.amountDue}
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-500">
                      ₹{payment.amountPaid}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono">
                      {payment.transactionRef || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge 
                        status={
                          payment.status === "PAID" 
                            ? "paid" 
                            : payment.status === "PARTIAL"
                            ? "partial"
                            : payment.status === "OVERDUE"
                            ? "overdue"
                            : "pending"
                        } 
                        size="sm" 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
