import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { contactFormSchema } from "@/lib/validations/payment"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validation = contactFormSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.format() },
        { status: 400 }
      )
    }

    const { name, phone, email, message } = validation.data

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        phone,
        email,
        message,
      },
    })

    return NextResponse.json(
      { success: true, message: "Your message has been received successfully!", data: contactMessage },
      { status: 201 }
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  }
}
