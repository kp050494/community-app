import { NextResponse, NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { eventUpdateSchema } from "@/lib/validations/event"
import { z } from "zod"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const event = await prisma.event.findUnique({
      where: { id: resolvedParams.id },
      include: {
        eventPayments: {
          include: {
            member: {
              select: {
                fullName: true,
                memberId: true,
              }
            }
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: event })
  } catch (error) {
    console.error("Error fetching event details:", error)
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
    const validation = eventUpdateSchema.safeParse(json)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const body = validation.data
    const updateData: any = {}

    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.date !== undefined) updateData.date = new Date(body.date)
    if (body.venue !== undefined) updateData.venue = body.venue
    if (body.time !== undefined) updateData.time = body.time
    if (body.organizer !== undefined) updateData.organizer = body.organizer
    if (body.bannerUrl !== undefined) updateData.bannerUrl = body.bannerUrl
    if (body.isFeeRequired !== undefined) updateData.isFeeRequired = body.isFeeRequired
    if (body.feeAmount !== undefined) updateData.feeAmount = body.feeAmount
    if (body.deadline !== undefined) updateData.deadline = body.deadline ? new Date(body.deadline) : null
    if (body.maxAttendees !== undefined) updateData.maxAttendees = body.maxAttendees
    if (body.status !== undefined) updateData.status = body.status

    const event = await prisma.event.update({
      where: { id: resolvedParams.id },
      data: updateData
    })

    // Log this action
    await prisma.auditLog.create({
      data: {
        adminId: session.user.id,
        action: "UPDATE",
        entity: "EVENT",
        entityId: event.id,
        details: `Updated event: ${event.name}`
      }
    })

    return NextResponse.json({ success: true, data: event })
  } catch (error) {
    console.error("Error updating event:", error)
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

    const event = await prisma.event.delete({
      where: { id: resolvedParams.id }
    })

    // Log this action
    await prisma.auditLog.create({
      data: {
        adminId: session.user.id,
        action: "DELETE",
        entity: "EVENT",
        entityId: event.id,
        details: `Deleted event: ${event.name}`
      }
    })

    return NextResponse.json({ success: true, message: "Event deleted successfully" })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
