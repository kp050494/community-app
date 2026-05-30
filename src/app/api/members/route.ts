import { NextResponse, NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { memberSchema } from "@/lib/validations/member"
import { calculateAge } from "@/lib/utils"
import { z } from "zod"

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
          { gender: "asc" },      // Sort by gender (FEMALE, MALE, OTHER alphabetically)
          { dob: "desc" }         // Then by age (oldest first, i.e., earliest DOB first)
        ],
        include: {
          family: true
        }
      }),
      prisma.member.count({ where })
    ])

    const mappedMembers = members.map(m => {
      const age = m.dob ? calculateAge(m.dob) : null
      return {
        ...m,
        fullName: `${m.firstName} ${m.surname}`,
        age,
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

    return NextResponse.json({
      data: mappedMembers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
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

    // Generate Member ID (SKPM-XXXX)
    const count = await prisma.member.count()
    const memberId = `SKPM-${(count + 1).toString().padStart(4, '0')}`

    const member = await prisma.member.create({
      data: {
        memberId,
        firstName: body.firstName,
        surname: body.surname,
        gender: body.gender,
        dob: body.dob ? new Date(body.dob) : null,
        phone: body.phone || null,
        email: body.email || null,
        occupationRole: body.occupationRole || null,
        education: body.education || null,
        bloodGroup: body.bloodGroup || null,
        address: body.address || null,
        maritalStatus: body.maritalStatus || null,
        isActive: body.isActive ?? true,
        familyId: body.familyId
      },
      include: {
        family: true
      }
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error("Error creating member:", error)
    if (error instanceof Error && error.message.includes("fk_")) {
      return NextResponse.json(
        { error: "Family not found" },
        { status: 404 }
      )
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
