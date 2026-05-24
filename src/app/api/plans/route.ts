import { NextResponse, NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const yearStr = searchParams.get("year")
    const year = yearStr ? parseInt(yearStr) : new Date().getFullYear()

    // Find active plan for the requested year
    let plan = await prisma.membershipPlan.findFirst({
      where: {
        year,
        isActive: true
      }
    })

    // If no plan exists for the requested year, dynamically create one for that year
    // using the latest active plan's pricing (or ₹500 default) to ensure smooth payments.
    if (!plan) {
      const latestPlan = await prisma.membershipPlan.findFirst({
        where: { isActive: true },
        orderBy: { year: "desc" }
      })

      plan = await prisma.membershipPlan.create({
        data: {
          year,
          amount: latestPlan ? latestPlan.amount : 500,
          description: `Yearly mandal maintenance and administrative charges for ${year}.`,
          isActive: true
        }
      })
    }

    return NextResponse.json({ success: true, data: plan })
  } catch (error) {
    console.error("Error fetching active membership plan:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
