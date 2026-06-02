"use client"

import { useEffect, useState } from "react"
import { FloatingOrbs } from "@/components/shared/floating-orbs"
import { SectionHeader } from "@/components/shared/section-header"
import { GalleryGrid } from "./gallery-grid"
import { useLanguage } from "@/lib/language-context"

type ImageItem = {
  id: string
  imageUrl: string
  caption: string | null
  eventId: string | null
  createdAt: string
  event?: { id: string; name: string } | null
}

export default function PublicGalleryPage() {
  const [images, setImages] = useState<ImageItem[]>([])
  const { t } = useLanguage()

  useEffect(() => {
    fetch("/api/gallery")
      .then(r => r.json())
      .then(data => {
        if (data.success) setImages(data.data)
      })
      .catch(() => {})
  }, [])

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

        <SectionHeader
          overline={t.gallery.overline}
          title={t.gallery.title}
          gujaratiSubtitle="યાદગાર પળો અને તસવીરો"
          description={t.gallery.description}
          centered
        />

        <GalleryGrid initialImages={images} eventsList={events} />

      </div>
    </div>
  )
}
