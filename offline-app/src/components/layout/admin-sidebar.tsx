import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import {
  LayoutDashboard, Users, Home, Settings, LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/auth/auth-context"

interface AdminSidebarProps {
  collapsed: boolean
}

export function AdminSidebar({ collapsed }: AdminSidebarProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { logout } = useAuth()

  // v1 ships these sections; events/notices/payments/gallery arrive in later phases.
  const NAV_ITEMS = [
    { icon: LayoutDashboard, label: t.admin.nav.dashboard, href: "/admin/dashboard" },
    { icon: Home, label: t.admin.nav.families, href: "/admin/families" },
    { icon: Users, label: t.admin.nav.members, href: "/admin/members" },
    { icon: Settings, label: t.admin.nav.settings, href: "/admin/settings" },
  ]

  const handleSignOut = () => {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280, opacity: 1 }}
      className="fixed inset-y-0 left-0 z-40 hidden md:flex flex-col bg-card border-r border-border shadow-xl dark:shadow-none transition-all"
    >
      {/* Brand */}
      <div className="flex items-center justify-center h-20 border-b border-border px-3">
        {collapsed ? (
          <img src="logo.png" alt="SKPPMM" width={48} height={48} className="object-contain" />
        ) : (
          <div className="flex items-center gap-3">
            <img src="logo.png" alt="SKPPMM" width={60} height={60} className="object-contain shrink-0" />
            <div className="flex flex-col">
              <span className="font-heading text-sm font-bold tracking-tight text-foreground leading-tight">
                શ્રી ક.ક.પા. પાંડેેસરા મિત્ર મંડળ
              </span>
              <span className="text-[0.6rem] font-medium tracking-widest text-muted-foreground uppercase">
                {t.admin.nav.adminPortal}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 shrink-0 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
              )} />

              {!collapsed && <span className="truncate">{item.label}</span>}

              {isActive && !collapsed && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                />
              )}

              {collapsed && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}
      </div>

      {/* Sign Out */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className={cn(
            "flex items-center w-full gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group",
            collapsed ? "justify-center" : "justify-start",
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="font-medium">{t.admin.nav.signOut}</span>}
        </button>
      </div>
    </motion.aside>
  )
}
