import { prisma } from "@/lib/prisma"
import { FloatingOrbs } from "@/components/shared/floating-orbs"
import { SectionHeader } from "@/components/shared/section-header"
import { GalleryGrid } from "./gallery-grid"

export const revalidate = 60 // Revalidate every 60 seconds

export default async function PublicGalleryPage() {
  // Fetch gallery images and events
  const images = await prisma.galleryImage.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      event: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  // Get unique events list for filters
  const events = Array.from(
    new Map(
      images
        .filter(img => img.event)
        .map(img => [img.event!.id, img.event!.name])
    ).entries()
  ).map(([id, name]) => ({ id, name }))

  return (
    <div className="relative min-h-screen bg-background overflow-hidden py-16 px-4 md:px-8">
      <FloatingOrbs variant="mixed" className="opacity-15" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <SectionHeader
          overline="Captured Moments"
          title="Community Gallery"
          gujaratiSubtitle="યાદગાર પળો અને તસવીરો"
          description="Explore the rich, colorful, and joyful highlights of our community celebrations, social service camps, and gatherings."
          centered
        />

        {/* Client Gallery Grid with Lightbox */}
        <GalleryGrid initialImages={images} eventsList={events} />

      </div>
    </div>
  )
}
