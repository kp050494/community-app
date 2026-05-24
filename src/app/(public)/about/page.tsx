"use client"

import { motion } from "motion/react"
import { Users, Target, Eye, Landmark, Trophy, ShieldCheck, Heart } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { FloatingOrbs } from "@/components/shared/floating-orbs"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import { SectionHeader } from "@/components/shared/section-header"

const leaders = [
  {
    name: "Ramanlal Patel",
    role: "President",
    term: "2024 - Present",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
  },
  {
    name: "Devji Patel",
    role: "Vice President",
    term: "2024 - Present",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300",
  },
  {
    name: "Kanti Patel",
    role: "General Secretary",
    term: "2022 - Present",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300",
  },
  {
    name: "Harish Patel",
    role: "Treasurer",
    term: "2022 - Present",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300",
  },
]

const milestones = [
  {
    year: "1998",
    title: "Foundation of Mandal",
    description: "Established to support Kutch Kadwa Patidar community families arriving in Pandesara, Surat.",
  },
  {
    year: "2005",
    title: "First Community Hall",
    description: "Inaugurated our first dedicated community gathering center for festivals and meetings.",
  },
  {
    year: "2012",
    title: "Education Trust Launch",
    description: "Created a scholarship fund to support higher education for meritorious community students.",
  },
  {
    year: "2020",
    title: "COVID Support Initiative",
    description: "Distributed medical kits, food packets, and organized emergency oxygen support clinics.",
  },
  {
    year: "2025",
    title: "Digital Platform Launch",
    description: "Pioneered a modern digital community network to connect over 2,000+ members seamlessly.",
  },
]

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden py-16 px-4 md:px-8">
      <FloatingOrbs variant="mixed" className="opacity-20" />

      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        
        {/* Header */}
        <ScrollReveal direction="up">
          <SectionHeader
            overline="Our Identity"
            title="About Pandesara Mitra Mandal"
            gujaratiSubtitle="શ્રી કચ્છ કડવા પાટીદાર પાંદેસરા મિત્ર મંડળ"
            description="Preserving our heritage, supporting our families, and building a stronger future in Pandesara, Surat."
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
                <h3 className="text-2xl font-bold font-heading text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To unite and empower the Kutch Kadwa Patidar families living in Pandesara by providing a solid network of social, economic, cultural, and educational support, fostering brotherhood and keeping our cultural traditions thriving for generations.
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
                <h3 className="text-2xl font-bold font-heading text-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To build an exemplary, highly interconnected, and prosperous community where every member thrives educationally and financially, preserving traditional Kutch values while embracing modern progress and global opportunities.
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
              <div className="text-xs font-bold text-primary tracking-widest uppercase mb-2">Our Origins</div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-6">A Legacy of Unity</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                In the late 1990s, as several hardworking families migrated from the Kutch region in Gujarat to the industrial hub of Pandesara, Surat, a need arose for a strong support network. In 1998, under the guidance of our visionary elders, **Shree Kutch Kadwa Patidar Pandesara Mitra Mandal** was formed.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                What started as a small group of committed individuals gathering in small homes has now grown into a robust, vibrant community representing over 500+ families and 2,000+ individual members. We host annual cultural events, support youth education, run medical clinics, and preserve the deep-seated cultural ethos of our homeland, Kutch.
              </p>
            </div>
          </GlassCard>
        </ScrollReveal>

        {/* Timeline Milestones */}
        <div className="space-y-12">
          <SectionHeader
            title="Our Milestones"
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
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? "md:justify-start" : "md:justify-end"
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-[-9px] md:left-1/2 md:translate-x-[-9px] w-4 h-4 rounded-full bg-primary border-4 border-background z-20 shadow-[0_0_10px_rgba(212,168,83,0.8)]" />

                  {/* Card Container */}
                  <div className={`w-full md:w-[45%] pl-6 md:pl-0 ${isEven ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                    <GlassCard className="p-6">
                      <span className="text-2xl font-bold font-heading text-primary block mb-1">
                        {item.year}
                      </span>
                      <h4 className="text-lg font-bold text-foreground mb-2">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </GlassCard>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>

        {/* Executive Committee / Leadership */}
        <div className="space-y-12">
          <SectionHeader
            title="Executive Committee"
            gujaratiSubtitle="કાર્યકારી સમિતિ"
            description="The dedicated leaders directing and supporting the vision of the Pandesara Mitra Mandal."
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
                      alt={leader.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                      <p className="text-xs text-primary font-bold tracking-widest uppercase">Member Since {leader.term.split(" ")[0]}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold font-heading text-foreground">{leader.name}</h4>
                    <p className="text-sm font-semibold text-primary mt-1">{leader.role}</p>
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
