import Link from "next/link"
import { MapPin, Phone, Mail, Globe, MessageCircle, Share2 } from "lucide-react"

export function PublicFooter() {
  return (
    <footer className="relative bg-[#0B0F1A] border-t border-white/5 pt-20 pb-10 overflow-hidden text-slate-300">
      {/* Decorative gradient blur in background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[1px] bg-gradient-to-r from-transparent via-[#D4A853]/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#D4A853]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10 px-6 mx-auto">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          
          {/* Brand Col */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-heading text-3xl font-bold tracking-tight text-white">
                <span className="gold-gradient">SKP</span>PMM
              </span>
              <p className="mt-1 text-sm text-slate-400 italic">
                શ્રી કચ્છ કડવા પાટીદાર પાંદેસરા મિત્ર મંડળ
              </p>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              A premium platform dedicated to uniting our community, preserving our culture, and organizing events for the betterment of all members.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-sm font-semibold tracking-wider text-white uppercase font-heading">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {['Home', 'About Us', 'Events', 'Notices', 'Gallery', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="transition-colors hover:text-[#D4A853] inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-sm font-semibold tracking-wider text-white uppercase font-heading">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4A853] shrink-0" />
                <span>
                  123 Community Hall Road,<br />
                  Pandesara, Surat, Gujarat 394221
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#D4A853] shrink-0" />
                <span>+91 98765 43210</span>
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
              Connect With Us
            </h3>
            <p className="mb-4 text-sm text-slate-400">
              Follow us on social media for the latest updates and announcements.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Globe, href: '#' },
                { icon: MessageCircle, href: '#' },
                { icon: Share2, href: '#' },
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
          <p>© {new Date().getFullYear()} Shree Kutch Kadwa Patidar Pandesara Mitra Mandal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
