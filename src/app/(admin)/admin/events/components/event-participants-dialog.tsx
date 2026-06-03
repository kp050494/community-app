"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  Users, Trash2, Download, Search, Loader2, ChevronDown, ChevronRight, CheckSquare, Square,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

// ── Types ────────────────────────────────────────────────────────────────────

function calcAge(dob: string | Date | null): number | null {
  if (!dob) return null
  return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000))
}

type Participant = {
  id: string
  amountDue: number
  amountPaid: number
  pendingAmount: number
  status: string
  member: {
    id: string
    memberId: string
    fullName: string | null
    firstName: string | null
    surname: string | null
    phone: string | null
    gender: string
    dob: string | null
  }
}

type MemberOption = {
  id: string
  memberId: string
  fullName: string | null
  firstName: string | null
  surname: string | null
  phone: string | null
  dob: string | null
  familyDetails?: {
    id: string
    familyId: string
    familyName: string
    businessName: string | null
  } | null
}

type FamilyGroup = {
  familyId: string
  familyName: string
  businessName: string | null
  members: MemberOption[]
}

type EventInfo = {
  id: string
  name: string
  date: string
  venue: string | null
  isFeeRequired: boolean
  feeAmount: number | null
  status: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function displayName(m: { fullName?: string | null; firstName?: string | null; surname?: string | null }) {
  return m.fullName || [m.firstName, m.surname].filter(Boolean).join(" ") || "—"
}

// ── Component ─────────────────────────────────────────────────────────────────

export function EventParticipantsDialog({
  event,
  open,
  onOpenChange,
}: {
  event: EventInfo | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [tab, setTab] = useState<"participants" | "add">("participants")
  const [participants, setParticipants] = useState<Participant[]>([])
  const [allMembers, setAllMembers] = useState<MemberOption[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // add-tab state
  const [familySearch, setFamilySearch] = useState("")
  const [expandedFamilies, setExpandedFamilies] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isBulkAdding, setIsBulkAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  // participants-tab state
  const [removing, setRemoving] = useState<string | null>(null)

  // ── Fetchers ────────────────────────────────────────────────────────────────

  const fetchParticipants = useCallback(async () => {
    if (!event) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/events/${event.id}/participants`)
      const data = await res.json()
      setParticipants(data.data || [])
    } finally {
      setIsLoading(false)
    }
  }, [event])

  const fetchMembers = useCallback(async () => {
    const res = await fetch("/api/members?limit=1000")
    const data = await res.json()
    setAllMembers(data.data || [])
  }, [])

  useEffect(() => {
    if (open && event) {
      fetchParticipants()
      fetchMembers()
      setTab("participants")
      setSelected(new Set())
      setFamilySearch("")
      setAddError(null)
    }
  }, [open, event, fetchParticipants, fetchMembers])

  // ── Derived data ─────────────────────────────────────────────────────────────

  const participantMemberIds = useMemo(() => new Set(participants.map((p) => p.member.id)), [participants])

  const familyGroups: FamilyGroup[] = useMemo(() => {
    const map = new Map<string, FamilyGroup>()
    for (const m of allMembers) {
      if (participantMemberIds.has(m.id)) continue // already added
      const fid = m.familyDetails?.id ?? "__no_family__"
      if (!map.has(fid)) {
        map.set(fid, {
          familyId: fid,
          familyName: m.familyDetails?.familyName ?? "No Family",
          businessName: m.familyDetails?.businessName ?? null,
          members: [],
        })
      }
      map.get(fid)!.members.push(m)
    }
    const q = familySearch.toLowerCase()
    return Array.from(map.values())
      .filter((g) =>
        !q ||
        g.familyName.toLowerCase().includes(q) ||
        (g.businessName ?? "").toLowerCase().includes(q) ||
        g.members.some((m) => displayName(m).toLowerCase().includes(q) || m.memberId.toLowerCase().includes(q))
      )
      .sort((a, b) => a.familyName.localeCompare(b.familyName))
  }, [allMembers, participantMemberIds, familySearch])

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const toggleFamily = (fid: string) => {
    setExpandedFamilies((prev) => {
      const next = new Set(prev)
      next.has(fid) ? next.delete(fid) : next.add(fid)
      return next
    })
  }

  const toggleMember = (mid: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(mid) ? next.delete(mid) : next.add(mid)
      return next
    })
  }

  const toggleFamilyAll = (group: FamilyGroup) => {
    const allSelected = group.members.every((m) => selected.has(m.id))
    setSelected((prev) => {
      const next = new Set(prev)
      group.members.forEach((m) => allSelected ? next.delete(m.id) : next.add(m.id))
      return next
    })
  }

  const handleBulkAdd = async () => {
    if (!event || selected.size === 0) return
    setIsBulkAdding(true)
    setAddError(null)
    const ids = Array.from(selected)
    let failed = 0
    for (const memberId of ids) {
      const res = await fetch(`/api/events/${event.id}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId }),
      })
      if (!res.ok) failed++
    }
    await fetchParticipants()
    setSelected(new Set())
    setIsBulkAdding(false)
    if (failed > 0) setAddError(`${failed} member(s) could not be added.`)
    else setTab("participants")
  }

  const handleRemove = async (participantId: string) => {
    if (!event || !confirm("Remove this participant from the event?")) return
    setRemoving(participantId)
    try {
      await fetch(`/api/events/${event.id}/participants?participantId=${participantId}`, { method: "DELETE" })
      await fetchParticipants()
    } finally {
      setRemoving(null)
    }
  }

  const handleDownloadCSV = () => {
    if (!event) return
    const headers = ["Member ID", "Full Name", "Phone", "Gender", "Age", "Amount Due (₹)", "Amount Paid (₹)", "Pending (₹)", "Status"]
    const rows = participants.map((p) => [
      p.member.memberId, displayName(p.member), p.member.phone || "", p.member.gender,
      calcAge(p.member.dob) ?? "",
      p.amountDue, p.amountPaid, p.pendingAmount, p.status,
    ])
    const meta = [
      [`Event: ${event.name}`], [`Date: ${new Date(event.date).toLocaleDateString("en-IN")}`],
      [`Venue: ${event.venue || "—"}`], [`Participants: ${participants.length}`], [], headers, ...rows,
    ]
    const csv = meta.map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url
    a.download = `${event.name.replace(/\s+/g, "_")}_participants.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  if (!event) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[760px] bg-card border-border/50 max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              {event.name}
            </DialogTitle>
            <DialogDescription>
              {new Date(event.date).toLocaleDateString("en-IN", { dateStyle: "long" })}
              {event.venue ? ` · ${event.venue}` : ""}
              {event.isFeeRequired ? ` · ₹${event.feeAmount} fee` : " · Free event"}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Tab bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/30">
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setTab("participants")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === "participants" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Participants
              <span className="ml-2 text-xs bg-primary/15 text-primary px-1.5 py-0.5 rounded-full font-semibold">
                {participants.length}
              </span>
            </button>
            <button
              onClick={() => { setTab("add"); setSelected(new Set()); setAddError(null) }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === "add" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Add by Family
            </button>
          </div>
          {tab === "participants" && (
            <Button size="sm" variant="outline" onClick={handleDownloadCSV} disabled={participants.length === 0} className="gap-1.5 h-8">
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </Button>
          )}
        </div>

        {/* ── PARTICIPANTS TAB ──────────────────────────────────────────── */}
        {tab === "participants" && (
          <div className="flex-1 overflow-y-auto">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold">Member</TableHead>
                  <TableHead className="text-xs font-semibold">Phone</TableHead>
                  <TableHead className="text-xs font-semibold">Age</TableHead>
                  <TableHead className="text-xs font-semibold">Family</TableHead>
                  <TableHead className="text-xs font-semibold">Due (₹)</TableHead>
                  <TableHead className="text-xs font-semibold">Paid (₹)</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j}><div className="h-4 w-16 bg-muted animate-pulse rounded" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : participants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-sm text-muted-foreground">
                      No participants yet. Use the &quot;Add by Family&quot; tab to add members.
                    </TableCell>
                  </TableRow>
                ) : (
                  participants.map((p) => {
                    const member = allMembers.find((m) => m.id === p.member.id)
                    return (
                      <TableRow key={p.id} className="hover:bg-muted/20">
                        <TableCell>
                          <p className="text-sm font-medium text-foreground">{displayName(p.member)}</p>
                          <p className="text-xs text-muted-foreground font-mono">{p.member.memberId}</p>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{p.member.phone || "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {calcAge(p.member.dob) !== null ? `${calcAge(p.member.dob)} yrs` : "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {member?.familyDetails?.familyName || "—"}
                        </TableCell>
                        <TableCell className="text-sm font-medium">{p.amountDue > 0 ? `₹${p.amountDue}` : "—"}</TableCell>
                        <TableCell className="text-sm text-emerald-500 font-medium">{p.amountPaid > 0 ? `₹${p.amountPaid}` : "—"}</TableCell>
                        <TableCell>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            p.status === "PAID" ? "bg-emerald-500/10 text-emerald-500" :
                            p.status === "PARTIAL" ? "bg-amber-500/10 text-amber-500" :
                            "bg-muted text-muted-foreground"
                          }`}>{p.status}</span>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleRemove(p.id)}
                            disabled={removing === p.id}
                            title="Remove participant"
                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            {removing === p.id
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : <Trash2 className="w-3.5 h-3.5" />}
                          </button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* ── ADD BY FAMILY TAB ─────────────────────────────────────────── */}
        {tab === "add" && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Search */}
            <div className="px-4 pt-3 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search family or member name..."
                  value={familySearch}
                  onChange={(e) => setFamilySearch(e.target.value)}
                  className="pl-9 bg-background/50 h-9"
                  autoFocus
                />
              </div>
              {addError && <p className="text-xs text-destructive mt-1 px-1">{addError}</p>}
            </div>

            {/* Family list */}
            <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-2">
              {familyGroups.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {familySearch ? "No families match your search" : "All members are already participating"}
                </p>
              ) : (
                familyGroups.map((group) => {
                  const isExpanded = expandedFamilies.has(group.familyId)
                  const allFamilySelected = group.members.length > 0 && group.members.every((m) => selected.has(m.id))
                  const someFamilySelected = group.members.some((m) => selected.has(m.id))
                  const visibleMembers = familySearch
                    ? group.members.filter((m) =>
                        displayName(m).toLowerCase().includes(familySearch.toLowerCase()) ||
                        m.memberId.toLowerCase().includes(familySearch.toLowerCase())
                      )
                    : group.members

                  return (
                    <div key={group.familyId} className="rounded-xl border border-border overflow-hidden">

                      {/* ── Family header row ── */}
                      <div className="flex items-center gap-3 px-4 py-3 bg-muted/60 border-l-4 border-primary/60">
                        {/* Select-all toggle */}
                        <button
                          onClick={() => toggleFamilyAll(group)}
                          className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                          title={allFamilySelected ? "Deselect all" : "Select all"}
                        >
                          {allFamilySelected
                            ? <CheckSquare className="w-4 h-4 text-primary" />
                            : someFamilySelected
                              ? <CheckSquare className="w-4 h-4 text-primary/50" />
                              : <Square className="w-4 h-4" />}
                        </button>

                        {/* Family name + chevron */}
                        <button
                          className="flex-1 flex items-center justify-between text-left"
                          onClick={() => toggleFamily(group.familyId)}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-foreground leading-tight">{group.familyName}</span>
                            {group.businessName && (
                              <span className="text-xs text-muted-foreground">{group.businessName}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                              {visibleMembers.length} member{visibleMembers.length !== 1 ? "s" : ""}
                            </span>
                            {isExpanded
                              ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                          </div>
                        </button>
                      </div>

                      {/* ── Nested member rows ── */}
                      {isExpanded && (
                        <div className="bg-background border-l-4 border-primary/20 divide-y divide-border/40">
                          {visibleMembers.map((m, idx) => (
                            <label
                              key={m.id}
                              className="flex items-center gap-3 pl-8 pr-4 py-2.5 cursor-pointer hover:bg-primary/5 transition-colors"
                            >
                              {/* tree connector dot */}
                              <span className="relative shrink-0 flex items-center justify-center w-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-border" />
                              </span>
                              <input
                                type="checkbox"
                                checked={selected.has(m.id)}
                                onChange={() => toggleMember(m.id)}
                                className="w-4 h-4 accent-primary rounded shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{displayName(m)}</p>
                                <p className="text-xs text-muted-foreground">
                                  {m.memberId}{m.phone ? ` · ${m.phone}` : ""}{calcAge(m.dob) !== null ? ` · ${calcAge(m.dob)} yrs` : ""}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">
                {selected.size > 0
                  ? <><span className="font-semibold text-foreground">{selected.size}</span> member{selected.size !== 1 ? "s" : ""} selected</>
                  : "Select members from families above"}
              </span>
              <div className="flex gap-2">
                {selected.size > 0 && (
                  <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())} className="h-8">
                    Clear
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleBulkAdd}
                  disabled={selected.size === 0 || isBulkAdding}
                  className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]"
                >
                  {isBulkAdding
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Adding...</>
                    : `Add ${selected.size > 0 ? selected.size : ""} Member${selected.size !== 1 ? "s" : ""}`}
                </Button>
              </div>
            </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  )
}
