import { NextResponse, NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const participants = await prisma.eventPayment.findMany({
      where: { eventId: id },
      include: {
        member: {
          select: {
            id: true,
            memberId: true,
            fullName: true,
            firstName: true,
            surname: true,
            phone: true,
            gender: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    })
    return NextResponse.json({ success: true, data: participants })
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id: eventId } = await params
    const { memberId, amountDue = 0 } = await req.json()
    if (!memberId) return NextResponse.json({ error: "memberId is required" }, { status: 400 })

    // Check event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 })

    // Check member exists
    const member = await prisma.member.findUnique({ where: { id: memberId } })
    if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 })

    const due = event.isFeeRequired ? (amountDue || event.feeAmount || 0) : 0

    const participant = await prisma.eventPayment.create({
      data: {
        eventId,
        memberId,
        amountDue: due,
        amountPaid: 0,
        pendingAmount: due,
        status: "PENDING",
      },
      include: {
        member: {
          select: { id: true, memberId: true, fullName: true, firstName: true, surname: true, phone: true, gender: true },
        },
      },
    })
    return NextResponse.json({ success: true, data: participant }, { status: 201 })
  } catch (e: any) {
    if (e?.code === "P2002") return NextResponse.json({ error: "Member is already a participant" }, { status: 409 })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id: eventId } = await params
    const { searchParams } = new URL(req.url)
    const participantId = searchParams.get("participantId")
    if (!participantId) return NextResponse.json({ error: "participantId is required" }, { status: 400 })

    await prisma.eventPayment.delete({ where: { id: participantId, eventId } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
