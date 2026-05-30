"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import { 
  LayoutDashboard, Users, Home, Calendar, 
  Bell, CreditCard, BarChart3, Image, 
  MessageSquare, Settings, LogOut, PanelLeftClose, PanelLeftOpen 
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Home, label: "Families", href: "/admin/families" },
  { icon: Users, label: "Members", href: "/admin/members" },
  { icon: Calendar, label: "Events", href: "/admin/events" },
  { icon: Bell, label: "Notices", href: "/admin/notices" },
  { icon: CreditCard, label: "Payments", href: "/admin/payments" },
  { icon: BarChart3, label: "Reports", href: "/admin/reports" },
  { icon: Image, label: "Gallery", href: "/admin/gallery" },
  { icon: MessageSquare, label: "Messages", href: "/admin/messages" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

interface AdminSidebarProps {
  collapsed: boolean
}

export function AdminSidebar({ collapsed }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: collapsed ? 80 : 280,
        opacity: 1
      }}
      className="fixed inset-y-0 left-0 z-40 hidden md:flex flex-col bg-card border-r border-border shadow-xl dark:shadow-none transition-all"
    >
      {/* Brand */}
      <div className="flex items-center justify-center h-20 border-b border-border">
        {collapsed ? (
          <span className="font-heading text-2xl font-bold tracking-tight text-primary">SKP</span>
        ) : (
          <div className="flex flex-col items-center">
            <span className="font-heading text-2xl font-bold tracking-tight text-foreground">
              <span className="gold-gradient">SKP</span>PMM
            </span>
            <span className="text-[0.65rem] font-medium tracking-widest text-muted-foreground uppercase">
              Admin Portal
            </span>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-primary/10 text-primary font-semibold" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 shrink-0 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}

              {/* Active Indicator Line */}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                />
              )}

              {/* Tooltip for Collapsed State */}
              {collapsed && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}
      </div>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-border">
        <button className={cn(
          "flex items-center w-full gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group",
          collapsed ? "justify-center" : "justify-start"
        )}>
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  )
}
