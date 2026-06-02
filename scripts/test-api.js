const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
  const family = await p.family.findFirst()
  console.log('Using familyId:', family.id)

  // Simulate exactly what the API does
  const { z } = require('zod')

  const memberSchema = z.object({
    familyId: z.string().min(1),
    firstName: z.string().min(2),
    middleName: z.string().min(2),
    surname: z.string().min(2),
    dob: z.string().refine((val) => !isNaN(Date.parse(val))),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    bloodGroup: z.string().optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
    phone: z.string().min(10).max(15).optional().or(z.literal("")),
    email: z.string().email().optional().or(z.literal("")),
    education: z.string().optional().or(z.literal("")),
    occupationRole: z.string().optional().or(z.literal("")),
    isActive: z.boolean().default(true),
  })

  const testData = {
    familyId: family.id,
    firstName: 'Ramesh',
    middleName: 'Suresh',
    surname: 'Patel',
    dob: '1990-01-01',
    gender: 'MALE',
    bloodGroup: '',
    phone: '',
    email: '',
    education: '',
    occupationRole: '',
    address: '',
    isActive: true,
  }

  const validation = memberSchema.safeParse(testData)
  if (!validation.success) {
    console.error('VALIDATION FAILED:', JSON.stringify(validation.error.format(), null, 2))
    await p.$disconnect()
    return
  }

  console.log('Validation passed. middleName:', validation.data.middleName)

  const allIds = await p.member.findMany({ select: { memberId: true } })
  const maxNum = allIds.reduce((max, m) => {
    const match = m.memberId.match(/^SKPM-(\d+)$/)
    return match ? Math.max(max, parseInt(match[1], 10)) : max
  }, 0)
  const memberId = `SKPM-${String(maxNum + 99).padStart(4, '0')}`

  const member = await p.member.create({
    data: {
      memberId,
      firstName: validation.data.firstName,
      middleName: validation.data.middleName,
      surname: validation.data.surname,
      fullName: `${validation.data.firstName} ${validation.data.middleName} ${validation.data.surname}`,
      joinedDate: new Date(),
      gender: validation.data.gender,
      dob: new Date(validation.data.dob),
      phone: null, email: null, occupationRole: null,
      education: null, bloodGroup: null, address: null,
      isActive: true,
      familyId: validation.data.familyId,
    },
    include: { family: true }
  })

  console.log('SUCCESS - created member:', member.memberId, 'middleName:', member.middleName)
  await p.member.delete({ where: { id: member.id } })
  console.log('Cleaned up')
  await p.$disconnect()
}

main().catch(e => { console.error('SCRIPT ERROR:', e.message); p.$disconnect() })
