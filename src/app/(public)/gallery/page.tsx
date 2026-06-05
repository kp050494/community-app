import { prisma } from "@/lib/prisma"
import { FloatingOrbs } from "@/components/shared/floating-orbs"
import { SectionHeader } from "@/components/shared/section-header"
import { GalleryGrid } from "./gallery-grid"

export const revalidate = 120

export default async function PublicGalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      id: true, imageUrl: true, caption: true, eventId: true, createdAt: true,
      event: { select: { id: true, name: true } },
    },
  })

  const events = Array.from(
    new Map(
      images.filter(img => img.event).map(img => [img.event!.id, img.event!.name])
    ).entries()
  ).map(([id, name]) => ({ id, name }))

  return (
    <div className="relative min-h-screen bg-background overflow-hidden py-16 px-4 md:px-8">
      <FloatingOrbs variant="mixed" className="opacity-15" />
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <SectionHeader
          overline="Captured Moments"
          title="Community Gallery"
          gujaratiSubtitle="યાદગાર પળો અને તસવીરો"
          description="Explore the rich, colorful, and joyful highlights of our community celebrations, social service camps, and gatherings."
          centered
        />
        <GalleryGrid initialImages={images} eventsList={events} />
      </div>
    </div>
  )
}
