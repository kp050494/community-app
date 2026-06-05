"use client"

import { useState, useEffect } from "react"
import {
  Search, Plus,
  FileEdit, Trash2, Eye, Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
import { NoticeFormDialog } from "./notice-form-dialog"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatDate } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { getCached, setCached, invalidateCache } from "@/lib/client-cache"

type NoticeItem = {
  id: string
  title: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  expiryDate: string | null
  isVisible: boolean
  createdAt: string
}

export function NoticesClient() {
  const [notices, setNotices] = useState<NoticeItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editNotice, setEditNotice] = useState<NoticeItem | null>(null)
  const { t } = useLanguage()
  const n = t.admin.notices

  useEffect(() => {
    fetchNotices()
  }, [])

  const fetchNotices = async () => {
    const cacheKey = "notices:list"
    const cached = getCached(cacheKey)
    if (cached) {
      setNotices(cached); setIsLoading(false)
      fetch("/api/notices?limit=100").then(r => r.json()).then(d => { if (d.data) { setCached(cacheKey, d.data); setNotices(d.data) } }).catch(() => {})
      return
    }
    try {
      setIsLoading(true)
      const res = await fetch("/api/notices?limit=100")
      const data = await res.json()
      setNotices(data.data || [])
      setCached(cacheKey, data.data || [])
    } catch (error) {
      console.error("Failed to fetch notices:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(n.confirmDelete)) return
    try {
      const res = await fetch(`/api/notices/${id}`, { method: "DELETE" })
      if (res.ok) {
        invalidateCache("notices:")
        fetchNotices()
      } else {
        alert("Failed to delete notice")
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Filter notices locally
  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return <StatusBadge status="error" size="sm" label="Urgent" />
      case "HIGH":
        return <StatusBadge status="warning" size="sm" label="High" />
      case "MEDIUM":
        return <StatusBadge status="info" size="sm" label="Medium" />
      default:
        return <StatusBadge status="pending" size="sm" label="Low" />
    }
  }

  return (
    <div className="space-y-6">
      <NoticeFormDialog
        open={isDialogOpen}
        onOpenChange={(v) => { setIsDialogOpen(v); if (!v) setEditNotice(null) }}
        onSuccess={() => { invalidateCache("notices:"); fetchNotices() }}
        initialData={editNotice ?? undefined}
      />

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center w-full sm:w-auto space-x-2">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={n.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background/50 border-border/50 focus:border-primary"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            {n.addNotice}
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden premium-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">{n.colTitle}</TableHead>
              <TableHead className="font-semibold">{n.colCreated}</TableHead>
              <TableHead className="font-semibold">{n.colExpiry}</TableHead>
              <TableHead className="font-semibold">{n.colPriority}</TableHead>
              <TableHead className="font-semibold">{n.colVisible}</TableHead>
              <TableHead className="text-right font-semibold">{n.colActions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-4 w-48 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-6 w-16 bg-muted animate-pulse rounded-full" /></TableCell>
                  <TableCell><div className="h-6 w-16 bg-muted animate-pulse rounded-full" /></TableCell>
                  <TableCell className="text-right"><div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredNotices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  {n.noNotices}
                </TableCell>
              </TableRow>
            ) : (
              filteredNotices.map((notice) => (
                <TableRow key={notice.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded flex items-center justify-center border ${
                        notice.priority === 'URGENT' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-primary/10 text-primary border-primary/20'
                      }`}>
                        <Bell className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-foreground line-clamp-1">
                        {notice.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(notice.createdAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {notice.expiryDate ? new Date(notice.expiryDate).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "Never"}
                  </TableCell>
                  <TableCell>
                    {getPriorityBadge(notice.priority)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={notice.isVisible ? 'success' : 'error'}
                      size="sm"
                      label={notice.isVisible ? 'Visible' : 'Hidden'}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        title="View / Edit Notice"
                        onClick={() => { setEditNotice(notice); setIsDialogOpen(true) }}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        title="Edit Notice"
                        onClick={() => { setEditNotice(notice); setIsDialogOpen(true) }}
                        className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <FileEdit className="h-4 w-4" />
                      </button>
                      <button
                        title="Delete Notice"
                        onClick={() => handleDelete(notice.id)}
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
