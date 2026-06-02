"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Users, Calendar, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

type SiteStats = {
  memberCount: number
  familyCount: number
  upcomingEventsCount: number
  yearsOfService: number
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState<SiteStats>({
    memberCount: 2000,
    familyCount: 500,
    upcomingEventsCount: 24,
    yearsOfService: new Date().getFullYear() - 1998,
  })
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true)
    fetch("/api/stats")
      .then(r => r.json())
      .then(data => {
        if (data.success) setStats(data.data)
      })
      .catch(() => {})
  }, [])

  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">

      {/* ── HERO SECTION ────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[100svh] px-4 md:px-6 pt-20 overflow-hidden">

        <div className="absolute inset-0 -z-20 gradient-animated opacity-90 dark:opacity-100" />

        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ y: [0, 40, 0], x: [0, -30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-[#2DD4BF]/10 rounded-full blur-[120px]"
          />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto text-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center justify-center px-5 py-2 mb-8 text-sm font-semibold tracking-widest uppercase rounded-full border border-primary/40 bg-primary/10 text-primary shadow-[0_0_20px_rgba(212,168,83,0.15)] backdrop-blur-md"
          >
            {t.home.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.2]"
          >
            <span className="block gold-gradient pb-4">શ્રી કચ્છ કડવા પાટીદાર પંડેસરા મિત્ર મંડળ</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl mx-auto mb-12 text-lg md:text-xl text-muted-foreground/90 leading-relaxed font-medium"
          >
            આપણી સંસ્કૃતિ, સહયોગ અને સહિયારી દ્રષ્ટિ દ્વારા આપણા સમાજને એક કરીએ. ઈવેન્ટ મેનેજમેન્ટ, સભ્ય નેટવર્કિંગ અને આપણા સમૃદ્ધ વારસાને જાળવવા માટે સમર્પિત એક આધુનિક પ્લેટફોર્મ.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto px-10 h-14 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 btn-shimmer rounded-full shadow-[0_10px_30px_rgba(212,168,83,0.3)] transition-all hover:-translate-y-1">
                {t.home.joinCommunity}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-10 h-14 text-base font-bold border-primary/50 text-primary hover:bg-primary/10 rounded-full bg-background/50 backdrop-blur-sm transition-all hover:-translate-y-1">
                {t.home.adminPortal}
              </Button>
            </Link>
          </motion.div>

        </div>

      </section>

      {/* ── STATS SECTION ───────────────────────────────────────────── */}
      <section className="relative bg-background px-4 md:px-6 py-16 md:py-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { label: t.home.activeMembers, value: `${stats.memberCount.toLocaleString()}+`, icon: Users, delay: 0 },
              { label: t.home.registeredFamilies, value: `${stats.familyCount.toLocaleString()}+`, icon: Award, delay: 0.1 },
              { label: t.home.yearlyEvents, value: `${stats.upcomingEventsCount}+`, icon: Calendar, delay: 0.2 },
              { label: t.home.yearsOfService, value: `${stats.yearsOfService}+`, icon: Award, delay: 0.3 },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: stat.delay, ease: "easeOut" }}
                className="p-6 md:p-8 rounded-3xl text-center bg-card border border-border shadow-sm"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-2xl bg-primary/10 text-primary">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-2 tracking-tight">{stat.value}</div>
                <div className="text-sm md:text-base font-semibold tracking-wide uppercase text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT PREVIEW SECTION ───────────────────────────────────── */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-background">
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-bold tracking-widest uppercase rounded-full bg-secondary text-foreground border border-border">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse-dot" />
                {t.home.ourMission}
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-[1.2]">
                {t.home.missionTitle} <span className="text-primary">{t.home.missionTitleHighlight}</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t.home.missionDesc}
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  t.home.welfare,
                  t.home.cultural,
                  t.home.education,
                  t.home.youth,
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="pt-6">
                <Button variant="link" className="text-primary p-0 h-auto font-bold text-lg hover:no-underline group">
                  {t.home.readHistory}
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-2" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden glass relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0F1629]/60 to-transparent mix-blend-overlay z-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.pexels.com/photos/7685719/pexels-photo-7685719.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Community gathering"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary rounded-full blur-2xl opacity-50 mix-blend-screen" />
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#2DD4BF] rounded-full blur-2xl opacity-30 mix-blend-screen" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  )
}
