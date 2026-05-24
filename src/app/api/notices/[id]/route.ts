import { NextResponse, NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { noticeUpdateSchema } from "@/lib/validations/notice"
import { z } from "zod"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const notice = await prisma.notice.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!notice) {
      return NextResponse.json({ error: "Notice not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: notice })
  } catch (error) {
    console.error("Error fetching notice details:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await params
    const json = await req.json()
    
    // Validate update
    const validation = noticeUpdateSchema.safeParse(json)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const body = validation.data
    const updateData: any = {}

    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.priority !== undefined) updateData.priority = body.priority
    if (body.attachmentUrl !== undefined) updateData.attachmentUrl = body.attachmentUrl
    if (body.expiryDate !== undefined) updateData.expiryDate = body.expiryDate ? new Date(body.expiryDate) : null
    if (body.isVisible !== undefined) updateData.isVisible = body.isVisible

    const notice = await prisma.notice.update({
      where: { id: resolvedParams.id },
      data: updateData
    })

    // Log this action
    await prisma.auditLog.create({
      data: {
        adminId: session.user.id,
        action: "UPDATE",
        entity: "NOTICE",
        entityId: notice.id,
        details: `Updated notice: ${notice.title}`
      }
    })

    return NextResponse.json({ success: true, data: notice })
  } catch (error) {
    console.error("Error updating notice:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await params

    const notice = await prisma.notice.delete({
      where: { id: resolvedParams.id }
    })

    // Log this action
    await prisma.auditLog.create({
      data: {
        adminId: session.user.id,
        action: "DELETE",
        entity: "NOTICE",
        entityId: notice.id,
        details: `Deleted notice: ${notice.title}`
      }
    })

    return NextResponse.json({ success: true, message: "Notice deleted successfully" })
  } catch (error) {
    console.error("Error deleting notice:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
