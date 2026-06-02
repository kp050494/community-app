const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
  await p.$executeRawUnsafe('ALTER TABLE members ADD COLUMN IF NOT EXISTS "middleName" TEXT')
  console.log('middleName column added successfully')
  await p.$disconnect()
}

main().catch(e => { console.error(e.message); p.$disconnect() })
