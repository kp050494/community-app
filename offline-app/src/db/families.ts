import { db, newId } from "./database"
import { ApiError } from "./errors"
import type { FamilyRecord } from "./types"
import type { FamilyFormValues } from "@/lib/validations/family"

// Shape returned to the UI (mirrors the web app's /api/families response).
export interface FamilyDTO extends FamilyRecord {
  _count: { members: number }
}

function nullify(v: string | undefined | null): string | null {
  const s = (v ?? "").trim()
  return s === "" ? null : s
}

async function withCounts(families: FamilyRecord[]): Promise<FamilyDTO[]> {
  // Build a count map of members per family in one pass.
  const counts = new Map<string, number>()
  await db.members.each((m) => {
    counts.set(m.familyId, (counts.get(m.familyId) ?? 0) + 1)
  })
  return families.map((f) => ({ ...f, _count: { members: counts.get(f.id) ?? 0 } }))
}

export async function listFamilies(): Promise<{ data: FamilyDTO[]; total: number }> {
  const families = await db.families.toArray()
  families.sort((a, b) => a.familyName.localeCompare(b.familyName))
  const data = await withCounts(families)
  return { data, total: data.length }
}

export async function createFamily(body: FamilyFormValues): Promise<FamilyRecord> {
  // Enforce the composite uniqueness used by the web app (familyId + business + family name).
  const clash = await db.families
    .where("familyId")
    .equals(body.familyId)
    .filter(
      (f) =>
        (f.businessName ?? "") === (nullify(body.businessName) ?? "") &&
        f.familyName === body.familyName,
    )
    .first()
  if (clash) {
    throw new ApiError(409, "A family with this Family ID and name already exists.")
  }

  const now = new Date().toISOString()
  const record: FamilyRecord = {
    id: newId(),
    familyId: body.familyId.trim(),
    businessName: nullify(body.businessName),
    familyName: body.familyName.trim(),
    gotra: nullify(body.gotra),
    kutchVatan: nullify(body.kutchVatan),
    currentCity: nullify(body.currentCity),
    businessAddress: nullify(body.businessAddress),
    notes: nullify(body.notes),
    createdAt: now,
    updatedAt: now,
  }
  await db.families.add(record)
  return record
}

export async function updateFamily(
  id: string,
  body: FamilyFormValues,
): Promise<FamilyRecord> {
  const existing = await db.families.get(id)
  if (!existing) throw new ApiError(404, "Family not found")

  const updated: FamilyRecord = {
    ...existing,
    familyId: body.familyId.trim(),
    businessName: nullify(body.businessName),
    familyName: body.familyName.trim(),
    gotra: nullify(body.gotra),
    kutchVatan: nullify(body.kutchVatan),
    currentCity: nullify(body.currentCity),
    businessAddress: nullify(body.businessAddress),
    notes: nullify(body.notes),
    updatedAt: new Date().toISOString(),
  }
  await db.families.put(updated)
  return updated
}

export async function deleteFamily(id: string): Promise<void> {
  const existing = await db.families.get(id)
  if (!existing) throw new ApiError(404, "Family not found")
  // Cascade: remove the family's members too (matches onDelete: Cascade).
  await db.transaction("rw", db.families, db.members, async () => {
    await db.members.where("familyId").equals(id).delete()
    await db.families.delete(id)
  })
}
