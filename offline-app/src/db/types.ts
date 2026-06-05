// On-device record shapes (a pragmatic subset of the Prisma schema used by v1).

export type Gender = "MALE" | "FEMALE" | "OTHER"
export type Role = "SUPER_ADMIN" | "ADMIN"

export interface AdminRecord {
  id: string
  name: string
  email: string
  passwordHash: string
  role: Role
  createdAt: string
}

export interface FamilyRecord {
  id: string
  familyId: string
  businessName: string | null
  familyName: string
  gotra: string | null
  kutchVatan: string | null
  currentCity: string | null
  businessAddress: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface MemberRecord {
  id: string
  memberId: string
  familyId: string // FK -> FamilyRecord.id
  firstName: string | null
  middleName: string | null
  surname: string | null
  fullName: string | null
  dob: string | null
  joinedDate: string | null
  gender: Gender
  bloodGroup: string | null
  address: string | null
  phone: string | null
  email: string | null
  education: string | null
  occupationRole: string | null
  yskId: string | null
  yuvaSanghFamilyId: string | null
  maritalStatus: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SettingRecord {
  key: string
  value: string
}
