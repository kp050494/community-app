import bcrypt from "bcryptjs"
import { db, newId } from "./database"

// Default admin created on first launch. The user is told to change this in Settings.
export const DEFAULT_ADMIN_EMAIL = "admin@skppmm.org"
export const DEFAULT_ADMIN_PASSWORD = "admin123"

let seedPromise: Promise<void> | null = null

/** Idempotently ensure a default admin exists. Safe to call on every app start. */
export function ensureSeeded(): Promise<void> {
  if (!seedPromise) seedPromise = doSeed()
  return seedPromise
}

async function doSeed(): Promise<void> {
  const adminCount = await db.admins.count()
  if (adminCount > 0) return

  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10)
  await db.admins.add({
    id: newId(),
    name: "Super Admin",
    email: DEFAULT_ADMIN_EMAIL,
    passwordHash,
    role: "SUPER_ADMIN",
    createdAt: new Date().toISOString(),
  })
}
