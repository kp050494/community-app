import { z } from "zod"

export const familySchema = z.object({
  familyName: z.string().min(2, "Family name is required"),
  kutchVatan: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
})

export type FamilyFormValues = z.infer<typeof familySchema>
