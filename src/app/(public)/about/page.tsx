"use client"

import { motion } from "motion/react"
import { Users, Target, Eye, Landmark, Trophy, ShieldCheck, Heart } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { FloatingOrbs } from "@/components/shared/floating-orbs"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import { SectionHeader } from "@/components/shared/section-header"
import { useLanguage } from "@/lib/language-context"

const leaders = [
  {
    nameKey: "Ramanlal Patel",
    roleKey: "president" as const,
    term: "2024 - Present",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
  },
  {
    nameKey: "Devji Patel",
    roleKey: "vicePresident" as const,
    term: "2024 - Present",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300",
  },
  {
    nameKey: "Kanti Patel",
    roleKey: "generalSecretary" as const,
    term: "2022 - Present",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300",
  },
  {
    nameKey: "Harish Patel",
    roleKey: "treasurer" as const,
    term: "2022 - Present",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300",
  },
]

export default function AboutPage() {
  const { t } = useLanguage()

  const milestones = [
    { year: "1998", title: t.about.foundationTitle, description: t.about.foundationDesc },
    { year: "2005", title: t.about.hallTitle, description: t.about.hallDesc },
    { year: "2012", title: t.about.educationTitle, description: t.about.educationDesc },
    { year: "2020", title: t.about.covidTitle, description: t.about.covidDesc },
    { year: "2025", title: t.about.digitalTitle, description: t.about.digitalDesc },
  ]

  return (
    <div className="relative min-h-screen bg-background overflow-hidden py-16 px-4 md:px-8">
      <FloatingOrbs variant="mixed" className="opacity-20" />

      <div className="max-w-7xl mx-auto space-y-24 relative z-10">

        {/* Header */}
        <ScrollReveal direction="up">
          <SectionHeader
            overline={t.about.overline}
            title={t.about.title}
            gujaratiSubtitle="શ્રી કચ્છ કડવા પાટીદાર પાંદેસરા મિત્ર મંડળ"
            description={t.about.description}
            centered
          />
        </ScrollReveal>

        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollReveal direction="left" delay={0.2}>
            <GlassCard variant="gold" className="p-8 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold font-heading text-foreground mb-4">{t.about.ourMission}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.about.missionText}
                </p>
              </div>
              <div className="border-t border-primary/20 mt-8 pt-4 text-xs font-semibold text-primary tracking-widest uppercase">
                સેવા અને સંગઠન
              </div>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.4}>
            <GlassCard variant="gold" className="p-8 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold font-heading text-foreground mb-4">{t.about.ourVision}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.about.visionText}
                </p>
              </div>
              <div className="border-t border-primary/20 mt-8 pt-4 text-xs font-semibold text-primary tracking-widest uppercase">
                પ્રગતિ અને સંસ્કાર
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>

        {/* History / Origin Story */}
        <ScrollReveal direction="up">
          <GlassCard className="p-8 md:p-12 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-[0.03] text-primary pointer-events-none transform translate-y-12 translate-x-12">
              <Landmark className="w-[300px] h-[300px]" />
            </div>
            <div className="max-w-3xl">
              <div className="text-xs font-bold text-primary tracking-widest uppercase mb-2">{t.about.ourOrigins}</div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-6">{t.about.legacyTitle}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t.about.legacyP1}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t.about.legacyP2}
              </p>
            </div>
          </GlassCard>
        </ScrollReveal>

        {/* Timeline Milestones */}
        <div className="space-y-12">
          <SectionHeader
            title={t.about.milestones}
            gujaratiSubtitle="ઐતિહાસિક પડાવો"
            centered
          />

          <div className="relative border-l border-white/10 md:border-l-0 md:before:absolute md:before:left-1/2 md:before:top-0 md:before:h-full md:before:w-[2px] md:before:bg-white/10 max-w-4xl mx-auto space-y-12">
            {milestones.map((item, index) => {
              const isEven = index % 2 === 0
              return (
                <ScrollReveal
                  key={index}
                  direction={isEven ? "left" : "right"}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${isEven ? "md:justify-start" : "md:justify-end"}`}
                >
                  <div className="absolute left-[-9px] md:left-1/2 md:translate-x-[-9px] w-4 h-4 rounded-full bg-primary border-4 border-background z-20 shadow-[0_0_10px_rgba(212,168,83,0.8)]" />
                  <div className={`w-full md:w-[45%] pl-6 md:pl-0 ${isEven ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                    <GlassCard className="p-6">
                      <span className="text-2xl font-bold font-heading text-primary block mb-1">{item.year}</span>
                      <h4 className="text-lg font-bold text-foreground mb-2">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </GlassCard>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>

        {/* Executive Committee */}
        <div className="space-y-12">
          <SectionHeader
            title={t.about.executiveCommittee}
            gujaratiSubtitle="કાર્યકારી સમિતિ"
            description={t.about.committeeDesc}
            centered
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {leaders.map((leader, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <GlassCard variant="default" hover className="overflow-hidden text-center group">
                  <div className="h-64 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={leader.image}
                      alt={leader.nameKey}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                      <p className="text-xs text-primary font-bold tracking-widest uppercase">{t.about.memberSince} {leader.term.split(" ")[0]}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold font-heading text-foreground">{leader.nameKey}</h4>
                    <p className="text-sm font-semibold text-primary mt-1">{t.about[leader.roleKey]}</p>
                    <p className="text-xs text-muted-foreground mt-2">{leader.term}</p>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
