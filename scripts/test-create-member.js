const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
  // Get first family
  const family = await p.family.findFirst()
  if (!family) { console.log('No family found'); await p.$disconnect(); return }

  // Get current max member ID
  const allIds = await p.member.findMany({ select: { memberId: true } })
  const maxNum = allIds.reduce((max, m) => {
    const match = m.memberId.match(/^SKPM-(\d+)$/)
    return match ? Math.max(max, parseInt(match[1], 10)) : max
  }, 0)
  const memberId = `SKPM-${String(maxNum + 99).padStart(4, '0')}`

  console.log('Creating member with familyId:', family.id, 'memberId:', memberId)

  const member = await p.member.create({
    data: {
      memberId,
      firstName: 'Test',
      middleName: 'Middle',
      surname: 'Patel',
      fullName: 'Test Middle Patel',
      gender: 'MALE',
      familyId: family.id,
      isActive: true,
      joinedDate: new Date(),
    }
  })
  console.log('SUCCESS:', member.id, member.memberId, member.middleName)

  // Clean up
  await p.member.delete({ where: { id: member.id } })
  console.log('Cleaned up test member')
  await p.$disconnect()
}

main().catch(e => { console.error('FAILED:', e.message); p.$disconnect() })
