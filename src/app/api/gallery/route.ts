import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const gallerySchema = z.object({
  imageUrl: z.string().url("Must be a valid URL"),
  caption: z.string().max(200).optional().or(z.literal("")),
  eventId: z.string().cuid().optional().nullable(),
})

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
      include: { event: { select: { name: true } } },
    })
    return NextResponse.json({ data: images })
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const json = await req.json()
    const validation = gallerySchema.safeParse(json)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }
    const { imageUrl, caption, eventId } = validation.data

    const image = await prisma.galleryImage.create({
      data: { imageUrl, caption: caption || null, eventId: eventId || null },
      include: { event: { select: { name: true } } },
    })
    return NextResponse.json({ data: image }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
