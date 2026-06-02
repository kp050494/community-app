import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const revalidate = 0

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()
    const currentYear = now.getFullYear()

    const [
      totalMembers,
      totalFamilies,
      upcomingEventsCount,
      nextEvent,
      feeCollected,
    ] = await Promise.all([
      prisma.member.count(),
      prisma.family.count(),
      prisma.event.count({
        where: { status: { in: ["UPCOMING", "ONGOING"] }, date: { gte: now } },
      }),
      prisma.event.findFirst({
        where: { status: { in: ["UPCOMING", "ONGOING"] }, date: { gte: now } },
        orderBy: { date: "asc" },
        select: { name: true },
      }),
      prisma.annualFee.aggregate({
        _sum: { paidAmount: true },
        where: { year: currentYear },
      }),
    ])

    const feeAmount = feeCollected._sum.paidAmount ?? 0
    const feeFormatted =
      feeAmount >= 100000
        ? `₹${(feeAmount / 100000).toFixed(1)}L`
        : feeAmount >= 1000
        ? `₹${(feeAmount / 1000).toFixed(1)}K`
        : `₹${feeAmount}`

    return NextResponse.json({
      success: true,
      data: {
        totalMembers,
        totalFamilies,
        upcomingEventsCount,
        nextEventName: nextEvent?.name ?? null,
        feeFormatted,
        currentYear,
      },
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
