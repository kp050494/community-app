"use client"

import Link from "next/link"
import { MapPin, Phone, Mail, Globe, MessageCircle, Share2 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function PublicFooter() {
  const { t } = useLanguage()

  const quickLinks = [
    { label: t.nav.home, href: "/" },
    { label: t.footer.aboutUs, href: "/about" },
    { label: t.nav.events, href: "/events" },
    { label: t.nav.notices, href: "/notices" },
    { label: t.nav.gallery, href: "/gallery" },
    { label: t.nav.contact, href: "/contact" },
  ]

  return (
    <footer className="relative bg-[#0B0F1A] border-t border-white/5 pt-20 pb-10 overflow-hidden text-slate-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[1px] bg-gradient-to-r from-transparent via-[#D4A853]/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#D4A853]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10 px-6 mx-auto">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">

          {/* Brand Col */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-heading text-xl font-bold tracking-tight leading-snug gold-gradient">
                શ્રી કચ્છ કડવા પાટીદાર પંડેસરા મિત્ર મંડળ
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              {t.footer.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-sm font-semibold tracking-wider text-white uppercase font-heading">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-[#D4A853] inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-sm font-semibold tracking-wider text-white uppercase font-heading">
              {t.footer.contactUs}
            </h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4A853] shrink-0" />
                <span>
                  Udhana Main Rd, near BAPS Swaminarayan Mandir,<br />
                  Udhana GIDC, Citi Industrial Estate,<br />
                  Udhna, Surat, Gujarat - 394210
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#D4A853] shrink-0" />
                <span>+91 9898623611</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#D4A853] shrink-0" />
                <span>info@skppmm.org</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-6 text-sm font-semibold tracking-wider text-white uppercase font-heading">
              {t.footer.connectWithUs}
            </h3>
            <p className="mb-4 text-sm text-slate-400">
              {t.footer.followUs}
            </p>
            <div className="flex gap-4">
              {[
                { icon: Globe, href: "#" },
                { icon: MessageCircle, href: "#" },
                { icon: Share2, href: "#" },
              ].map((Social, i) => (
                <a
                  key={i}
                  href={Social.href}
                  className="flex items-center justify-center w-10 h-10 transition-colors rounded-full bg-white/5 hover:bg-[#D4A853] hover:text-black text-white"
                >
                  <Social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 mt-16 text-sm text-center border-t border-white/10 text-slate-500">
          <p>© {new Date().getFullYear()} Shree Kutch Kadwa Patidar Pandesara Mitra Mandal. {t.footer.allRightsReserved}</p>
        </div>
      </div>
    </footer>
  )
}
