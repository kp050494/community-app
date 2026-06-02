import { prisma } from "@/lib/prisma"
import { SettingsView } from "./settings-view"

export const revalidate = 0

export default async function AdminSettingsPage() {
  const admin = await prisma.admin.findFirst({
    where: { role: "SUPER_ADMIN" }
  })

  const currentPlan = await prisma.membershipPlan.findFirst({
    where: { isActive: true },
    orderBy: { year: "desc" }
  })

  return (
    <SettingsView
      adminName={admin?.name ?? null}
      adminEmail={admin?.email ?? null}
      adminRole={admin?.role ?? null}
      planYear={currentPlan?.year ?? null}
      planAmount={currentPlan?.amount ?? null}
    />
  )
}
