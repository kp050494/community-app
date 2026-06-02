import { prisma } from "@/lib/prisma"
import { ReportsView } from "./components/reports-view"

export const revalidate = 0

export default async function AdminReportsPage() {
  const [
    totalMembers,
    activeMembers,
    totalFamilies,
    males,
    females,
    membersByVatan,
    membersByCity,
  ] = await Promise.all([
    prisma.member.count(),
    prisma.member.count({ where: { isActive: true } }),
    prisma.family.count(),
    prisma.member.count({ where: { gender: "MALE" } }),
    prisma.member.count({ where: { gender: "FEMALE" } }),
    prisma.family.groupBy({
      by: ["kutchVatan"],
      _count: true,
      orderBy: { _count: { kutchVatan: "desc" } },
      take: 5,
    }),
    prisma.family.groupBy({
      by: ["currentCity"],
      _count: true,
      orderBy: { _count: { currentCity: "desc" } },
      take: 5,
    }),
  ])

  return (
    <ReportsView
      totalMembers={totalMembers}
      activeMembers={activeMembers}
      totalFamilies={totalFamilies}
      males={males}
      females={females}
      membersByVatan={membersByVatan.map(v => ({ kutchVatan: v.kutchVatan, _count: (v._count as any)._all ?? v._count }))}
      membersByCity={membersByCity.map(c => ({ currentCity: c.currentCity, _count: (c._count as any)._all ?? c._count }))}
    />
  )
}
