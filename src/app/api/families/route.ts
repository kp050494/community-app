import { NextResponse, NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { familySchema } from "@/lib/validations/family"
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
        { familyName: { contains: search, mode: "insensitive" as const } },
        { kutchVatan: { contains: search, mode: "insensitive" as const } },
        { city: { contains: search, mode: "insensitive" as const } }
      ]
    } : {}

    const [families, total] = await Promise.all([
      prisma.family.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { members: true }
          }
        }
      }),
      prisma.family.count({ where })
    ])

    return NextResponse.json({
      data: families,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error("Error fetching families:", error)
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
    const validation = familySchema.safeParse(json)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }
    const body = validation.data

    // Generate Family ID (SKPF-XXXX)
    const count = await prisma.family.count()
    const familyId = `SKPF-${(count + 1).toString().padStart(4, '0')}`

    const family = await prisma.family.create({
      data: {
        familyId,
        familyName: body.familyName,
        kutchVatan: body.kutchVatan || null,
        address: body.address || null,
        city: body.city || null,
        notes: body.notes || null,
      }
    })

    return NextResponse.json(family, { status: 201 })
  } catch (error) {
    console.error("Error creating family:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
