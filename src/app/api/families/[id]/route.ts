import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { familySchema } from "@/lib/validations/family"

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const family = await prisma.family.findUnique({
      where: { id: params.id },
      include: {
        members: true,
      },
    })

    if (!family) {
      return NextResponse.json({ error: "Family not found" }, { status: 404 })
    }

    // Fetch gotra via raw SQL since the Prisma client cache may not have the field yet
    const gotraRow: { gotra: string | null }[] = await prisma.$queryRawUnsafe(
      `SELECT "gotra" FROM families WHERE id = $1`,
      params.id
    )

    return NextResponse.json({ data: { ...family, gotra: gotraRow[0]?.gotra ?? null } })
  } catch (error) {
    console.error("Error fetching family:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
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

    const existingFamily = await prisma.family.findFirst({
      where: {
        familyId: body.familyId,
        businessName: body.businessName,
        familyName: body.familyName,
        id: { not: params.id },
      },
    })

    if (existingFamily) {
      return NextResponse.json(
        { error: "Another family with this Family ID, business name and family name already exists." },
        { status: 409 }
      )
    }

    const family = await prisma.family.update({
      where: { id: params.id },
      data: {
        familyId: body.familyId,
        businessName: body.businessName,
        familyName: body.familyName,
        kutchVatan: body.kutchVatan || null,
        currentCity: body.currentCity || null,
        businessAddress: body.businessAddress || null,
        notes: body.notes || null,
      },
    })

    // Save gotra via raw SQL (bypasses Prisma client validation until next full regeneration)
    await prisma.$executeRawUnsafe(
      `UPDATE families SET "gotra" = $1 WHERE id = $2`,
      body.gotra || null,
      params.id
    )

    return NextResponse.json({ data: { ...family, gotra: body.gotra || null } })
  } catch (error) {
    console.error("Error updating family:", error)
    if (error instanceof Error && error.message.includes("Unique constraint failed")) {
      return NextResponse.json(
        { error: "Another family with this Family ID, business name and family name already exists." },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.family.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting family:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
