import { NextResponse, NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { noticeCreateSchema } from "@/lib/validations/notice"
import { z } from "zod"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const priority = searchParams.get("priority") || ""
    const search = searchParams.get("search") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where = {
      AND: [
        priority ? { priority: priority as any } : {},
        search ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } }
          ]
        } : {}
      ]
    }

    const [notices, total] = await Promise.all([
      prisma.notice.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.notice.count({ where })
    ])

    const res = NextResponse.json({
      success: true,
      data: notices,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
    res.headers.set("Cache-Control", "private, max-age=30, stale-while-revalidate=60")
    return res
  } catch (error) {
    console.error("Error fetching notices:", error)
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
    
    // Parse Zod
    const validation = noticeCreateSchema.safeParse(json)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const body = validation.data

    const notice = await prisma.notice.create({
      data: {
        title: body.title,
        description: body.description,
        priority: body.priority || "MEDIUM",
        attachmentUrl: body.attachmentUrl || null,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
        isVisible: body.isVisible ?? true,
        createdById: session.user.id,
      }
    })

    // Log this action
    await prisma.auditLog.create({
      data: {
        adminId: session.user.id,
        action: "CREATE",
        entity: "NOTICE",
        entityId: notice.id,
        details: `Published notice: ${notice.title}`
      }
    })

    return NextResponse.json({ success: true, data: notice }, { status: 201 })
  } catch (error) {
    console.error("Error creating notice:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
