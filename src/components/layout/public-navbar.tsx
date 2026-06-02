"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { LanguageToggle } from "@/components/shared/language-toggle"

export function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()

  const NAV_LINKS = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.about, href: "/about" },
    { name: t.nav.events, href: "/events" },
    { name: t.nav.notices, href: "/notices" },
    { name: t.nav.gallery, href: "/gallery" },
    { name: t.nav.contact, href: "/contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          isScrolled 
            ? "py-3 glass-navbar shadow-sm dark:shadow-none" 
            : "py-5 bg-transparent"
        )}
      >
        <div className="container px-4 mx-auto md:px-6">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 relative z-50 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="SKPPMM Logo"
                width={56}
                height={56}
                className="object-contain transition-transform duration-300 group-hover:scale-[1.05] shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-heading text-sm font-bold tracking-tight leading-tight text-primary transition-colors duration-500">
                  શ્રી ક.ક.પા. પાંડેેસરા મિત્ર મંડળ
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="relative text-sm font-medium transition-colors hover:text-primary"
                  >
                    <span className={cn(
                      "relative z-10",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}>
                      {link.name}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                )
              })}
              <LanguageToggle />
            </nav>

            {/* Mobile: language toggle + hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <LanguageToggle />
              <button
                className="relative z-50 p-2 -mr-2 text-foreground focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md pt-24 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-6 text-center">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-2xl font-heading font-semibold transition-colors",
                    pathname === link.href ? "text-primary" : "text-foreground"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
