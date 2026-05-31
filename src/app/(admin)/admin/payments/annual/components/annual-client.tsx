"use client"

import { useState, useEffect } from "react"
import {
  CreditCard, Search, Landmark, CheckCircle, AlertTriangle, Plus, RefreshCw, Bell
} from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
import { RecordPaymentDialog } from "../../components/record-payment-dialog"

type AnnualFeeItem = {
  id: string
  year: number
  dueAmount: number
  paidAmount: number
  pendingAmount: number
  status: "PAID" | "PENDING" | "PARTIAL" | "OVERDUE"
  paidDate: string | null
  paymentMode: string | null
  receiptNumber: string | null
  notes: string | null
  member: {
    fullName: string
    memberId: string
    currentCity: string | null
  }
}

type PendingMember = {
  id: string
  memberId: string
  fullName: string
  age: number | null
  phone: string | null
  annualFeeStatus?: string
}

export function AnnualPaymentsClient() {
  const [fees, setFees] = useState<AnnualFeeItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [preselectedMemberId, setPreselectedMemberId] = useState<string | undefined>()
  const [pendingMembers, setPendingMembers] = useState<PendingMember[]>([])
  const [isLoadingPending, setIsLoadingPending] = useState(true)

  const currentYear = new Date().getFullYear()

  useEffect(() => {
    fetchPayments()
    fetchPendingMembers()
  }, [])

  const fetchPayments = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/payments/annual")
      const data = await res.json()
      setFees(data.data || [])
    } catch (error) {
      console.error("Failed to fetch payments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPendingMembers = async () => {
    try {
      setIsLoadingPending(true)
      const res = await fetch(`/api/members/eligible-for-fees?year=${currentYear}`)
      const data = await res.json()
      const all: PendingMember[] = data.data || []
      // Only those who haven't fully paid
      setPendingMembers(all.filter(m => m.annualFeeStatus !== "PAID"))
    } catch (error) {
      console.error("Failed to fetch pending members:", error)
    } finally {
      setIsLoadingPending(false)
    }
  }

  const handleCollectFee = (memberId: string) => {
    setPreselectedMemberId(memberId)
    setIsDialogOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) setPreselectedMemberId(undefined)
  }

  const handlePaymentSuccess = () => {
    fetchPayments()
    fetchPendingMembers()
  }

  // Calculate totals
  const totalCollected = fees.reduce((sum, item) => sum + item.paidAmount, 0)
  const totalPending = fees.reduce((sum, item) => sum + item.pendingAmount, 0)
  const totalOverdueCount = fees.filter(item => item.status === "OVERDUE").length

  // Filter records locally
  const filteredFees = fees.filter((fee) => {
    const matchesSearch =
      fee.member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.member.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fee.receiptNumber && fee.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "ALL" || fee.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <RecordPaymentDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        onSuccess={handlePaymentSuccess}
        preselectedMemberId={preselectedMemberId}
      />

      {/* Pending Fee Notifications */}
      {!isLoadingPending && pendingMembers.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-500 shrink-0" />
            <h3 className="font-semibold text-amber-600 dark:text-amber-400 text-sm">
              Fee Collection Pending — {pendingMembers.length} eligible member{pendingMembers.length !== 1 ? "s" : ""} (Male, 18–45 yrs) have not paid for {currentYear}
            </h3>
          </div>
          <div className="overflow-x-auto rounded-lg border border-amber-500/20">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-amber-500/10 text-xs text-muted-foreground">
                  <th className="text-left px-4 py-2 font-semibold">Member</th>
                  <th className="text-left px-4 py-2 font-semibold">Age</th>
                  <th className="text-left px-4 py-2 font-semibold">Phone</th>
                  <th className="text-left px-4 py-2 font-semibold">Status</th>
                  <th className="text-right px-4 py-2 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingMembers.map((m) => (
                  <tr key={m.id} className="border-t border-amber-500/10 hover:bg-amber-500/5 transition-colors">
                    <td className="px-4 py-2.5">
                      <span className="font-medium text-foreground block">{m.fullName}</span>
                      <span className="text-xs text-muted-foreground font-mono">{m.memberId}</span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{m.age !== null ? `${m.age} yrs` : "—"}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{m.phone || "—"}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold uppercase">
                        {m.annualFeeStatus || "PENDING"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Button
                        size="sm"
                        onClick={() => handleCollectFee(m.id)}
                        className="h-7 text-xs bg-primary/90 hover:bg-primary text-primary-foreground"
                      >
                        Collect Fee
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard variant="gold" className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total Fee Collected</span>
            <h4 className="text-3xl font-extrabold text-foreground font-heading">₹{totalCollected.toLocaleString("en-IN")}</h4>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Outstanding Dues</span>
            <h4 className="text-3xl font-extrabold text-foreground font-heading">₹{totalPending.toLocaleString("en-IN")}</h4>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
            <Landmark className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Overdue Accounts</span>
            <h4 className="text-3xl font-extrabold text-foreground font-heading">{totalOverdueCount} Members</h4>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </GlassCard>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search receipts, names or IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background/50 border-border/50 focus:border-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm text-foreground"
          >
            <option value="ALL">All Statuses</option>
            <option value="PAID">Paid Only</option>
            <option value="PENDING">Pending Dues</option>
            <option value="PARTIAL">Partial Payments</option>
            <option value="OVERDUE">Overdue Accounts</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button variant="outline" size="icon" onClick={() => { fetchPayments(); fetchPendingMembers() }} className="shrink-0">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden premium-card p-6">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Receipt / Year</TableHead>
              <TableHead className="font-semibold">Member ID & Name</TableHead>
              <TableHead className="font-semibold">Due Amount</TableHead>
              <TableHead className="font-semibold">Paid Amount</TableHead>
              <TableHead className="font-semibold">Payment Date</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-12 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-12 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-6 w-16 bg-muted animate-pulse rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : filteredFees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No payment records found. Register yearly collection logs to display records here.
                </TableCell>
              </TableRow>
            ) : (
              filteredFees.map((fee) => (
                <TableRow key={fee.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-mono text-primary font-bold">{fee.receiptNumber || `DUES-${fee.year}`}</span>
                      <span className="text-xs text-muted-foreground">Year {fee.year}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">{fee.member.fullName}</span>
                      <span className="text-xs font-mono">{fee.member.memberId}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">₹{fee.dueAmount}</TableCell>
                  <TableCell className="font-semibold text-emerald-500">₹{fee.paidAmount}</TableCell>
                  <TableCell className="text-sm">
                    {fee.paidDate ? formatDate(fee.paidDate) : "Pending"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={
                        fee.status === "PAID" ? "paid"
                          : fee.status === "PARTIAL" ? "partial"
                          : fee.status === "OVERDUE" ? "overdue"
                          : "pending"
                      }
                      size="sm"
                    />
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
