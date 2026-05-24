import { NextResponse, NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { memberSchema } from "@/lib/validations/member"
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

    const skip = (page - 1) * limit

    const where = search ? {
      OR: [
        { fullName: { contains: search, mode: "insensitive" as const } },
        { memberId: { contains: search, mode: "insensitive" as const } },
        { phone: { contains: search, mode: "insensitive" as const } }
      ]
    } : {}

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          family: true
        }
      }),
      prisma.member.count({ where })
    ])

    const mappedMembers = members.map(m => {
      const parts = m.fullName.split(" ")
      const firstName = parts[0]
      const lastName = parts.slice(1).join(" ")
      return {
        ...m,
        firstName,
        lastName,
        mobileNumber: m.phone,
        currentCity: m.family?.city || "",
        kutchVatan: m.family?.kutchVatan || "",
        address: m.family?.address || "",
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
        fullName: `${body.firstName} ${body.lastName}`,
        gender: body.gender,
        dob: body.dob ? new Date(body.dob) : null,
        phone: body.mobileNumber,
        email: body.email || null,
        firmName: body.occupation || null,
        education: body.education || null,
        bloodGroup: body.bloodGroup || null,
        isActive: body.isActive ?? true,
        familyId: body.familyId
      }
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error("Error creating member:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
