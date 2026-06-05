// Creates (or resets) a single admin login WITHOUT touching any other data.
// Usage (run locally, pointed at your production DB):
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-strong-password' npm run create-admin
// Defaults are used if the env vars are not set (change the password immediately after first login).

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const email = process.env.ADMIN_EMAIL || "admin@skppmm.org"
const password = process.env.ADMIN_PASSWORD || "changeme123"
const name = process.env.ADMIN_NAME || "Super Admin"

async function main() {
  const passwordHash = await bcrypt.hash(password, 12)
  const admin = await prisma.admin.upsert({
    where: { email },
    update: { password: passwordHash, isActive: true },
    create: { email, name, password: passwordHash, role: "SUPER_ADMIN" },
  })
  console.log(`✅ Admin ready: ${admin.email}`)
  if (password === "changeme123") {
    console.log("⚠️  You used the default password. Log in and change it right away.")
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("Failed to create admin:", e)
    await prisma.$disconnect()
    process.exit(1)
  })
