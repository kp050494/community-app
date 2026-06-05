"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type FamilyDetailsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  family?: {
    id: string
    familyId: string
    businessName: string
    familyName: string
    gotra?: string | null
    kutchVatan?: string | null
    currentCity?: string | null
    businessAddress?: string | null
    notes?: string | null
    createdAt?: string
    updatedAt?: string
    membersCount?: number
  }
  onEdit?: () => void
  onDelete?: () => void
}

export function FamilyDetailsDialog({ open, onOpenChange, family, onEdit, onDelete }: FamilyDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading text-foreground">Family Details</DialogTitle>
          <DialogDescription>
            Review the family record and update or remove it if needed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {!family ? (
            <div className="rounded-xl border border-border p-6 text-sm text-muted-foreground">
              Family information is not available.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Family ID</p>
                  <p className="mt-2 font-semibold text-foreground">{family.familyId}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Business Name</p>
                  <p className="mt-2 font-semibold text-foreground">{family.businessName}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Family Name</p>
                  <p className="mt-2 font-semibold text-foreground">{family.familyName}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Registered Members</p>
                  <p className="mt-2 font-semibold text-foreground">{family.membersCount ?? 0}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Gotra</p>
                  <p className="mt-2 text-foreground">{family.gotra || "-"}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Kutch Vatan</p>
                  <p className="mt-2 text-foreground">{family.kutchVatan || "-"}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Current City</p>
                  <p className="mt-2 text-foreground">{family.currentCity || "-"}</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background/80 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Business Address</p>
                <p className="mt-2 text-foreground break-words">{family.businessAddress || "-"}</p>
              </div>

              <div className="rounded-xl border border-border bg-background/80 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Notes</p>
                <p className="mt-2 text-foreground break-words">{family.notes || "-"}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t border-border">
          <div>
            {onDelete && family && (
              <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
                Delete Family
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            {onEdit && family && (
              <Button type="button" variant="outline" onClick={onEdit}>
                Edit
              </Button>
            )}
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
