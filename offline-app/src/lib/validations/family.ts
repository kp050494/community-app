import { z } from "zod"

export const familySchema = z.object({
  familyId: z.string().min(1, "Family ID is required").max(50, "Family ID must be less than 50 characters"),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  familyName: z.string().min(2, "Family name must be at least 2 characters"),
  gotra: z.string().optional().or(z.literal("")),
  kutchVatan: z.string().optional().or(z.literal("")),
  currentCity: z.string().optional().or(z.literal("")),
  businessAddress: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
})

export type FamilyFormValues = z.infer<typeof familySchema>
