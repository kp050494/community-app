"use client"

import { useState, useEffect } from "react"
import { 
  Search, Plus, MoreHorizontal, 
  FileEdit, Trash2, Eye, Users
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
import { FamilyDetailsDialog } from "./family-details-dialog"
import { FamilyFormDialog } from "./family-form-dialog"
import { formatDate } from "@/lib/utils"

type Family = {
  id: string
  familyId: string
  businessName: string
  familyName: string
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
    if (!confirm("Are you sure you want to delete this family? This cannot be undone.")) return
    const res = await fetch(`/api/families/${id}`, { method: "DELETE" })
    if (!res.ok) {
      alert("Failed to delete family")
      return
    }
    fetchFamilies()
  }

  return (
    <div className="space-y-6">
      <FamilyFormDialog 
        open={familyDialogOpen} 
        onOpenChange={setFamilyDialogOpen} 
        onSuccess={fetchFamilies} 
        initialData={familyDialogData ?? undefined}
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
              placeholder="Search families by name or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background/50 border-border/50 focus:border-primary"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button 
            onClick={handleCreateFamily}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Family
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden premium-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Family / Business</TableHead>
              <TableHead className="font-semibold">Members</TableHead>
              <TableHead className="font-semibold">Vatan</TableHead>
              <TableHead className="font-semibold">City</TableHead>
              <TableHead className="font-semibold">Created</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
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
                  No families found. Add a household to begin organizing members.
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
                      {family._count.members} Members
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
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" />}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px] bg-card border-border shadow-xl">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleViewFamily(family)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Family
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-primary" onClick={() => handleEditFamily(family)}>
                            <FileEdit className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={() => handleDeleteFamily(family.id)}>
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
    </div>
  )
}
