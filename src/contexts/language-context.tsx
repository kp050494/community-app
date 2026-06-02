"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Lang = "en" | "gu"

type LanguageContextType = {
  lang: Lang
  toggle: () => void
  t: (key: string) => string
}

const translations: Record<string, Record<Lang, string>> = {
  // ── Navbar ──────────────────────────────────────────────────────────────────
  "nav.home":    { en: "Home",    gu: "ઘર" },
  "nav.about":   { en: "About",   gu: "વિશે" },
  "nav.events":  { en: "Events",  gu: "ઈવેન્ટ" },
  "nav.notices": { en: "Notices", gu: "સૂચનાઓ" },
  "nav.gallery": { en: "Gallery", gu: "ગેલેરી" },
  "nav.contact": { en: "Contact", gu: "સંપર્ક" },

  // ── Hero ─────────────────────────────────────────────────────────────────────
  "hero.badge":  { en: "EST. 2014 • SURAT, GUJARAT", gu: "સ્થા. ૨૦૧૪ • સુરત, ગુજરાત" },
  "hero.title":  {
    en: "Shree Kutch Kadwa Patidar Pandesara Mitra Mandal",
    gu: "શ્રી કચ્છ કડવા પટીદાર પાંડેસરા મિત્ર મંડળ",
  },
  "hero.description": {
    en: "Uniting our community through culture, support, and shared vision. A modern platform dedicated to seamless event management, member networking, and preserving our rich heritage.",
    gu: "આપણી સંસ્કૃતિ, સહયોગ અને સહિયારી દ્રષ્ટિ દ્વારા આપણા સમાજને એક કરીએ. ઈવેન્ટ મેનેજમેન્ટ, સભ્ય નેટવર્કિંગ અને આપણા સમૃદ્ધ વારસાને જાળવવા માટે સમર્પિત એક આધુનિક પ્લેટફોર્મ.",
  },
  "hero.join":   { en: "Join the Community",  gu: "સમુદાય સાથે જોડાઓ" },
  "hero.admin":  { en: "Admin Portal",         gu: "એડમિન પોર્ટલ" },

  // ── Stats ─────────────────────────────────────────────────────────────────────
  "stats.members":  { en: "Active Members",      gu: "સક્રિય સભ્યો" },
  "stats.families": { en: "Registered Families", gu: "નોંધાયેલ પરિવારો" },
  "stats.events":   { en: "Yearly Events",       gu: "વાર્ષિક ઈવેન્ટ" },
  "stats.years":    { en: "Years of Service",    gu: "સેવાના વર્ષ" },

  // ── About section ─────────────────────────────────────────────────────────────
  "about.tag":        { en: "Our Mission",    gu: "આપણું ધ્યેય" },
  "about.heading":    {
    en: "Preserving our heritage for the next generation.",
    gu: "આગામી પેઢી માટે આપણો વારસો સાચવીએ.",
  },
  "about.body": {
    en: "Our organization stands as a pillar of unity for the Kutch Kadwa Patidar community in Pandesara. We are dedicated to fostering social, cultural, and educational development while maintaining our deep-rooted traditions.",
    gu: "પાંડેસરામાં કચ્છ કડવા પટીદાર સમાજ માટે આપણી સંસ્થા એકતાના સ્તંભ સ્વરૂપ ઊભી છે. આપણી ઊંડી પ્રણાલીઓ જાળવી રાખીને સામાજિક, સાંસ્કૃતિક અને શૈક્ષણિક વિકાસ કરવા અમે સમર્પિત છીએ.",
  },
  "about.item1": { en: "Community Welfare & Support",       gu: "સામૂહિક કલ્યાણ અને સહારો" },
  "about.item2": { en: "Cultural Events & Gatherings",      gu: "સાંસ્કૃતિક ઈવેન્ટ અને સભાઓ" },
  "about.item3": { en: "Educational Assistance Programs",   gu: "શૈક્ષણિક સહાય કાર્યક્રમો" },
  "about.item4": { en: "Youth Empowerment & Networking",    gu: "યુવા સશક્તિકરણ અને નેટવર્કિંગ" },
  "about.readmore": { en: "Read our full history", gu: "આપણો સંપૂર્ણ ઇતિહાસ વાંચો" },

  // ── Footer ────────────────────────────────────────────────────────────────────
  "footer.brand":   {
    en: "Shree Kutch Kadwa Patidar Pandesara Mitra Mandal",
    gu: "શ્રી કચ્છ કડવા પટીદાર પાંડેસરા મિત્ર મંડળ",
  },
  "footer.tagline": {
    en: "A premium platform dedicated to uniting our community, preserving our culture, and organizing events for the betterment of all members.",
    gu: "આપણા સમાજને એક કરવા, સંસ્કૃતિ સાચવવા અને તમામ સભ્યોના ઉત્કર્ષ માટે ઈવેન્ટ આયોજન માટે સમર્પિત પ્લેટ-ફોર્મ.",
  },
  "footer.quicklinks":  { en: "Quick Links",     gu: "ઝડપી લિંક" },
  "footer.contact":     { en: "Contact Us",       gu: "સંપર્ક કરો" },
  "footer.connect":     { en: "Connect With Us",  gu: "અમારી સાથે જોડાઓ" },
  "footer.followus":    { en: "Follow us on social media for the latest updates and announcements.", gu: "તાજા સમાચાર અને જાહેરાત માટે સોશ્યલ મીડિયા પર ફૉલો કરો." },
  "footer.copyright":   {
    en: "Shree Kutch Kadwa Patidar Pandesara Mitra Mandal. All rights reserved.",
    gu: "શ્રી કચ્છ કડવા પટીદાર પાંડેસરા મિત્ર મંડળ. સર્વ હક્ક સુરક્ષિત.",
  },
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggle: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en")

  useEffect(() => {
    const saved = localStorage.getItem("skppmm-lang") as Lang | null
    if (saved === "en" || saved === "gu") setLang(saved)
  }, [])

  const toggle = () => {
    setLang(prev => {
      const next: Lang = prev === "en" ? "gu" : "en"
      localStorage.setItem("skppmm-lang", next)
      return next
    })
  }

  const t = (key: string): string =>
    translations[key]?.[lang] ?? translations[key]?.en ?? key

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
