import Dexie, { type Table } from "dexie"
import type { AdminRecord, FamilyRecord, MemberRecord, SettingRecord } from "./types"

// The local IndexedDB database — this replaces the server + Postgres entirely.
export class SkppmmDatabase extends Dexie {
  admins!: Table<AdminRecord, string>
  families!: Table<FamilyRecord, string>
  members!: Table<MemberRecord, string>
  settings!: Table<SettingRecord, string>

  constructor() {
    super("skppmm-offline")
    this.version(1).stores({
      // Only indexed fields are listed; other fields are stored but not indexed.
      admins: "id, email",
      families: "id, familyId, familyName, businessName, currentCity, kutchVatan",
      members: "id, memberId, familyId, firstName, surname, phone, isActive",
      settings: "key",
    })
  }
}

export const db = new SkppmmDatabase()

/** Generate a stable unique id (used as the primary key for all records). */
export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}
