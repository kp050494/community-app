"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, ChevronLeft, ChevronRight, Eye, Calendar } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"

type ImageItem = {
  id: string
  imageUrl: string
  caption: string | null
  eventId: string | null
  createdAt: any
  event?: {
    id: string
    name: string
  } | null
}

interface GalleryGridProps {
  initialImages: ImageItem[]
  eventsList: { id: string; name: string }[]
}

export function GalleryGrid({ initialImages, eventsList }: GalleryGridProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>("all")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Filter images
  const filteredImages = selectedEventId === "all"
    ? initialImages
    : initialImages.filter(img => img.eventId === selectedEventId)

  // Lightbox navigation
  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const showNext = () => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex + 1) % filteredImages.length)
  }

  const showPrev = () => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length)
  }

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setSelectedEventId("all")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
            selectedEventId === "all"
              ? "bg-primary border-primary text-primary-foreground shadow-[0_0_15px_rgba(212,168,83,0.3)]"
              : "bg-card/40 border-white/10 text-muted-foreground hover:text-foreground hover:bg-card"
          }`}
        >
          All Photos
        </button>
        {eventsList.map((event) => (
          <button
            key={event.id}
            onClick={() => setSelectedEventId(event.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              selectedEventId === event.id
                ? "bg-primary border-primary text-primary-foreground shadow-[0_0_15px_rgba(212,168,83,0.3)]"
                : "bg-card/40 border-white/10 text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            {event.name}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <AnimatePresence mode="popLayout">
        {filteredImages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 text-muted-foreground"
          >
            No photos uploaded in this category yet.
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredImages.map((image, index) => (
              <motion.div
                layout
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative cursor-pointer aspect-square rounded-2xl overflow-hidden bg-muted border border-white/10 shadow-lg"
                onClick={() => openLightbox(index)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.imageUrl}
                  alt={image.caption || "Community photo"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Dark Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 text-white z-10">
                  <div className="flex justify-end">
                    <span className="w-8 h-8 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/40 text-primary">
                      <Eye className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold line-clamp-2">{image.caption || "Mitra Mandal Gathering"}</p>
                    {image.event && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-primary font-semibold mt-1 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                        <Calendar className="w-2.5 h-2.5" />
                        {image.event.name}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-55 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/20"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Navigation */}
            <button
              onClick={showPrev}
              className="absolute left-4 md:left-8 z-55 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Center Image Content */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-5xl max-h-[80vh] px-4 flex flex-col items-center justify-center gap-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={filteredImages[lightboxIndex].imageUrl}
                alt={filteredImages[lightboxIndex].caption || "Lightbox image"}
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl border border-white/10"
              />

              {/* Lightbox Footer Caption */}
              <div className="text-center text-white space-y-1 max-w-xl">
                <p className="text-lg font-bold">
                  {filteredImages[lightboxIndex].caption || "Mitra Mandal Gathering"}
                </p>
                {filteredImages[lightboxIndex].event && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                    <Calendar className="w-3.5 h-3.5" />
                    {filteredImages[lightboxIndex].event.name}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Right Navigation */}
            <button
              onClick={showNext}
              className="absolute right-4 md:right-8 z-55 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
