/**
 * Gallery-only reseed — safe to run anytime.
 * Clears existing gallery images and replaces with community-appropriate photos.
 * Run with: npx tsx prisma/seed-gallery.ts
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const galleryImages = [
  // ── Real Indian Community Gatherings (verified photos) ──────────────────
  {
    imageUrl: "https://images.pexels.com/photos/37364473/pexels-photo-37364473.jpeg?auto=compress&cs=tinysrgb&w=800",
    caption: "Annual Community Sabha – Hundreds of members gathered in traditional attire",
  },
  {
    imageUrl: "https://images.pexels.com/photos/16100484/pexels-photo-16100484.jpeg?auto=compress&cs=tinysrgb&w=800",
    caption: "Mandal Utsav – Joyful gathering under colourful festival canopies",
  },
  {
    imageUrl: "https://images.pexels.com/photos/17440423/pexels-photo-17440423.jpeg?auto=compress&cs=tinysrgb&w=800",
    caption: "Outdoor Community Yatra – Families assembling for the annual procession",
  },
  {
    imageUrl: "https://images.pexels.com/photos/15675903/pexels-photo-15675903.jpeg?auto=compress&cs=tinysrgb&w=800",
    caption: "Women's Cultural Programme – Ladies celebrating in vibrant traditional sarees",
  },
  {
    imageUrl: "https://images.pexels.com/photos/20769880/pexels-photo-20769880.jpeg?auto=compress&cs=tinysrgb&w=800",
    caption: "Holi Milan Celebration – Community colours, joy and togetherness",
  },
  {
    imageUrl: "https://images.pexels.com/photos/9429209/pexels-photo-9429209.jpeg?auto=compress&cs=tinysrgb&w=800",
    caption: "Annual Pilgrimage Procession – Community members on the yatra path",
  },

  // ── Events (Unsplash – verified) ─────────────────────────────────────────
  {
    imageUrl: "https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?auto=format&fit=crop&q=80&w=800",
    caption: "Navratri Dandiya Mahotsav – Colourful evening celebrations",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?auto=format&fit=crop&q=80&w=800",
    caption: "Festival of Lights – Mandal Diwali Milan Celebration",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
    caption: "Annual General Meeting – Executive committee in session",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800",
    caption: "Youth Cricket League – Sports tournament finals",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
    caption: "Business Summit – Community entrepreneurs networking expo",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800",
    caption: "Medical Camp – Free health checkup for community members",
  },
]

async function main() {
  console.log("Reseeding gallery images...")

  // Remove gallery images with broken local paths
  await prisma.galleryImage.deleteMany({
    where: { imageUrl: { startsWith: "/" } },
  })
  console.log("- Removed broken local-path gallery images")

  // Clear existing placeholder images to avoid duplicates
  await prisma.galleryImage.deleteMany({
    where: {
      OR: [
        { imageUrl: { startsWith: "https://images.unsplash.com" } },
        { imageUrl: { startsWith: "https://images.pexels.com" } },
      ],
    },
  })
  console.log("- Cleared old placeholder gallery images")

  // Insert fresh gallery images
  await prisma.galleryImage.createMany({
    data: galleryImages.map((img, i) => ({
      ...img,
      sortOrder: i + 1,
    })),
  })

  console.log(`✓ Seeded ${galleryImages.length} community gallery images`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log("Done.")
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
