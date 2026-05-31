import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Start seeding rich community demo data...")

  // 1. Create default Super Admin
  const email = "super@skppmm.org"
  const defaultPassword = "admin"
  const hashedPassword = await bcrypt.hash(defaultPassword, 12)

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      password: hashedPassword,
    },
    create: {
      email,
      name: "Super Admin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  })

  console.log(`- Created default admin: ${admin.email}`)

  // 2. Clear old data (Except Admin)
  await prisma.auditLog.deleteMany({})
  await prisma.contactMessage.deleteMany({})
  await prisma.galleryImage.deleteMany({})
  await prisma.eventPayment.deleteMany({})
  await prisma.annualFee.deleteMany({})
  await prisma.membershipPlan.deleteMany({})
  await prisma.notice.deleteMany({})
  await prisma.event.deleteMany({})
  await prisma.member.deleteMany({})
  await prisma.family.deleteMany({})

  console.log("- Cleared previous transactional collections")

  // 3. Create Families
  const familyPatel = await prisma.family.create({
    data: {
      familyId: "SKPF-0001",
      businessName: "Patel Textiles",
      familyName: "Patel Family",
      kutchVatan: "Nakhatrana",
      currentCity: "Surat",
      businessAddress: "B-402, Shrinathji Residencies, VIP Road, Surat",
      notes: "Active members of the community",
    }
  })

  const familyKothari = await prisma.family.create({
    data: {
      familyId: "SKPF-0002",
      businessName: "Kothari Diamonds",
      familyName: "Kothari Family",
      kutchVatan: "Madhapar",
      currentCity: "Surat",
      businessAddress: "Flat 101, Gokuldham Towers, Pandesara GIDC, Surat",
    }
  })

  const familySavla = await prisma.family.create({
    data: {
      familyId: "SKPF-0003",
      businessName: "Savla Logistics",
      familyName: "Savla Family",
      kutchVatan: "Bhuj",
      currentCity: "Surat",
      businessAddress: "Rowhouse A-12, Kutch Nagar, Udhna, Surat",
    }
  })

  console.log("- Seeded 3 community families")

  // 4. Create Members
  const member1 = await prisma.member.create({
    data: {
      memberId: "SKPM-0001",
      familyId: familyPatel.id,
      firstName: "Ramesh",
      surname: "Patel",
      fullName: "Ramesh Patel",
      gender: "MALE",
      dob: new Date("1975-04-12"),
      phone: "9876543210",
      email: "ramesh.patel@gmail.com",
      occupationRole: "Managing Director",
      education: "B.Com",
      bloodGroup: "O+",
      isActive: true,
    }
  })

  const member2 = await prisma.member.create({
    data: {
      memberId: "SKPM-0002",
      familyId: familyPatel.id,
      firstName: "Sharda",
      surname: "Patel",
      fullName: "Sharda Patel",
      gender: "FEMALE",
      dob: new Date("1978-08-22"),
      phone: "9825012345",
      email: "sharda.patel@gmail.com",
      bloodGroup: "A+",
      isActive: true,
    }
  })

  const member3 = await prisma.member.create({
    data: {
      memberId: "SKPM-0003",
      familyId: familyKothari.id,
      firstName: "Hasmukh",
      surname: "Kothari",
      fullName: "Hasmukh Kothari",
      gender: "MALE",
      dob: new Date("1968-01-30"),
      phone: "9428198765",
      email: "hasmukh@kothari.org",
      occupationRole: "Partner",
      education: "HSC",
      bloodGroup: "B+",
      isActive: true,
    }
  })

  const member4 = await prisma.member.create({
    data: {
      memberId: "SKPM-0004",
      familyId: familySavla.id,
      firstName: "Ketan",
      surname: "Savla",
      fullName: "Ketan Savla",
      gender: "MALE",
      dob: new Date("1995-11-05"),
      phone: "9909988776",
      email: "ketan.savla@savla.com",
      occupationRole: "Operations Head",
      education: "B.Tech IT",
      bloodGroup: "AB+",
      isActive: true,
    }
  })

  console.log("- Seeded 4 individual members with family links")

  // 5. Create Membership Plan & Annual Fee Receipts
  const plan2025 = await prisma.membershipPlan.create({
    data: {
      year: 2025,
      amount: 500,
      description: "Yearly mandal maintenance and administrative charges.",
      isActive: true,
    }
  })

  await prisma.annualFee.createMany({
    data: [
      {
        memberId: member1.id,
        planId: plan2025.id,
        year: 2025,
        dueAmount: 500,
        paidAmount: 500,
        pendingAmount: 0,
        status: "PAID",
        paidDate: new Date("2025-01-10"),
        paymentMode: "UPI",
        receiptNumber: "RCP-2025-0001",
        notes: "Paid in full via GPay",
      },
      {
        memberId: member2.id,
        planId: plan2025.id,
        year: 2025,
        dueAmount: 500,
        paidAmount: 500,
        pendingAmount: 0,
        status: "PAID",
        paidDate: new Date("2025-01-12"),
        paymentMode: "CASH",
        receiptNumber: "RCP-2025-0002",
        notes: "Handed over cash at meeting",
      },
      {
        memberId: member3.id,
        planId: plan2025.id,
        year: 2025,
        dueAmount: 500,
        paidAmount: 0,
        pendingAmount: 500,
        status: "OVERDUE",
        notes: "Overdue since Jan 31st",
      }
    ]
  })

  console.log("- Seeded 2025 membership pricing and paid receipts")

  // 6. Create Events
  const event1 = await prisma.event.create({
    data: {
      name: "Navratri Dandiya Mahotsav 2026",
      description: "Celebrate the vibrant nights of Navratri with traditional Kutch Garba, Dandiya tunes, special prizes, and food stalls.",
      date: new Date("2026-10-15T19:00:00Z"),
      venue: "SKPPMM Community Hall, VIP Road, Surat",
      time: "7:00 PM - 11:30 PM",
      organizer: "Executive Cultural Committee",
      bannerUrl: "https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?auto=format&fit=crop&q=80&w=800&h=450",
      isFeeRequired: true,
      feeAmount: 300,
      deadline: new Date("2026-10-10"),
      maxAttendees: 500,
      status: "UPCOMING",
      createdById: admin.id,
    }
  })

  const event2 = await prisma.event.create({
    data: {
      name: "Annual Business Summit & Expo",
      description: "A premier networking seminar connecting local textile and diamond entrepreneurs to share innovative industry trends.",
      date: new Date("2026-06-20T09:00:00Z"),
      venue: "Pandesara GIDC Exhibition Center",
      time: "9:00 AM - 5:00 PM",
      organizer: "SKPPMM Business Cell",
      bannerUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800&h=450",
      isFeeRequired: false,
      status: "UPCOMING",
      createdById: admin.id,
    }
  })

  const event3 = await prisma.event.create({
    data: {
      name: "Youth Sports League 2025",
      description: "Cricket and volleyball tournaments organized to foster sporting talents and healthy camaraderie among our youths.",
      date: new Date("2025-12-25T08:00:00Z"),
      venue: "Pandesara Sports Arena, GIDC",
      time: "8:00 AM onwards",
      organizer: "Sports Youth Wings",
      bannerUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800&h=450",
      isFeeRequired: true,
      feeAmount: 200,
      status: "COMPLETED",
      createdById: admin.id,
    }
  })

  console.log("- Seeded 3 distinct events (Upcoming, Completed)")

  // 7. Event Payments Dues
  await prisma.eventPayment.createMany({
    data: [
      {
        eventId: event1.id,
        memberId: member1.id,
        amountDue: 300,
        amountPaid: 300,
        pendingAmount: 0,
        transactionRef: "TXN9876543",
        paymentDate: new Date("2026-05-15"),
        paymentMode: "UPI",
        status: "PAID",
      },
      {
        eventId: event1.id,
        memberId: member3.id,
        amountDue: 300,
        amountPaid: 0,
        pendingAmount: 300,
        status: "PENDING",
      }
    ]
  })

  console.log("- Seeded event registration attendee dues")

  // 8. Notices announcements
  await prisma.notice.createMany({
    data: [
      {
        title: "Dandiya Registration Open!",
        description: "The registration counter for Navratri Dandiya Mahotsav is now open at the office counter on Sundays! Bring your Member ID cards.",
        priority: "URGENT",
        expiryDate: new Date("2026-10-14"),
        isVisible: true,
        createdById: admin.id,
      },
      {
        title: "Census Campaign 2026",
        description: "All families residing in Pandesara are requested to update their address, new births, and contact numbers in the directory database.",
        priority: "HIGH",
        isVisible: true,
        createdById: admin.id,
      },
      {
        title: "Medical Checkup Camp Scheduled",
        description: "Free medical, diabetic, and ophthalmic diagnosis camp is scheduled at the community hall next Sunday in collaboration with civil hospitals.",
        priority: "MEDIUM",
        expiryDate: new Date("2026-06-10"),
        isVisible: true,
        createdById: admin.id,
      }
    ]
  })

  console.log("- Seeded 3 public notices announcements")

  // 9. Gallery images
  await prisma.galleryImage.createMany({
    data: [
      {
        imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=400&h=400",
        caption: "Navratri Celebration 2025 Group Garba",
        eventId: event3.id,
        sortOrder: 1,
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400&h=400",
        caption: "Annual Executive General Body Assembly Meeting",
        sortOrder: 2,
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=400&h=400",
        caption: "Youth Sports Cricket League Group Picture",
        eventId: event3.id,
        sortOrder: 3,
      }
    ]
  })

  console.log("- Seeded 3 community photo galleries")

  // 10. Contact messages
  await prisma.contactMessage.createMany({
    data: [
      {
        name: "Laljibhai Patel",
        phone: "9898012345",
        email: "lalji@patel.com",
        message: "Hello, we are a new family that migrated to Pandesara GIDC last month. We would like to register our family members in the mandal ledger directory. Please guide us.",
        isRead: false,
      },
      {
        name: "Meera Patel",
        phone: "9725054321",
        message: "Can you please publish the scholarship application deadlines on the notice board? My daughter scored 95% in Class 12.",
        isRead: true,
      }
    ]
  })

  console.log("- Seeded 2 contact support inquiries")

  console.log("Database seeding completed successfully!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
