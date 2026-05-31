"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Calendar, Link as LinkIcon, X, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/shared/glass-card"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

type GalleryImage = {
  id: string
  imageUrl: string
  caption: string | null
  eventId: string | null
  event: { name: string } | null
  createdAt: string
}

type Event = {
  id: string
  name: string
}

export function GalleryClient({ events }: { events: Event[] }) {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editImage, setEditImage] = useState<GalleryImage | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [imageUrl, setImageUrl] = useState("")
  const [caption, setCaption] = useState("")
  const [eventId, setEventId] = useState<string>("")

  useEffect(() => { fetchImages() }, [])

  const fetchImages = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/gallery")
      const data = await res.json()
      setImages(data.data || [])
    } catch {
      console.error("Failed to fetch gallery images")
    } finally {
      setIsLoading(false)
    }
  }

  const openAddDialog = () => {
    setEditImage(null)
    setImageUrl("")
    setCaption("")
    setEventId("")
    setError(null)
    setDialogOpen(true)
  }

  const openEditDialog = (img: GalleryImage) => {
    setEditImage(img)
    setImageUrl(img.imageUrl)
    setCaption(img.caption || "")
    setEventId(img.eventId || "")
    setError(null)
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!editImage && !imageUrl.trim()) {
      setError("Image URL is required")
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      let res: Response
      if (editImage) {
        res = await fetch(`/api/gallery/${editImage.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ caption: caption || null, eventId: eventId || null }),
        })
      } else {
        res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl, caption: caption || null, eventId: eventId || null }),
        })
      }
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        setError(body?.error || "Failed to save image")
        return
      }
      setDialogOpen(false)
      fetchImages()
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image from the gallery?")) return
    const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" })
    if (res.ok) fetchImages()
    else alert("Failed to delete image")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-heading tracking-tight text-foreground">Media Gallery</h2>
          <p className="text-sm text-muted-foreground">
            Manage the community photo vault, add image URLs, and update titles.
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Image URL
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <GlassCard className="p-12 text-center text-muted-foreground max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <LinkIcon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">Vault is Empty</h3>
          <p className="text-xs mb-4">No media files yet. Add an image URL to get started.</p>
          <Button onClick={openAddDialog} size="sm" className="bg-primary text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Add Image URL
          </Button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <GlassCard key={image.id} className="overflow-hidden group flex flex-col justify-between">
              <div className="h-44 w-full overflow-hidden bg-muted relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.imageUrl}
                  alt={image.caption || "Community Photo"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Image+Error" }}
                />
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditDialog(image)}
                    className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md text-white hover:text-primary flex items-center justify-center border border-white/10 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md text-white hover:text-red-400 flex items-center justify-center border border-white/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <p className="text-sm font-semibold text-foreground line-clamp-2">
                  {image.caption || "Community Celebration"}
                </p>
                <div className="pt-2 border-t border-white/5 space-y-1 text-xs text-muted-foreground">
                  {image.event && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span className="line-clamp-1">{image.event.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 font-mono text-[10px]">
                    <LinkIcon className="w-3 h-3 shrink-0" />
                    <span className="truncate">{image.imageUrl}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[480px] bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading">
              {editImage ? "Edit Image Details" : "Add Image to Gallery"}
            </DialogTitle>
            <DialogDescription>
              {editImage ? "Update the caption or linked event." : "Paste a public image URL to add it to the gallery."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {!editImage && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Image URL <span className="text-destructive">*</span></label>
                <Input
                  placeholder="https://example.com/photo.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="bg-background/50"
                />
                {imageUrl && (
                  <div className="h-32 w-full rounded-lg overflow-hidden bg-muted mt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x200?text=Invalid+URL" }}
                    />
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Caption</label>
              <Input
                placeholder="Describe this photo..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Linked Event (optional)</label>
              <Select value={eventId} onValueChange={setEventId}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select an event..." />
                </SelectTrigger>
                <SelectContent>
                  {events.map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[110px]"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editImage ? "Save Changes" : "Add Image"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
