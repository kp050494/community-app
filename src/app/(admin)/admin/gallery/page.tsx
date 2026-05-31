import { prisma } from "@/lib/prisma"
import { GalleryClient } from "./components/gallery-client"

export const revalidate = 0

export default async function AdminGalleryPage() {
  const events = await prisma.event.findMany({
    select: { id: true, name: true },
    orderBy: { date: "desc" },
  })

  return (
    <div className="flex-1 p-4 md:p-8 pt-6">
      <GalleryClient events={events} />
    </div>
  )
}
