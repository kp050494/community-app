"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Events", href: "/events" },
  { name: "Notices", href: "/notices" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
]

export function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

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
            <Link href="/" className="flex flex-col relative z-50 group">
              <span className="font-heading text-2xl font-bold tracking-tight text-foreground transition-transform duration-300 group-hover:scale-[1.02]">
                <span className="gold-gradient">SKP</span>PMM
              </span>
              <span className={cn(
                "text-[0.6rem] font-medium text-muted-foreground italic transition-opacity duration-300",
                isScrolled ? "opacity-0 h-0" : "opacity-100"
              )}>
                શ્રી કચ્છ કડવા પાટીદાર પાંદેસરા મિત્ર મંડળ
              </span>
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
              
              <Link 
                href="/login" 
                className="ml-4 px-5 py-2 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20 transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_15px_rgba(212,168,83,0.3)]"
              >
                Login
              </Link>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className="relative z-50 p-2 -mr-2 md:hidden text-foreground focus:outline-none"
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
              <div className="w-12 h-px bg-border mx-auto my-2" />
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl font-medium text-primary"
              >
                Admin Login
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
