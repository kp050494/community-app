import { NextResponse, NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isEligibleForFeeCollection, calculateAge } from "@/lib/utils"

/**
 * GET /api/members/eligible-for-fees
 * Returns all members eligible for fee collection based on the criteria:
 * - Male members
 * - Age between 18 and 45 years (inclusive)
 * 
 * Sorted by gender and age (oldest first)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : undefined

    const skip = (page - 1) * limit

    // Get all members first (will filter in memory for eligibility)
    const where = search ? {
      OR: [
        { firstName: { contains: search, mode: "insensitive" as const } },
        { surname: { contains: search, mode: "insensitive" as const } },
        { memberId: { contains: search, mode: "insensitive" as const } },
        { phone: { contains: search, mode: "insensitive" as const } }
      ]
    } : {}

    const allMembers = await prisma.member.findMany({
      where,
      orderBy: [
        { gender: "asc" },      // Sort by gender (FEMALE, MALE, OTHER alphabetically)
        { dob: "desc" }         // Then by age (oldest first)
      ],
      include: {
        family: true,
        annualFees: year ? {
          where: { year }
        } : false
      }
    })

    // Filter only eligible members
    const eligibleMembers = allMembers.filter(m =>
      isEligibleForFeeCollection(m.gender, m.dob)
    )

    // Paginate the eligible members
    const paginatedMembers = eligibleMembers.slice(skip, skip + limit)

    // Map to include additional info
    const mappedMembers = paginatedMembers.map(m => {
      const age = m.dob ? calculateAge(m.dob) : null

      return {
        id: m.id,
        memberId: m.memberId,
        firstName: m.firstName,
        surname: m.surname,
        fullName: `${m.firstName} ${m.surname}`,
        gender: m.gender,
        age,
        dob: m.dob,
        phone: m.phone,
        family: m.family,
        telephoneNumber: m.phone,
        isActive: m.isActive,
        createdAt: m.createdAt,
        ...(year && {
          annualFeeStatus: (m.annualFees && m.annualFees[0]?.status) || "PENDING",
          annualFeeId: m.annualFees && m.annualFees[0]?.id,
          feeYear: year
        })
      }
    })

    return NextResponse.json({
      data: mappedMembers,
      total: eligibleMembers.length,
      page,
      limit,
      totalPages: Math.ceil(eligibleMembers.length / limit),
      eligibilityInfo: "Male members aged 18-45 years"
    })
  } catch (error) {
    console.error("Error fetching eligible members:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
