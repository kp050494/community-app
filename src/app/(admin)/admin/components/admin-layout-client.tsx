"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { AdminTopbar } from "@/components/layout/admin-topbar"
import { cn } from "@/lib/utils"

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar collapsed={sidebarCollapsed} />

      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarCollapsed ? "md:pl-20" : "md:pl-[280px]"
        )}
      >
        <AdminTopbar
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
