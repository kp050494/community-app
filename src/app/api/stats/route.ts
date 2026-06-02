import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const revalidate = 300 // cache for 5 minutes

export async function GET() {
  try {
    const now = new Date()
    const currentYear = now.getFullYear()

    const [memberCount, familyCount, upcomingEventsCount, feeCollected] = await Promise.all([
      prisma.member.count({ where: { isActive: true } }),
      prisma.family.count(),
      prisma.event.count({
        where: {
          status: { in: ["UPCOMING", "ONGOING"] },
          date: { gte: now },
        },
      }),
      prisma.annualFee.aggregate({
        _sum: { paidAmount: true },
        where: { year: currentYear, status: "PAID" },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        memberCount,
        familyCount,
        upcomingEventsCount,
        yearsOfService: currentYear - 1998,
        feeCollectedThisYear: feeCollected._sum.paidAmount ?? 0,
      },
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
