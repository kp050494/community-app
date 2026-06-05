"use client"

import { useState, useEffect } from "react"
import {
  Search, Plus,
  FileEdit, Trash2, Eye, Users, Download, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
import { FamilyDetailsDialog } from "./family-details-dialog"
import { FamilyFormDialog } from "./family-form-dialog"
import { formatDate } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"

type Family = {
  id: string
  familyId: string
  businessName: string
  familyName: string
  gotra: string | null
  kutchVatan: string | null
  currentCity: string | null
  businessAddress: string | null
  notes: string | null
  createdAt: string
  _count: {
    members: number
  }
}

export function FamiliesClient() {
  const [families, setFamilies] = useState<Family[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [familyDialogOpen, setFamilyDialogOpen] = useState(false)
  const [familyDialogData, setFamilyDialogData] = useState<Family | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsFamily, setDetailsFamily] = useState<Family | null>(null)
  const [isExportingAll, setIsExportingAll] = useState(false)
  const [exportingFamilyId, setExportingFamilyId] = useState<string | null>(null)
  const { t } = useLanguage()
  const f = t.admin.families

  useEffect(() => {
    fetchFamilies()
  }, [])

  const fetchFamilies = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/families")
      const data = await res.json()
      setFamilies(data.data || [])
    } catch (error) {
      console.error("Failed to fetch families:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateFamily = () => {
    setFamilyDialogData(null)
    setFamilyDialogOpen(true)
  }

  const handleEditFamily = (family: Family) => {
    setFamilyDialogData(family)
    setFamilyDialogOpen(true)
  }

  const handleViewFamily = (family: Family) => {
    setDetailsFamily(family)
    setDetailsOpen(true)
  }

  const handleDeleteFamily = async (id: string) => {
    if (!confirm(f.confirmDelete)) return
    const res = await fetch(`/api/families/${id}`, { method: "DELETE" })
    if (!res.ok) {
      alert(f.deleteFailed)
      return
    }
    fetchFamilies()
  }

  const buildFamilyCSV = (familyList: Family[], members: any[]) => {
    const toCSV = (val: any) => `"${String(val ?? "").replace(/"/g, '""')}"`
    const headers = [
      "Family ID", "Family Name", "Business Name", "Gotra", "Kutch Vatan", "Current City",
      "Business Address", "Notes", "Total Members",
      "Member ID", "Member Name", "Gender", "Date of Birth", "Age",
      "Blood Group", "Phone", "Email", "Education", "Occupation", "Status"
    ]
    const rows: string[] = [headers.map(toCSV).join(",")]

    for (const fam of familyList) {
      const famMembers = members.filter((m: any) => m.familyDetails?.id === fam.id || m.familyId === fam.id)
      if (famMembers.length === 0) {
        rows.push([
          fam.familyId, fam.familyName, fam.businessName || "", fam.gotra || "", fam.kutchVatan || "",
          fam.currentCity || "", fam.businessAddress || "", fam.notes || "", fam._count.members,
          "", "", "", "", "", "", "", "", "", "", ""
        ].map(toCSV).join(","))
      } else {
        famMembers.forEach((mbr: any, idx: number) => {
          const age = mbr.dob ? Math.floor((Date.now() - new Date(mbr.dob).getTime()) / (365.25 * 24 * 3600 * 1000)) : ""
          rows.push([
            idx === 0 ? fam.familyId : "",
            idx === 0 ? fam.familyName : "",
            idx === 0 ? (fam.businessName || "") : "",
            idx === 0 ? (fam.gotra || "") : "",
            idx === 0 ? (fam.kutchVatan || "") : "",
            idx === 0 ? (fam.currentCity || "") : "",
            idx === 0 ? (fam.businessAddress || "") : "",
            idx === 0 ? (fam.notes || "") : "",
            idx === 0 ? fam._count.members : "",
            mbr.memberId || "", mbr.fullName || [mbr.firstName, mbr.surname].filter(Boolean).join(" ") || "",
            mbr.gender || "",
            mbr.dob ? new Date(mbr.dob).toLocaleDateString("en-IN") : "",
            age, mbr.bloodGroup || "", mbr.phone || "", mbr.email || "",
            mbr.education || "", mbr.occupationRole || "",
            mbr.isActive ? "Active" : "Inactive"
          ].map(toCSV).join(","))
        })
      }
      rows.push("")  // blank row between families
    }
    return rows.join("\n")
  }

  const handleExportFamily = async (family: Family) => {
    setExportingFamilyId(family.id)
    try {
      const res = await fetch(`/api/members?familyId=${family.id}&limit=1000`)
      const data = await res.json()
      const csv = buildFamilyCSV([family], data.data || [])
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${family.familyName.replace(/\s+/g, "_")}_${family.familyId}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExportingFamilyId(null)
    }
  }

  const handleExportAllFamilies = async () => {
    setIsExportingAll(true)
    try {
      const res = await fetch("/api/members?limit=100000")
      const data = await res.json()
      const csv = buildFamilyCSV(families, data.data || [])
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `all-families-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsExportingAll(false)
    }
  }

  return (
    <div className="space-y-6">
      <FamilyFormDialog 
        open={familyDialogOpen} 
        onOpenChange={setFamilyDialogOpen} 
        onSuccess={fetchFamilies} 
        initialData={familyDialogData ? {
          id: familyDialogData.id,
          familyId: familyDialogData.familyId,
          businessName: familyDialogData.businessName ?? "",
          familyName: familyDialogData.familyName,
          gotra: familyDialogData.gotra ?? "",
          kutchVatan: familyDialogData.kutchVatan ?? "",
          currentCity: familyDialogData.currentCity ?? "",
          businessAddress: familyDialogData.businessAddress ?? "",
          notes: familyDialogData.notes ?? "",
        } : undefined}
      />
      <FamilyDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        family={detailsFamily ? {
          ...detailsFamily,
          membersCount: detailsFamily._count.members,
        } : undefined}
        onEdit={() => {
          if (detailsFamily) {
            setDetailsOpen(false)
            handleEditFamily(detailsFamily)
          }
        }}
        onDelete={() => {
          if (detailsFamily) {
            setDetailsOpen(false)
            handleDeleteFamily(detailsFamily.id)
          }
        }}
      />

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center w-full sm:w-auto space-x-2">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={f.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background/50 border-border/50 focus:border-primary"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="w-full sm:w-auto bg-background/50"
            onClick={handleExportAllFamilies}
            disabled={isExportingAll || families.length === 0}
          >
            {isExportingAll ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {isExportingAll ? "Exporting..." : "Export All"}
          </Button>
          <Button
            onClick={handleCreateFamily}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            {f.addFamily}
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden premium-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">{f.colFamilyBusiness}</TableHead>
              <TableHead className="font-semibold">{f.colMembers}</TableHead>
              <TableHead className="font-semibold">{f.colVatan}</TableHead>
              <TableHead className="font-semibold">{f.colCity}</TableHead>
              <TableHead className="font-semibold">{f.colCreated}</TableHead>
              <TableHead className="text-right font-semibold">{f.colActions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-12 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell className="text-right"><div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : families.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  {f.noFamilies}
                </TableCell>
              </TableRow>
            ) : (
              families.map((family) => (
                <TableRow key={family.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">
                          {family.familyName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {family.businessName} • {family.familyId}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {family._count.members} {f.membersLabel}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {family.kutchVatan || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {family.currentCity || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(family.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        title="View Family"
                        onClick={() => handleViewFamily(family)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        title="Export Family CSV"
                        onClick={() => handleExportFamily(family)}
                        disabled={exportingFamilyId === family.id}
                        className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-500 transition-colors disabled:opacity-50"
                      >
                        {exportingFamilyId === family.id
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <Download className="h-4 w-4" />}
                      </button>
                      <button
                        title="Edit Details"
                        onClick={() => handleEditFamily(family)}
                        className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <FileEdit className="h-4 w-4" />
                      </button>
                      <button
                        title="Delete Family"
                        onClick={() => handleDeleteFamily(family.id)}
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
    </div>
  )
}
