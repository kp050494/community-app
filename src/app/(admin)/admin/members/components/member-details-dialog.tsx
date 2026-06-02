"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type MemberDetailsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  member?: {
    id: string
    memberId: string
    firstName?: string | null
    middleName?: string | null
    surname?: string | null
    fullName?: string | null
    dob?: string | null
    gender?: string | null
    isActive?: boolean
    bloodGroup?: string | null
    address?: string | null
    phone?: string | null
    email?: string | null
    education?: string | null
    occupationRole?: string | null
    familyDetails?: {
      familyId: string
      businessName: string | null
      familyName: string
      kutchVatan?: string | null
      currentCity?: string | null
      businessAddress?: string | null
    } | null
    createdAt?: string
    updatedAt?: string
  }
  onEdit?: () => void
  onDelete?: () => void
}

export function MemberDetailsDialog({ open, onOpenChange, member, onEdit, onDelete }: MemberDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading text-foreground">Member Details</DialogTitle>
          <DialogDescription>
            Review the member profile and the linked family record in a single view.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {!member ? (
            <div className="rounded-xl border border-border p-6 text-sm text-muted-foreground">
              Member information is not available.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Member ID</p>
                  <p className="mt-2 font-semibold text-foreground">{member.memberId}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</p>
                  <p className="mt-2 font-semibold text-foreground">
                    {member.fullName || [member.firstName, member.surname].filter(Boolean).join(" ") || "Unknown Member"}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Gender</p>
                  <p className="mt-2 text-foreground">{member.gender}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Date of Birth</p>
                  <p className="mt-2 text-foreground">{member.dob ? new Date(member.dob).toLocaleDateString() : "-"}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Telephone</p>
                  <p className="mt-2 text-foreground">{member.phone || "-"}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Email</p>
                  <p className="mt-2 text-foreground">{member.email || "-"}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Blood Group</p>
                  <p className="mt-2 text-foreground">{member.bloodGroup || "-"}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Occupation / Role</p>
                  <p className="mt-2 text-foreground">{member.occupationRole || "-"}</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background/80 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Address</p>
                <p className="mt-2 text-foreground break-words">{member.address || "-"}</p>
              </div>

              <div className="rounded-xl border border-border bg-background/80 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Education</p>
                <p className="mt-2 text-foreground">{member.education || "-"}</p>
              </div>

              <div className="rounded-xl border border-border bg-background/80 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Family</p>
                <p className="mt-2 font-semibold text-foreground">{member.familyDetails?.familyName || "-"}</p>
                <p className="text-sm text-muted-foreground mt-1">{member.familyDetails?.businessName || "-"}</p>
                <p className="text-sm text-muted-foreground">Family ID: {member.familyDetails?.familyId || "-"}</p>
                <p className="text-sm text-muted-foreground">City: {member.familyDetails?.currentCity || "-"}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t border-border">
          <div>
            {onDelete && member && (
              <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
                Delete Member
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            {onEdit && member && (
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
