"use client"

import { useState, useEffect } from "react"
import { 
  Search, Plus, MoreHorizontal, 
  FileEdit, Trash2, Eye, Bell, Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NoticeFormDialog } from "./notice-form-dialog"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatDate } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"

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
  const { t } = useLanguage()
  const n = t.admin.notices

  useEffect(() => {
    fetchNotices()
  }, [])

  const fetchNotices = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/notices")
      const data = await res.json()
      setNotices(data.data || [])
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
        return <StatusBadge status="error" size="sm" />
      case "HIGH":
        return <StatusBadge status="warning" size="sm" />
      case "MEDIUM":
        return <StatusBadge status="info" size="sm" />
      default:
        return <StatusBadge status="pending" size="sm" />
    }
  }

  return (
    <div className="space-y-6">
      <NoticeFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onSuccess={fetchNotices} 
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
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" />}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px] bg-card border-border shadow-xl">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          View Notice
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-primary">
                          <FileEdit className="mr-2 h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(notice.id)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
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
