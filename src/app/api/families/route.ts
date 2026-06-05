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
        { familyId: { contains: search, mode: "insensitive" as const } },
        { familyName: { contains: search, mode: "insensitive" as const } },
        { businessName: { contains: search, mode: "insensitive" as const } },
        { kutchVatan: { contains: search, mode: "insensitive" as const } },
        { currentCity: { contains: search, mode: "insensitive" as const } }
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

    // Fetch gotra separately via raw SQL since the Prisma client cache may not have the field yet
    const familyIds = families.map(f => f.id)
    const gotras: { id: string; gotra: string | null }[] =
      familyIds.length > 0
        ? await prisma.$queryRawUnsafe(
            `SELECT id, "gotra" FROM families WHERE id = ANY($1::text[])`,
            familyIds
          )
        : []
    const gotraMap = new Map(gotras.map(r => [r.id, r.gotra]))
    const mappedFamilies = families.map(f => ({ ...f, gotra: gotraMap.get(f.id) ?? null }))

    const res = NextResponse.json({ data: mappedFamilies, total, page, limit, totalPages: Math.ceil(total / limit) })
    res.headers.set("Cache-Control", "private, max-age=30, stale-while-revalidate=60")
    return res
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

    // Check if family with this familyId, businessName, and familyName already exists
    const existingFamily = await prisma.family.findFirst({
      where: {
        familyId: body.familyId,
        businessName: body.businessName,
        familyName: body.familyName
      }
    })

    if (existingFamily) {
      return NextResponse.json(
        { error: "Family with this ID, business name, and family name already exists" },
        { status: 409 }
      )
    }

    const family = await prisma.family.create({
      data: {
        familyId: body.familyId,
        businessName: body.businessName,
        familyName: body.familyName,
        kutchVatan: body.kutchVatan || null,
        currentCity: body.currentCity || null,
        businessAddress: body.businessAddress || null,
        notes: body.notes || null,
      }
    })

    // Save gotra via raw SQL (bypasses Prisma client validation until next full regeneration)
    if (body.gotra) {
      await prisma.$executeRawUnsafe(
        `UPDATE families SET "gotra" = $1 WHERE id = $2`,
        body.gotra,
        family.id
      )
    }

    return NextResponse.json({ ...family, gotra: body.gotra || null }, { status: 201 })
  } catch (error) {
    console.error("Error creating family:", error)
    if (error instanceof Error && error.message.includes("Unique constraint failed")) {
      return NextResponse.json(
        { error: "Family with this ID, business name, and family name combination already exists" },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
