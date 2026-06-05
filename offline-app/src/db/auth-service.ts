import bcrypt from "bcryptjs"
import { db } from "./database"
import { ApiError } from "./errors"
import type { AdminRecord } from "./types"

export interface PublicAdmin {
  id: string
  name: string
  email: string
  role: AdminRecord["role"]
}

function toPublic(a: AdminRecord): PublicAdmin {
  return { id: a.id, name: a.name, email: a.email, role: a.role }
}

/** Validate email + password against the local admin record. */
export async function verifyCredentials(
  email: string,
  password: string,
): Promise<PublicAdmin | null> {
  const admin = await db.admins.where("email").equals(email.trim().toLowerCase()).first()
  // Fall back to a case-sensitive match if the stored email isn't lowercased.
  const record = admin ?? (await db.admins.where("email").equals(email.trim()).first())
  if (!record) return null
  const ok = await bcrypt.compare(password, record.passwordHash)
  return ok ? toPublic(record) : null
}

export async function getAdminById(id: string): Promise<PublicAdmin | null> {
  const record = await db.admins.get(id)
  return record ? toPublic(record) : null
}

/** Change the signed-in admin's password after verifying the current one. */
export async function changePassword(
  adminId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const record = await db.admins.get(adminId)
  if (!record) throw new ApiError(404, "Admin not found")
  const ok = await bcrypt.compare(currentPassword, record.passwordHash)
  if (!ok) throw new ApiError(401, "Current password is incorrect.")
  if (newPassword.length < 6) throw new ApiError(400, "New password must be at least 6 characters.")
  const passwordHash = await bcrypt.hash(newPassword, 10)
  await db.admins.update(adminId, { passwordHash })
}
