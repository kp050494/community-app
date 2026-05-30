"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Search, X, Check } from "lucide-react"
import { memberSchema, type MemberFormValues } from "@/lib/validations/member"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type FamilyOption = {
  id: string
  familyId: string
  businessName: string
  familyName: string
  kutchVatan: string | null
  currentCity: string | null
}

interface MemberFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function MemberFormDialog({ open, onOpenChange, onSuccess }: MemberFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [families, setFamilies] = useState<FamilyOption[]>([])
  const [isLoadingFamilies, setIsLoadingFamilies] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      firstName: "",
      surname: "",
      gender: "" as any,
      dob: "",
      bloodGroup: "",
      education: "",
      occupationRole: "",
      phone: "",
      email: "",
      familyId: "",
      isFamilyHead: false,
      isActive: true,
    },
  })

  useEffect(() => {
    if (open) {
      loadFamilies()
    }
  }, [open])

  const loadFamilies = async () => {
    try {
      setIsLoadingFamilies(true)
      const res = await fetch("/api/families")
      const data = await res.json()
      setFamilies(data.data || [])
    } catch (error) {
      console.error("Failed to load families:", error)
    } finally {
      setIsLoadingFamilies(false)
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredFamilies = families.filter(f =>
    f.familyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.familyId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.currentCity && f.currentCity.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 8)

  const handleSelectFamily = (family: FamilyOption) => {
    form.setValue("familyId", family.id)
    setSearchQuery(`${family.familyName} (${family.city || 'No City'})`)
    setIsSearchOpen(false)
  }

  const handleClearFamily = () => {
    form.setValue("familyId", "")
    setSearchQuery("")
    setIsSearchOpen(true)
  }

  const onSubmit = async (data: MemberFormValues) => {
    try {
      setIsSubmitting(true)
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Failed to create member")
      
      form.reset()
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error(error)
      // TODO: Add toast notification for error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-card border-border/50 max-h-[90vh] overflow-y-auto premium-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading text-foreground">Add New Member</DialogTitle>
          <DialogDescription>
            Enter the details for the new community member.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            
            {/* Personal Details Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Ramesh" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surname <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Patel" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                            <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Family Selection Section */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">Family Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="familyId"
                  render={() => (
                    <FormItem className="relative" ref={dropdownRef}>
                      <FormLabel>Select Family <span className="text-destructive">*</span></FormLabel>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={isLoadingFamilies ? "Loading families..." : "Search family by name..."}
                          className="pl-9 pr-9 bg-background/50 border-border/50 focus:border-primary"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setIsSearchOpen(true)
                          }}
                          onFocus={() => setIsSearchOpen(true)}
                          disabled={isLoadingFamilies}
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={handleClearFamily}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      
                      {isSearchOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg overflow-hidden premium-card">
                          <div className="max-h-[200px] overflow-y-auto p-1 premium-scrollbar">
                            {filteredFamilies.length === 0 ? (
                              <div className="p-4 text-center text-sm text-muted-foreground">
                                No families found.
                              </div>
                            ) : (
                              filteredFamilies.map((family) => (
                                <button
                                  type="button"
                                  key={family.id}
                                  onClick={() => handleSelectFamily(family)}
                                  className="w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-muted/50 flex items-center justify-between group transition-colors"
                                >
                                  <div>
                                    <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                                      {family.businessName} • {family.familyName}
                                    </div>
                                    <div className="text-xs text-muted-foreground font-mono mt-0.5">
                                      {family.familyId} • {family.currentCity ? family.currentCity : 'No City'} {family.kutchVatan ? `• ${family.kutchVatan}` : ''}
                                    </div>
                                  </div>
                                  {form.watch("familyId") === family.id && (
                                    <Check className="h-4 w-4 text-primary" />
                                  )}
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isFamilyHead"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-background/50">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Family Head</FormLabel>
                        <DialogDescription>
                          Is this member the head of the family?
                        </DialogDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Details Section */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">Contact Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telephone Number <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="+91 9876543210" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="ramesh@example.com" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Professional Details Section */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">Professional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education</FormLabel>
                      <FormControl>
                        <Input placeholder="B.Com, MBA" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="occupationRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation / Business Role</FormLabel>
                      <FormControl>
                        <Input placeholder="Owner, Manager, Sales" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-border">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Member"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
