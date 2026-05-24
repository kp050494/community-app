"use client"

import { PanelLeftClose, PanelLeftOpen, Bell, User } from "lucide-react"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"

interface AdminTopbarProps {
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export function AdminTopbar({ sidebarCollapsed, onToggleSidebar }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 glass-navbar border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="hidden md:flex text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </Button>
        <div className="hidden sm:block">
          <h2 className="text-lg font-bold font-heading text-foreground">Welcome back, Admin</h2>
          <p className="text-xs text-muted-foreground">Manage your community efficiently.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse-dot" />
        </Button>

        <div className="w-px h-6 bg-border mx-2" />

        <div className="flex items-center gap-3 cursor-pointer">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-foreground leading-none">Super Admin</p>
            <p className="text-xs text-muted-foreground mt-1">super@skppmm.org</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
            <User className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
    </header>
  )
}
