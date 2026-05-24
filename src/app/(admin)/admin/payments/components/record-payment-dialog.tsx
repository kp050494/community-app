"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, CreditCard, Search, X, Check } from "lucide-react"
import { annualFeePaymentSchema } from "@/lib/validations/payment"
import { z } from "zod"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type PaymentFormValues = z.input<typeof annualFeePaymentSchema>

type MemberOption = {
  id: string
  fullName: string
  memberId: string
}

type PlanOption = {
  id: string
  year: number
  amount: number
}

interface RecordPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  preselectedMemberId?: string
}

export function RecordPaymentDialog({ open, onOpenChange, onSuccess, preselectedMemberId }: RecordPaymentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [members, setMembers] = useState<MemberOption[]>([])
  const [activePlan, setActivePlan] = useState<PlanOption | null>(null)
  const [isLoadingMeta, setIsLoadingMeta] = useState(true)

  // Search box state
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(annualFeePaymentSchema),
    defaultValues: {
      memberId: preselectedMemberId || "",
      planId: "",
      year: new Date().getFullYear(),
      dueAmount: 500,
      paidAmount: 500,
      pendingAmount: 0,
      status: "PAID",
      paidDate: new Date().toISOString().split("T")[0],
      paymentMode: "UPI",
      receiptNumber: "",
      notes: "",
    },
  })

  // Load members list
  useEffect(() => {
    if (open) {
      loadMetadata()
    }
  }, [open])

  // Sync preselectedMemberId and pre-fill search query
  useEffect(() => {
    if (preselectedMemberId && members.length > 0) {
      const selected = members.find(m => m.id === preselectedMemberId)
      if (selected) {
        form.setValue("memberId", preselectedMemberId)
        setSearchQuery(`${selected.fullName} (${selected.memberId})`)
      }
    }
  }, [preselectedMemberId, members, form])

  // Dynamically update pricing/plan details when the collection year is modified
  const selectedYear = form.watch("year")

  useEffect(() => {
    if (open && selectedYear) {
      updatePlanForYear(selectedYear)
    }
  }, [selectedYear, open])

  const updatePlanForYear = async (year: number) => {
    try {
      const planRes = await fetch(`/api/plans?year=${year}`)
      const planData = await planRes.json()
      if (planData.success && planData.data) {
        const dbPlan = planData.data
        setActivePlan(dbPlan)
        form.setValue("planId", dbPlan.id)
        form.setValue("dueAmount", dbPlan.amount)
      }
    } catch (error) {
      console.error("Error updating plan for year:", error)
    }
  }

  const loadMetadata = async () => {
    try {
      setIsLoadingMeta(true)
      
      // 1. Fetch active plan details for selected year
      const year = form.getValues("year") || new Date().getFullYear()
      const planRes = await fetch(`/api/plans?year=${year}`)
      const planData = await planRes.json()
      if (planData.success && planData.data) {
        const dbPlan = planData.data
        setActivePlan(dbPlan)
        form.setValue("planId", dbPlan.id)
        form.setValue("dueAmount", dbPlan.amount)
        form.setValue("paidAmount", dbPlan.amount) // default paid to full
      }

      // 2. Fetch members list
      const membersRes = await fetch("/api/members")
      const membersData = await membersRes.json()
      const fetchedMembers = membersData.data || []
      setMembers(fetchedMembers)

      // If preselected is set, populate name
      if (preselectedMemberId) {
        const selected = fetchedMembers.find((m: any) => m.id === preselectedMemberId)
        if (selected) {
          form.setValue("memberId", preselectedMemberId)
          setSearchQuery(`${selected.fullName} (${selected.memberId})`)
        }
      } else {
        setSearchQuery("")
      }

    } catch (error) {
      console.error("Failed to load metadata for payments:", error)
    } finally {
      setIsLoadingMeta(false)
    }
  }

  // Close search dropdown on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Calculate live balances
  const dueAmount = form.watch("dueAmount") || 0
  const paidAmount = form.watch("paidAmount") || 0

  useEffect(() => {
    const pending = Math.max(0, dueAmount - paidAmount)
    form.setValue("pendingAmount", pending)
    form.setValue("status", pending === 0 ? "PAID" : paidAmount > 0 ? "PARTIAL" : "PENDING")
  }, [dueAmount, paidAmount, form])

  // Filter members dynamically
  const filteredMembers = members.filter(m =>
    m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.memberId.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8)

  const handleSelectMember = (member: MemberOption) => {
    form.setValue("memberId", member.id)
    setSearchQuery(`${member.fullName} (${member.memberId})`)
    setIsSearchOpen(false)
  }

  const handleClearMember = () => {
    form.setValue("memberId", "")
    setSearchQuery("")
    setIsSearchOpen(true)
  }

  const onSubmit = async (data: PaymentFormValues) => {
    try {
      setIsSubmitting(true)
      
      const payload = {
        ...data,
        dueAmount: Number(data.dueAmount),
        paidAmount: Number(data.paidAmount),
        pendingAmount: Number(data.pendingAmount),
        year: Number(data.year),
        receiptNumber: data.receiptNumber || null,
        notes: data.notes || null,
      }

      const res = await fetch("/api/payments/annual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to record payment")
      
      form.reset()
      setSearchQuery("")
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedMemberId = form.watch("memberId")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-card border-border/50 max-h-[90vh] overflow-y-auto premium-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading text-foreground flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            Record Annual Payment
          </DialogTitle>
          <DialogDescription>
            Register yearly mandal maintenance fee collection receipts.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-4">
            
            {/* Search Autocomplete Member Field */}
            <div className="relative space-y-1.5" ref={dropdownRef}>
              <FormLabel className="text-sm font-semibold">Search Community Member <span className="text-destructive">*</span></FormLabel>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={isLoadingMeta ? "Loading community registry..." : "Type Name or Member ID (e.g. Ramesh or SKPM-0001)"}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setIsSearchOpen(true)
                    if (!e.target.value) {
                      form.setValue("memberId", "")
                    }
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  disabled={isLoadingMeta}
                  className="pl-9 pr-9 bg-background/50 border-border/50 focus:border-primary"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearMember}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown List */}
              {isSearchOpen && searchQuery && (
                <div className="absolute z-50 w-full bg-popover/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl mt-1 max-h-48 overflow-y-auto premium-scrollbar">
                  {filteredMembers.length === 0 ? (
                    <div className="p-3 text-xs text-muted-foreground text-center">
                      No matching members found
                    </div>
                  ) : (
                    filteredMembers.map((member) => {
                      const isSelected = selectedMemberId === member.id
                      return (
                        <div
                          key={member.id}
                          onClick={() => handleSelectMember(member)}
                          className={`flex items-center justify-between p-3 text-sm cursor-pointer hover:bg-primary/10 transition-colors ${
                            isSelected ? "bg-primary/5 text-primary font-semibold" : "text-foreground"
                          }`}
                        >
                          <div>
                            <span className="block font-medium">{member.fullName}</span>
                            <span className="text-xs text-muted-foreground font-mono">{member.memberId}</span>
                          </div>
                          {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                        </div>
                      )
                    })
                  )}
                </div>
              )}
              {/* Error Message */}
              {form.formState.errors.memberId && (
                <p className="text-xs font-semibold text-destructive mt-1">
                  Please select a member from the dropdown matches list
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Year <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="bg-background/50" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paidDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dues Amount (INR) <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="bg-background/50" 
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paidAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paid Amount (INR) <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="bg-background/50" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paymentMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Mode <span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "UPI"}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CASH">Cash</SelectItem>
                        <SelectItem value="UPI">UPI (GPay/PhonePe)</SelectItem>
                        <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                        <SelectItem value="CHEQUE">Cheque</SelectItem>
                        <SelectItem value="ONLINE">Online Portal</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receiptNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receipt Number (optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="RCP-2025-XXXX (Auto if empty)" 
                        {...field} 
                        value={field.value || ""} 
                        className="bg-background/50 font-mono" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks / Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter details or transaction ID..." {...field} value={field.value || ""} className="bg-background/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Live dues calculation summary */}
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs flex justify-between font-semibold">
              <span className="text-muted-foreground">Live Calculation:</span>
              <span className="text-foreground">
                Due: ₹{dueAmount} | Paid: ₹{paidAmount} | Pending: <span className={dueAmount - paidAmount > 0 ? "text-amber-500 font-bold" : "text-emerald-500 font-bold"}>₹{dueAmount - paidAmount}</span>
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Payment"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
