import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { memberSchema } from "@/lib/validations/member"
import { calculateAge, formatMemberFullName } from "@/lib/utils"

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const member = await prisma.member.findUnique({
      where: { id: params.id },
      include: { family: true },
    })

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    const fullName = formatMemberFullName(member.firstName, member.surname, member.fullName)

    // Fetch fields not yet in the Prisma client cache via raw SQL
    const extraRow: { middleName: string | null; yskId: string | null; yuvaSanghFamilyId: string | null; maritalStatus: string | null }[] =
      await prisma.$queryRawUnsafe(
        `SELECT "middleName", "yskId", "yuvaSanghFamilyId", "maritalStatus" FROM members WHERE id = $1`,
        params.id
      )

    return NextResponse.json({
      data: {
        ...member,
        firstName: member.firstName ?? "",
        surname: member.surname ?? "",
        fullName,
        age: member.dob ? calculateAge(member.dob) : null,
        middleName: extraRow[0]?.middleName ?? null,
        yskId: extraRow[0]?.yskId ?? null,
        yuvaSanghFamilyId: extraRow[0]?.yuvaSanghFamilyId ?? null,
        maritalStatus: extraRow[0]?.maritalStatus ?? null,
      },
    })
  } catch (error) {
    console.error("Error fetching member:", error)
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
    const validation = memberSchema.safeParse(json)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const body = validation.data

    const family = await prisma.family.findUnique({ where: { id: body.familyId } })
    if (!family) {
      return NextResponse.json({ error: "Family not found" }, { status: 404 })
    }

    const member = await prisma.member.update({
      where: { id: params.id },
      data: {
        firstName: body.firstName,
        surname: body.surname,
        fullName: `${body.firstName} ${body.middleName} ${body.surname}`,
        gender: body.gender,
        dob: body.dob ? new Date(body.dob) : null,
        phone: body.phone || null,
        email: body.email || null,
        occupationRole: body.occupationRole || null,
        education: body.education || null,
        bloodGroup: body.bloodGroup || null,
        address: body.address || null,
        isActive: body.isActive ?? true,
        familyId: body.familyId,
      },
      include: { family: true },
    })

    // Save fields not yet in the Prisma client cache via raw SQL (bypasses client validation until next full regeneration)
    await prisma.$executeRawUnsafe(
      `UPDATE members SET "middleName" = $1, "yskId" = $2, "yuvaSanghFamilyId" = $3, "maritalStatus" = $4 WHERE id = $5`,
      body.middleName || null,
      body.yskId || null,
      body.yuvaSanghFamilyId || null,
      body.maritalStatus || null,
      params.id
    )

    return NextResponse.json({
      data: {
        ...member,
        middleName: body.middleName || null,
        yskId: body.yskId || null,
        yuvaSanghFamilyId: body.yuvaSanghFamilyId || null,
        maritalStatus: body.maritalStatus || null,
      },
    })
  } catch (error) {
    console.error("Error updating member:", error)
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

    await prisma.member.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting member:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
