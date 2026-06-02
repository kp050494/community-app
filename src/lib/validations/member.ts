import { z } from "zod"

export const memberSchema = z.object({
  familyId: z.string().min(1, "Family is required"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  middleName: z.string().min(2, "Middle name (father's name) must be at least 2 characters"),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date of birth",
  }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  bloodGroup: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long").optional().or(z.literal("")),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  education: z.string().optional().or(z.literal("")),
  occupationRole: z.string().optional().or(z.literal("")),
  isActive: z.boolean(),
})

export type MemberFormValues = z.infer<typeof memberSchema>
