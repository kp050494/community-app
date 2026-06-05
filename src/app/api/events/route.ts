import { NextResponse, NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { eventCreateSchema } from "@/lib/validations/event"
import { z } from "zod"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status") || ""
    const search = searchParams.get("search") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where = {
      AND: [
        status ? { status: status as any } : {},
        search ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { venue: { contains: search, mode: "insensitive" as const } },
            { organizer: { contains: search, mode: "insensitive" as const } }
          ]
        } : {}
      ]
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { date: "desc" },
        skip,
        take: limit,
        include: {
          _count: { select: { eventPayments: true } }
        }
      }),
      prisma.event.count({ where })
    ])

    const res = NextResponse.json({
      success: true,
      data: events,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
    res.headers.set("Cache-Control", "private, max-age=30, stale-while-revalidate=60")
    return res
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const json = await req.json()
    
    // Parse and validate
    const validation = eventCreateSchema.safeParse(json)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const body = validation.data

    const event = await prisma.event.create({
      data: {
        name: body.name,
        description: body.description || null,
        date: new Date(body.date),
        venue: body.venue || null,
        time: body.time || null,
        organizer: body.organizer || null,
        bannerUrl: body.bannerUrl || null,
        isFeeRequired: body.isFeeRequired,
        feeAmount: body.feeAmount || null,
        deadline: body.deadline ? new Date(body.deadline) : null,
        maxAttendees: body.maxAttendees || null,
        status: body.status || "DRAFT",
        createdById: session.user.id,
      }
    })

    // Log this action
    await prisma.auditLog.create({
      data: {
        adminId: session.user.id,
        action: "CREATE",
        entity: "EVENT",
        entityId: event.id,
        details: `Created event: ${event.name}`
      }
    })

    return NextResponse.json({ success: true, data: event }, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
