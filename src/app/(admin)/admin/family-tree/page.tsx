import { prisma } from "@/lib/prisma"
import { FamilyTreeClient } from "./components/family-tree-client"

export const revalidate = 0

export default async function FamilyTreePage() {
  // Fetch families with members (excluding middleName to avoid stale Prisma client issue)
  const families = await prisma.family.findMany({
    include: {
      members: {
        select: {
          id: true,
          memberId: true,
          fullName: true,
          firstName: true,
          surname: true,
          gender: true,
          dob: true,
          phone: true,
          bloodGroup: true,
          occupationRole: true,
          isActive: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { familyName: "asc" },
  })

  // Fetch middleName for all members via raw SQL (bypasses stale Prisma client cache)
  const allMemberIds = families.flatMap(f => f.members.map(m => m.id))
  const middleNames: { id: string; middleName: string | null }[] =
    allMemberIds.length > 0
      ? await prisma.$queryRawUnsafe(
          `SELECT id, "middleName" FROM members WHERE id = ANY($1::text[])`,
          allMemberIds
        )
      : []
  const middleNameMap = new Map(middleNames.map(r => [r.id, r.middleName]))

  // Merge middleName into each member
  const familiesWithMiddleName = families.map(f => ({
    ...f,
    members: f.members.map(m => ({
      ...m,
      middleName: middleNameMap.get(m.id) ?? null,
    })),
  }))

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 h-full">
      <FamilyTreeClient families={familiesWithMiddleName} />
    </div>
  )
}
