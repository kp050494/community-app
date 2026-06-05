import { NextResponse, NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { memberSchema } from "@/lib/validations/member"
import { calculateAge, formatMemberFullName, generateMemberId } from "@/lib/utils"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const familyId = searchParams.get("familyId") || ""

    const skip = (page - 1) * limit

    const where = {
      ...(familyId ? { familyId } : {}),
      ...(search ? {
        OR: [
          { firstName: { contains: search, mode: "insensitive" as const } },
          { surname: { contains: search, mode: "insensitive" as const } },
          { fullName: { contains: search, mode: "insensitive" as const } },
          { memberId: { contains: search, mode: "insensitive" as const } },
          { phone: { contains: search, mode: "insensitive" as const } }
        ]
      } : {})
    }

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { firstName: "asc" },
          { surname: "asc" },
        ],
        include: {
          family: true
        }
      }),
      prisma.member.count({ where })
    ])

    // Fetch fields not yet in the Prisma client cache separately via raw SQL
    const memberIds = members.map(m => m.id)
    const extraFields: { id: string; middleName: string | null; yskId: string | null; yuvaSanghFamilyId: string | null; maritalStatus: string | null }[] =
      memberIds.length > 0
        ? await prisma.$queryRawUnsafe(
            `SELECT id, "middleName", "yskId", "yuvaSanghFamilyId", "maritalStatus" FROM members WHERE id = ANY($1::text[])`,
            memberIds
          )
        : []
    const extraMap = new Map(extraFields.map(r => [r.id, r]))

    const mappedMembers = members.map(m => {
      const age = m.dob ? calculateAge(m.dob) : null
      const extra = extraMap.get(m.id)
      const middleName = extra?.middleName ?? null
      const fullName = formatMemberFullName(m.firstName, m.surname, m.fullName)
      return {
        ...m,
        firstName: m.firstName ?? "",
        middleName,
        surname: m.surname ?? "",
        fullName,
        age,
        yskId: extra?.yskId ?? null,
        yuvaSanghFamilyId: extra?.yuvaSanghFamilyId ?? null,
        maritalStatus: extra?.maritalStatus ?? null,
        telephoneNumber: m.phone,
        familyDetails: {
          id: m.family.id,
          familyId: m.family.familyId,
          businessName: m.family.businessName,
          familyName: m.family.familyName,
          kutchVatan: m.family.kutchVatan,
          currentCity: m.family.currentCity,
          businessAddress: m.family.businessAddress
        }
      }
    })

    const res = NextResponse.json({ data: mappedMembers, total, page, limit, totalPages: Math.ceil(total / limit) })
    res.headers.set("Cache-Control", "private, max-age=20, stale-while-revalidate=60")
    return res
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const json = await req.json()
    const validation = memberSchema.safeParse(json)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }
    const body = validation.data

    // Generate Member ID (SKPM-XXXX) — derive from max existing number to avoid
    // collisions when members have been deleted or the DB was partially reset.
    const allIds = await prisma.member.findMany({ select: { memberId: true } })
    const maxNum = allIds.reduce((max, m) => {
      const match = m.memberId.match(/^SKPM-(\d+)$/)
      return match ? Math.max(max, parseInt(match[1], 10)) : max
    }, 0)
    const memberId = generateMemberId(maxNum + 1)

    const member = await prisma.member.create({
      data: {
        memberId,
        firstName: body.firstName,
        surname: body.surname,
        fullName: `${body.firstName} ${body.middleName} ${body.surname}`,
        joinedDate: new Date(),
        gender: body.gender,
        dob: body.dob ? new Date(body.dob) : null,
        phone: body.phone || null,
        email: body.email || null,
        occupationRole: body.occupationRole || null,
        education: body.education || null,
        bloodGroup: body.bloodGroup || null,
        address: body.address || null,
        isActive: body.isActive ?? true,
        familyId: body.familyId
      },
      include: { family: true }
    })

    // Save fields not yet in the Prisma client cache via raw SQL (bypasses client validation until next full regeneration)
    await prisma.$executeRawUnsafe(
      `UPDATE members SET "middleName" = $1, "yskId" = $2, "yuvaSanghFamilyId" = $3, "maritalStatus" = $4 WHERE id = $5`,
      body.middleName || null,
      body.yskId || null,
      body.yuvaSanghFamilyId || null,
      body.maritalStatus || null,
      member.id
    )

    return NextResponse.json({
      ...member,
      middleName: body.middleName || null,
      yskId: body.yskId || null,
      yuvaSanghFamilyId: body.yuvaSanghFamilyId || null,
      maritalStatus: body.maritalStatus || null,
    }, { status: 201 })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error("Error creating member:", msg)
    if (msg.includes("fk_") || msg.includes("Foreign key")) {
      return NextResponse.json({ error: "Family not found" }, { status: 404 })
    }
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
