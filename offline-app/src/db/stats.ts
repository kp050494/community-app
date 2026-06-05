import { db } from "./database"
import { formatCurrency } from "@/lib/utils"

// Mirrors the web app's /api/admin/stats payload. Events/fees arrive in a later
// phase, so those fields report zero for now.
export async function getDashboardStats() {
  const [totalMembers, totalFamilies] = await Promise.all([
    db.members.count(),
    db.families.count(),
  ])

  return {
    totalMembers,
    totalFamilies,
    upcomingEventsCount: 0,
    nextEventName: null as string | null,
    feeFormatted: formatCurrency(0),
    currentYear: new Date().getFullYear(),
  }
}
