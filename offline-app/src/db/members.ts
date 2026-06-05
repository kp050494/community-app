import { db, newId } from "./database"
import { ApiError } from "./errors"
import type { MemberRecord } from "./types"
import type { MemberFormValues } from "@/lib/validations/member"
import {
  generateMemberId,
  formatMemberFullName,
  calculateAge,
} from "@/lib/utils"

// Shape returned to the UI (mirrors the web app's /api/members response).
export interface MemberDTO extends MemberRecord {
  age: number | null
  telephoneNumber: string | null
  familyDetails: {
    id: string
    familyId: string
    businessName: string | null
    familyName: string
    kutchVatan: string | null
    currentCity: string | null
    businessAddress: string | null
  } | null
}

function nullify(v: string | undefined | null): string | null {
  const s = (v ?? "").trim()
  return s === "" ? null : s
}

async function toDTO(m: MemberRecord): Promise<MemberDTO> {
  const family = await db.families.get(m.familyId)
  return {
    ...m,
    firstName: m.firstName ?? "",
    middleName: m.middleName ?? null,
    surname: m.surname ?? "",
    fullName: formatMemberFullName(m.firstName, m.surname, m.fullName),
    age: m.dob ? calculateAge(m.dob) : null,
    telephoneNumber: m.phone,
    familyDetails: family
      ? {
          id: family.id,
          familyId: family.familyId,
          businessName: family.businessName,
          familyName: family.familyName,
          kutchVatan: family.kutchVatan,
          currentCity: family.currentCity,
          businessAddress: family.businessAddress,
        }
      : null,
  }
}

interface ListParams {
  page: number
  limit: number
  search: string
  familyId: string
}

export async function listMembers(params: ListParams) {
  const { page, limit, search, familyId } = params
  let rows = await db.members.toArray()

  if (familyId) rows = rows.filter((m) => m.familyId === familyId)

  if (search) {
    const q = search.toLowerCase()
    rows = rows.filter((m) => {
      const full = formatMemberFullName(m.firstName, m.surname, m.fullName).toLowerCase()
      return (
        (m.firstName ?? "").toLowerCase().includes(q) ||
        (m.surname ?? "").toLowerCase().includes(q) ||
        full.includes(q) ||
        m.memberId.toLowerCase().includes(q) ||
        (m.phone ?? "").toLowerCase().includes(q)
      )
    })
  }

  // Order by first name then surname (matches the API).
  rows.sort(
    (a, b) =>
      (a.firstName ?? "").localeCompare(b.firstName ?? "") ||
      (a.surname ?? "").localeCompare(b.surname ?? ""),
  )

  const total = rows.length
  const skip = (page - 1) * limit
  const pageRows = rows.slice(skip, skip + limit)
  const data = await Promise.all(pageRows.map(toDTO))

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  }
}

async function nextMemberId(): Promise<string> {
  const all = await db.members.toArray()
  const maxNum = all.reduce((max, m) => {
    const match = m.memberId.match(/^SKPM-(\d+)$/)
    return match ? Math.max(max, parseInt(match[1], 10)) : max
  }, 0)
  return generateMemberId(maxNum + 1)
}

export async function createMember(body: MemberFormValues): Promise<MemberRecord> {
  const family = await db.families.get(body.familyId)
  if (!family) throw new ApiError(404, "Family not found")

  const now = new Date().toISOString()
  const record: MemberRecord = {
    id: newId(),
    memberId: await nextMemberId(),
    familyId: body.familyId,
    firstName: body.firstName.trim(),
    middleName: nullify(body.middleName),
    surname: body.surname.trim(),
    fullName: `${body.firstName} ${body.middleName} ${body.surname}`.replace(/\s+/g, " ").trim(),
    dob: body.dob ? new Date(body.dob).toISOString() : null,
    joinedDate: now,
    gender: body.gender,
    bloodGroup: nullify(body.bloodGroup),
    address: nullify(body.address),
    phone: nullify(body.phone),
    email: nullify(body.email),
    education: nullify(body.education),
    occupationRole: nullify(body.occupationRole),
    yskId: nullify(body.yskId),
    yuvaSanghFamilyId: nullify(body.yuvaSanghFamilyId),
    maritalStatus: nullify(body.maritalStatus),
    isActive: body.isActive ?? true,
    createdAt: now,
    updatedAt: now,
  }
  await db.members.add(record)
  return record
}

export async function updateMember(
  id: string,
  body: MemberFormValues,
): Promise<MemberRecord> {
  const existing = await db.members.get(id)
  if (!existing) throw new ApiError(404, "Member not found")

  const family = await db.families.get(body.familyId)
  if (!family) throw new ApiError(404, "Family not found")

  const updated: MemberRecord = {
    ...existing,
    familyId: body.familyId,
    firstName: body.firstName.trim(),
    middleName: nullify(body.middleName),
    surname: body.surname.trim(),
    fullName: `${body.firstName} ${body.middleName} ${body.surname}`.replace(/\s+/g, " ").trim(),
    dob: body.dob ? new Date(body.dob).toISOString() : null,
    gender: body.gender,
    bloodGroup: nullify(body.bloodGroup),
    address: nullify(body.address),
    phone: nullify(body.phone),
    email: nullify(body.email),
    education: nullify(body.education),
    occupationRole: nullify(body.occupationRole),
    yskId: nullify(body.yskId),
    yuvaSanghFamilyId: nullify(body.yuvaSanghFamilyId),
    maritalStatus: nullify(body.maritalStatus),
    isActive: body.isActive ?? true,
    updatedAt: new Date().toISOString(),
  }
  await db.members.put(updated)
  return updated
}

export async function deleteMember(id: string): Promise<void> {
  const existing = await db.members.get(id)
  if (!existing) throw new ApiError(404, "Member not found")
  await db.members.delete(id)
}
