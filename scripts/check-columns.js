const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
  // Check actual column names in the members table
  const cols = await p.$queryRawUnsafe(
    `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'members' ORDER BY ordinal_position`
  )
  console.log('Members table columns:')
  cols.forEach(c => console.log(' ', c.column_name, '-', c.data_type))
  await p.$disconnect()
}

main().catch(e => { console.error(e.message); p.$disconnect() })
