"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, Users, Calendar, Award, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      
      {/* ── HERO SECTION ────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[100svh] px-4 md:px-6 pt-20 overflow-hidden">
        
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 -z-20 gradient-animated opacity-90 dark:opacity-100" />
        
        {/* Abstract Floating Shapes */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.05, 1] 
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px]" 
          />
          <motion.div 
            animate={{ 
              y: [0, 40, 0],
              x: [0, -30, 0],
              scale: [1, 1.1, 1] 
            }}
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
            EST. 2014 • SURAT, GUJARAT
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 font-heading text-6xl md:text-8xl lg:text-[7.5rem] font-bold tracking-tighter text-foreground leading-[1.1]"
          >
            <span className="block drop-shadow-sm">Shree Kutch</span>
            <span className="block drop-shadow-sm">Kadwa Patidar</span>
            <span className="block gold-gradient pb-4">Pandesara Mitra Mandal</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 text-2xl md:text-3xl italic text-muted-foreground font-heading"
          >
            શ્રી કચ્છ કડવા પાટીદાર પાંદેસરા મિત્ર મંડળ
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl mx-auto mb-12 text-lg md:text-xl text-muted-foreground/90 leading-relaxed font-medium"
          >
            Uniting our community through culture, support, and shared vision. 
            A modern platform dedicated to seamless event management, member networking, and preserving our rich heritage.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Button size="lg" className="w-full sm:w-auto px-10 h-14 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 btn-shimmer rounded-full shadow-[0_10px_30px_rgba(212,168,83,0.3)] transition-all hover:-translate-y-1">
              Join the Community
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-10 h-14 text-base font-bold border-primary/50 text-primary hover:bg-primary/10 rounded-full bg-background/50 backdrop-blur-sm transition-all hover:-translate-y-1">
              Admin Portal
            </Button>
          </motion.div>
          
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-2 text-muted-foreground"
        >
          <span className="text-xs font-semibold tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-primary" />
          </motion.div>
        </motion.div>

      </section>

      {/* ── STATS SECTION ───────────────────────────────────────────── */}
      <section className="relative z-20 -mt-20 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { label: "Active Members", value: "2,000+", icon: Users, delay: 0 },
              { label: "Registered Families", value: "500+", icon: Award, delay: 0.1 },
              { label: "Yearly Events", value: "24+", icon: Calendar, delay: 0.2 },
              { label: "Years of Service", value: "10+", icon: Award, delay: 0.3 },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: stat.delay, ease: "easeOut" }}
                className="glass p-6 md:p-8 rounded-3xl premium-card text-center bg-card/40 backdrop-blur-xl border border-white/10"
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
                Our Mission
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-[1.2]">
                Preserving our heritage for the <span className="text-primary">next generation.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our organization stands as a pillar of unity for the Kutch Kadwa Patidar community in Pandesara. We are dedicated to fostering social, cultural, and educational development while maintaining our deep-rooted traditions.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Community Welfare & Support",
                  "Cultural Events & Gatherings",
                  "Educational Assistance Programs",
                  "Youth Empowerment & Networking"
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
                  Read our full history 
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
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0F1629] to-[#2DD4BF]/20 mix-blend-overlay z-10" />
                <div className="absolute inset-0 bg-muted flex items-center justify-center flex-col gap-4">
                  <div className="w-20 h-20 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center">
                    <Users className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground font-medium uppercase tracking-widest text-sm">Community Photo Placeholder</span>
                </div>
                {/* Decorative Elements */}
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
