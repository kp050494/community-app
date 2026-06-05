"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { familySchema, type FamilyFormValues } from "@/lib/validations/family"

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

interface FamilyFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  initialData?: FamilyFormValues & { id: string }
}

const defaultValues: FamilyFormValues = {
  familyId: "",
  businessName: "",
  familyName: "",
  gotra: "",
  kutchVatan: "",
  currentCity: "",
  businessAddress: "",
  notes: "",
}

export function FamilyFormDialog({ open, onOpenChange, onSuccess, initialData }: FamilyFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FamilyFormValues>({
    resolver: zodResolver(familySchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset(initialData ?? defaultValues)
    }
  }, [open, initialData, form])

  const isEdit = Boolean(initialData)

  const onSubmit = async (data: FamilyFormValues) => {
    try {
      setIsSubmitting(true)
      const res = await fetch(initialData ? `/api/families/${initialData.id}` : "/api/families", {
        method: initialData ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null)
        throw new Error(errorBody?.error || "Failed to save family")
      }

      form.reset(defaultValues)
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading text-foreground">
            {isEdit ? "Edit Family" : "Add New Family"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the family registration details below."
              : "Create a new household to group members together."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="familyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Family ID <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. FAM-001" {...field} className="bg-background/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Patel Textiles" {...field} className="bg-background/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="familyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Family Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Patel Family" {...field} className="bg-background/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gotra"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gotra</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Kashyap" {...field} className="bg-background/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="kutchVatan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kutch Vatan</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Nakhatrana" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Surat" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="businessAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Address</FormLabel>
                  <FormControl>
                    <Input placeholder="House No, Street, Area, GIDC" {...field} className="bg-background/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Any specific details" {...field} className="bg-background/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : isEdit ? "Update Family" : "Save Family"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
