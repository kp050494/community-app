import { db } from "./database"
import type { AdminRecord, FamilyRecord, MemberRecord, SettingRecord } from "./types"

interface BackupFile {
  app: "skppmm-offline"
  version: 1
  exportedAt: string
  data: {
    admins: AdminRecord[]
    families: FamilyRecord[]
    members: MemberRecord[]
    settings: SettingRecord[]
  }
}

/** Serialize the whole database to a JSON string for backup. */
export async function exportBackup(): Promise<string> {
  const [admins, families, members, settings] = await Promise.all([
    db.admins.toArray(),
    db.families.toArray(),
    db.members.toArray(),
    db.settings.toArray(),
  ])
  const payload: BackupFile = {
    app: "skppmm-offline",
    version: 1,
    exportedAt: new Date().toISOString(),
    data: { admins, families, members, settings },
  }
  return JSON.stringify(payload, null, 2)
}

/** Trigger a download of the backup JSON in the WebView. */
export async function downloadBackup(): Promise<void> {
  const json = await exportBackup()
  const blob = new Blob([json], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `skppmm-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/** Replace all local data with the contents of a backup file. */
export async function importBackup(json: string): Promise<void> {
  let parsed: BackupFile
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new Error("That file isn't valid JSON.")
  }
  if (parsed?.app !== "skppmm-offline" || !parsed.data) {
    throw new Error("That doesn't look like an SKPPMM backup file.")
  }

  const { admins, families, members, settings } = parsed.data
  await db.transaction("rw", db.admins, db.families, db.members, db.settings, async () => {
    await Promise.all([db.admins.clear(), db.families.clear(), db.members.clear(), db.settings.clear()])
    await db.admins.bulkAdd(admins ?? [])
    await db.families.bulkAdd(families ?? [])
    await db.members.bulkAdd(members ?? [])
    await db.settings.bulkAdd(settings ?? [])
  })
}
