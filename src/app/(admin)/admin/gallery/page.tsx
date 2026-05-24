import { prisma } from "@/lib/prisma"
import { Image, Search, Trash2, Calendar, Plus, Link as LinkIcon, Edit } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"

export const revalidate = 0

export default async function AdminGalleryPage() {
  const [images, events] = await Promise.all([
    prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        event: {
          select: { name: true }
        }
      }
    }),
    prisma.event.findMany({
      select: { id: true, name: true }
    })
  ])

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-heading tracking-tight text-foreground">Media Gallery</h2>
          <p className="text-sm text-muted-foreground">
            Manage the community photo vault, upload event-related picture memories, and update titles.
          </p>
        </div>
        
        <button className="px-4 py-2 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95 border border-primary/20 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          Add Image URL
        </button>
      </div>

      {/* Grid of gallery images */}
      {images.length === 0 ? (
        <GlassCard className="p-12 text-center text-muted-foreground max-w-lg mx-auto">
          <Image className="w-12 h-12 text-primary mx-auto mb-4 border border-primary/10 p-2.5 rounded-full" />
          <h3 className="text-lg font-bold text-foreground mb-1">Vault is Empty</h3>
          <p className="text-xs">No media files have been uploaded to the community database yet.</p>
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
                />
                
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md text-white hover:text-primary flex items-center justify-center border border-white/10 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md text-white hover:text-red-500 flex items-center justify-center border border-white/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground line-clamp-2">
                    {image.caption || "Community Celebration"}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-1 text-xs text-muted-foreground">
                  {image.event && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span className="line-clamp-1">{image.event.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 font-mono text-[10px]">
                    <LinkIcon className="w-3 h-3" />
                    <span className="line-clamp-1 truncate">{image.imageUrl}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
