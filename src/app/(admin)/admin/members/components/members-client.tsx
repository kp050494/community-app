"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { 
  Search, Plus, Filter, MoreHorizontal, 
  FileEdit, Trash2, Eye, Download, UserPlus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatDate } from "@/lib/utils"
import { MemberDetailsDialog } from "./member-details-dialog"
import { MemberFormDialog } from "./member-form-dialog"

type Member = {
  id: string
  memberId: string
  firstName?: string | null
  surname?: string | null
  fullName?: string | null
  phone?: string | null
  isActive: boolean
  createdAt: string
  gender?: string | null
  dob?: string | null
  bloodGroup?: string | null
  address?: string | null
  email?: string | null
  education?: string | null
  occupationRole?: string | null
  familyDetails?: {
    id: string
    familyId: string
    businessName: string | null
    familyName: string
    currentCity?: string | null
    kutchVatan?: string | null
    businessAddress?: string | null
  } | null
}

export function MembersClient() {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [memberDialogOpen, setMemberDialogOpen] = useState(false)
  const [memberDialogData, setMemberDialogData] = useState<Member | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsMember, setDetailsMember] = useState<Member | null>(null)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/members")
      const data = await res.json()
      setMembers(data.data || [])
    } catch (error) {
      console.error("Failed to fetch members:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateMember = () => {
    setMemberDialogData(null)
    setMemberDialogOpen(true)
  }

  const handleEditMember = (member: Member) => {
    setMemberDialogData(member)
    setMemberDialogOpen(true)
  }

  const handleViewMember = (member: Member) => {
    setDetailsMember(member)
    setDetailsOpen(true)
  }

  const handleExportCSV = () => {
    const headers = [
      "Member ID", "First Name", "Surname", "Gender", "Date of Birth", "Age",
      "Blood Group", "Phone", "Email", "Address", "Education", "Occupation / Role",
      "Family ID", "Family Name", "Business Name", "Kutch Vatan", "Current City", "Status", "Joined Date"
    ]
    const toCSV = (val: any) => `"${String(val ?? "").replace(/"/g, '""')}"`
    const rows = members.map(m => {
      const age = m.dob ? Math.floor((Date.now() - new Date(m.dob).getTime()) / (365.25 * 24 * 3600 * 1000)) : ""
      return [
        m.memberId,
        m.firstName || "",
        m.surname || "",
        m.gender || "",
        m.dob ? new Date(m.dob).toLocaleDateString("en-IN") : "",
        age,
        m.bloodGroup || "",
        m.phone || "",
        m.email || "",
        m.address || "",
        m.education || "",
        m.occupationRole || "",
        m.familyDetails?.familyId || "",
        m.familyDetails?.familyName || "",
        m.familyDetails?.businessName || "",
        m.familyDetails?.kutchVatan || "",
        m.familyDetails?.currentCity || "",
        m.isActive ? "Active" : "Inactive",
        new Date(m.createdAt).toLocaleDateString("en-IN"),
      ].map(toCSV).join(",")
    })
    const csv = [headers.map(toCSV).join(","), ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `members-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member? This cannot be undone.")) return
    const res = await fetch(`/api/members/${id}`, { method: "DELETE" })
    if (!res.ok) {
      alert("Failed to delete member")
      return
    }
    fetchMembers()
  }

  return (
    <div className="space-y-6">
      <MemberFormDialog 
        open={memberDialogOpen} 
        onOpenChange={setMemberDialogOpen} 
        onSuccess={fetchMembers} 
        initialData={memberDialogData ?? undefined}
      />
      <MemberDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        member={detailsMember ?? undefined}
        onEdit={() => {
          if (detailsMember) {
            setDetailsOpen(false)
            handleEditMember(detailsMember)
          }
        }}
        onDelete={() => {
          if (detailsMember) {
            setDetailsOpen(false)
            handleDeleteMember(detailsMember.id)
          }
        }}
      />

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center w-full sm:w-auto space-x-2">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background/50 border-border/50 focus:border-primary"
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0 bg-background/50">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto bg-background/50" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button 
            onClick={handleCreateMember}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden premium-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Member ID</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Contact</TableHead>
              <TableHead className="font-semibold">Family / City</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Joined</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-28 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-6 w-16 bg-muted animate-pulse rounded-full" /></TableCell>
                  <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell className="text-right"><div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No members found. Add your first member to get started.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member, i) => (
                <TableRow key={member.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium font-mono text-primary/80">
                    {member.memberId}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {(() => {
                        const displayName = member.fullName || [member.firstName, member.surname].filter(Boolean).join(" ") || "Unknown"
                        return (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs border border-primary/20">
                            {displayName.charAt(0).toUpperCase() || "?"}
                          </div>
                        )
                      })()}
                      <span className="font-semibold text-foreground">
                        {member.fullName || [member.firstName, member.surname].filter(Boolean).join(" ") || "Unknown Member"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {member.phone || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span className="text-foreground font-medium">{member.familyDetails?.familyName || '-'}</span>
                      <span className="text-muted-foreground text-xs">{member.familyDetails?.businessName ? `${member.familyDetails.businessName} • ${member.familyDetails.familyId}` : member.familyDetails?.familyId || '-'} • {member.familyDetails?.currentCity || member.currentCity || '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge 
                      status={member.isActive ? 'success' : 'error'} 
                      size="sm"
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(member.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" />}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px] bg-card border-border shadow-xl">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleViewMember(member)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-primary" onClick={() => handleEditMember(member)}>
                            <FileEdit className="mr-2 h-4 w-4" />
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={() => handleDeleteMember(member.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination Footer */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{members.length}</span> members
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  )
}
