"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import {
  Search, Plus, Filter,
  FileEdit, Trash2, Eye, Download, Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatDate } from "@/lib/utils"
import { MemberDetailsDialog } from "./member-details-dialog"
import { MemberFormDialog } from "./member-form-dialog"
import { useLanguage } from "@/lib/language-context"

type Member = {
  id: string
  memberId: string
  firstName?: string | null
  middleName?: string | null
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
  yskId?: string | null
  yuvaSanghFamilyId?: string | null
  maritalStatus?: string | null
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

const PAGE_SIZE = 10

export function MembersClient() {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [memberDialogOpen, setMemberDialogOpen] = useState(false)
  const [memberDialogData, setMemberDialogData] = useState<Member | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsMember, setDetailsMember] = useState<Member | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const { t } = useLanguage()
  const m = t.admin.members

  useEffect(() => {
    fetchMembers(currentPage, searchTerm)
  }, [currentPage])

  // Reset to page 1 and re-fetch when search changes
  useEffect(() => {
    setCurrentPage(1)
    fetchMembers(1, searchTerm)
  }, [searchTerm])

  const fetchMembers = async (page: number, search: string) => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) })
      if (search) params.set("search", search)
      const res = await fetch(`/api/members?${params.toString()}`)
      const data = await res.json()
      setMembers(data.data || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error("Failed to fetch members:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setCurrentPage(newPage)
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

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      // Fetch ALL members (not just current page)
      const res = await fetch("/api/members?limit=100000")
      const data = await res.json()
      const allMembers: Member[] = data.data || []

      const headers = [
        "Member ID", "First Name", "Surname", "Gender", "Date of Birth", "Age",
        "Blood Group", "Phone", "Email", "Address", "Education", "Occupation / Role",
        "Marital Status", "YSK ID", "Yuva Sangh Family ID",
        "Family ID", "Family Name", "Business Name", "Kutch Vatan", "Current City", "Status", "Joined Date"
      ]
      const toCSV = (val: any) => `"${String(val ?? "").replace(/"/g, '""')}"`
      const rows = allMembers.map(mbr => {
        const age = mbr.dob ? Math.floor((Date.now() - new Date(mbr.dob).getTime()) / (365.25 * 24 * 3600 * 1000)) : ""
        return [
          mbr.memberId,
          mbr.firstName || "",
          mbr.surname || "",
          mbr.gender || "",
          mbr.dob ? new Date(mbr.dob).toLocaleDateString("en-IN") : "",
          age,
          mbr.bloodGroup || "",
          mbr.phone || "",
          mbr.email || "",
          mbr.address || "",
          mbr.education || "",
          mbr.occupationRole || "",
          mbr.maritalStatus || "",
          mbr.yskId || "",
          mbr.yuvaSanghFamilyId || "",
          mbr.familyDetails?.familyId || "",
          mbr.familyDetails?.familyName || "",
          mbr.familyDetails?.businessName || "",
          mbr.familyDetails?.kutchVatan || "",
          mbr.familyDetails?.currentCity || "",
          mbr.isActive ? "Active" : "Inactive",
          new Date(mbr.createdAt).toLocaleDateString("en-IN"),
        ].map(toCSV).join(",")
      })
      const csv = [
        [`"Total Members: ${allMembers.length}"`], [],
        headers.map(toCSV).join(","),
        ...rows
      ].map(r => (Array.isArray(r) ? r.join(",") : r)).join("\n")
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `all-members-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteMember = async (id: string) => {
    if (!confirm(m.confirmDelete)) return
    const res = await fetch(`/api/members/${id}`, { method: "DELETE" })
    if (!res.ok) {
      alert(m.deleteFailed)
      return
    }
    // If last item on page, go back one page
    const newPage = members.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage
    setCurrentPage(newPage)
    fetchMembers(newPage, searchTerm)
  }

  return (
    <div className="space-y-6">
      <MemberFormDialog
        open={memberDialogOpen}
        onOpenChange={setMemberDialogOpen}
        onSuccess={() => fetchMembers(currentPage, searchTerm)}
        initialData={memberDialogData ? {
          id: memberDialogData.id,
          familyId: memberDialogData.familyDetails?.id ?? "",
          firstName: memberDialogData.firstName ?? "",
          middleName: memberDialogData.middleName ?? "",
          surname: memberDialogData.surname ?? "",
          gender: (memberDialogData.gender as "MALE" | "FEMALE" | "OTHER") ?? "MALE",
          dob: memberDialogData.dob ? new Date(memberDialogData.dob).toISOString().slice(0, 10) : "",
          bloodGroup: memberDialogData.bloodGroup ?? "",
          phone: memberDialogData.phone ?? "",
          email: memberDialogData.email ?? "",
          address: memberDialogData.address ?? "",
          education: memberDialogData.education ?? "",
          occupationRole: memberDialogData.occupationRole ?? "",
          yskId: memberDialogData.yskId ?? "",
          yuvaSanghFamilyId: memberDialogData.yuvaSanghFamilyId ?? "",
          maritalStatus: (memberDialogData.maritalStatus as "MARRIED" | "UNMARRIED" | "") ?? "",
          isActive: memberDialogData.isActive,
        } : undefined}
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
              placeholder={m.searchPlaceholder}
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
          <Button variant="outline" className="w-full sm:w-auto bg-background/50" onClick={handleExportCSV} disabled={isExporting}>
            {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {isExporting ? "Exporting..." : m.exportCsv}
          </Button>
          <Button
            onClick={handleCreateMember}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            {m.addMember}
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden premium-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">{m.colMemberId}</TableHead>
              <TableHead className="font-semibold">{m.colName}</TableHead>
              <TableHead className="font-semibold">{m.colContact}</TableHead>
              <TableHead className="font-semibold">{m.colFamily}</TableHead>
              <TableHead className="font-semibold">{m.colStatus}</TableHead>
              <TableHead className="font-semibold">{m.colJoined}</TableHead>
              <TableHead className="text-right font-semibold">{m.colActions}</TableHead>
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
                  {m.noMembers}
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
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
                      <span className="text-muted-foreground text-xs">{member.familyDetails?.businessName ? `${member.familyDetails.businessName} • ${member.familyDetails.familyId}` : member.familyDetails?.familyId || '-'} • {member.familyDetails?.currentCity || '-'}</span>
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
                    <div className="flex items-center justify-end gap-1">
                      <button
                        title="View Details"
                        onClick={() => handleViewMember(member)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        title="Edit Profile"
                        onClick={() => handleEditMember(member)}
                        className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <FileEdit className="h-4 w-4" />
                      </button>
                      <button
                        title="Delete Member"
                        onClick={() => handleDeleteMember(member.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
          {m.showing}{" "}
          <span className="font-semibold text-foreground">
            {total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, total)}
          </span>{" "}
          of <span className="font-semibold text-foreground">{total}</span> {m.membersLabel}
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1 || isLoading}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            {m.previous}
          </Button>
          <span className="text-sm text-muted-foreground px-1">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages || isLoading}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            {m.next}
          </Button>
        </div>
      </div>
    </div>
  )
}
