import { prisma } from "@/lib/prisma"
import { MessagesView } from "./messages-view"

export const revalidate = 0

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" }
  })

  return <MessagesView messages={messages} />
}
