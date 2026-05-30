import { NextResponse, NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { annualFeePaymentSchema } from "@/lib/validations/payment"
import { isEligibleForFeeCollection, calculateAge } from "@/lib/utils"
import { z } from "zod"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : undefined
    const status = searchParams.get("status") || ""
    const onlyEligible = searchParams.get("onlyEligible") === "true"

    const where = {
      AND: [
        year ? { year } : {},
        status ? { status: status as any } : {}
      ]
    }

    const annualFees = await prisma.annualFee.findMany({
      where,
      include: {
        member: {
          select: {
            id: true,
            fullName: true,
            memberId: true,
            gender: true,
            dob: true,
            family: {
              select: {
                city: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    // Filter by eligibility if requested
    let filteredFees = annualFees
    if (onlyEligible) {
      filteredFees = annualFees.filter(fee => 
        isEligibleForFeeCollection(fee.member.gender, fee.member.dob)
      )
    }

    // Map to include age information
    const mappedFees = filteredFees.map(fee => ({
      ...fee,
      member: {
        ...fee.member,
        age: fee.member.dob ? calculateAge(fee.member.dob) : null,
        isEligibleForFeeCollection: isEligibleForFeeCollection(fee.member.gender, fee.member.dob)
      }
    }))

    return NextResponse.json({ success: true, data: mappedFees })
  } catch (error) {
    console.error("Error fetching annual fees:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const json = await req.json()

    // Validate request
    const validation = annualFeePaymentSchema.safeParse(json)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const body = validation.data

    console.log("=== SAVING ANNUAL FEE PAYMENT API ===");
    console.log("Incoming request body:", JSON.stringify(body, null, 2));

    // Check if member exists and is eligible for fee collection
    const member = await prisma.member.findUnique({
      where: { id: body.memberId },
      select: { gender: true, dob: true }
    })

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    // Validate member eligibility for fee collection
    if (!isEligibleForFeeCollection(member.gender, member.dob)) {
      const age = member.dob ? calculateAge(member.dob) : null
      return NextResponse.json(
        { 
          error: `Member is not eligible for fee collection. Fees are only collected from male members aged 18-45 years.`,
          details: { gender: member.gender, age, eligibilityInfo: "Male members aged 18-45 only" }
        }, 
        { status: 400 }
      )
    }

    // Check if the record already exists for that member and year
    const existingFee = await prisma.annualFee.findUnique({
      where: {
        memberId_year: {
          memberId: body.memberId,
          year: body.year
        }
      }
    })

    let feeRecord

    if (existingFee) {
      // Update existing record
      const paidAmount = body.paidAmount
      const pendingAmount = Math.max(0, existingFee.dueAmount - paidAmount)
      const status = pendingAmount === 0 ? "PAID" : paidAmount > 0 ? "PARTIAL" : "PENDING"

      feeRecord = await prisma.annualFee.update({
        where: { id: existingFee.id },
        data: {
          paidAmount,
          pendingAmount,
          status,
          paidDate: body.paidDate ? new Date(body.paidDate) : new Date(),
          paymentMode: body.paymentMode || null,
          receiptNumber: body.receiptNumber || existingFee.receiptNumber || `RCP-${body.year}-${Math.floor(1000 + Math.random() * 9000)}`,
          notes: body.notes || null,
        }
      })
    } else {
      // Create new record
      const paidAmount = body.paidAmount
      const dueAmount = body.dueAmount
      const pendingAmount = Math.max(0, dueAmount - paidAmount)
      const status = pendingAmount === 0 ? "PAID" : paidAmount > 0 ? "PARTIAL" : "PENDING"

      feeRecord = await prisma.annualFee.create({
        data: {
          memberId: body.memberId,
          planId: body.planId,
          year: body.year,
          dueAmount,
          paidAmount,
          pendingAmount,
          status,
          paidDate: body.paidDate ? new Date(body.paidDate) : new Date(),
          paymentMode: body.paymentMode || null,
          receiptNumber: body.receiptNumber || `RCP-${body.year}-${Math.floor(1000 + Math.random() * 9000)}`,
          notes: body.notes || null,
        }
      })
    }

    // Audit Log entry
    await prisma.auditLog.create({
      data: {
        adminId: session.user.id,
        action: "RECORD_PAYMENT",
        entity: "ANNUAL_FEE",
        entityId: feeRecord.id,
        details: `Recorded annual fee payment of ₹${body.paidAmount} for Year ${body.year}`
      }
    })

    return NextResponse.json({ success: true, data: feeRecord })
  } catch (error) {
    console.error("Error saving annual fee payment:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
