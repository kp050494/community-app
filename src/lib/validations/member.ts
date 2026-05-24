import { z } from "zod"

export const memberSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date of birth",
  }),
  bloodGroup: z.string().optional(),
  education: z.string().optional(),
  occupation: z.string().optional(),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits").max(15, "Mobile number is too long"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  familyId: z.string().min(1, "Family is required"),
  isFamilyHead: z.boolean().default(false),
  isActive: z.boolean().default(true),
})

export type MemberFormValues = z.input<typeof memberSchema>
