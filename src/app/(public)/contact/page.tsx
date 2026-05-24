"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "motion/react"
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle2 } from "lucide-react"
import { contactFormSchema, type ContactFormInput } from "@/lib/validations/payment"
import { GlassCard } from "@/components/shared/glass-card"
import { FloatingOrbs } from "@/components/shared/floating-orbs"
import { SectionHeader } from "@/components/shared/section-header"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  })

  const onSubmit = async (data: ContactFormInput) => {
    setIsSubmitting(true)
    setErrorMsg("")
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const resData = await response.json()
      if (response.ok && resData.success) {
        setSubmitSuccess(true)
        reset()
      } else {
        setErrorMsg(resData.message || "Something went wrong. Please try again.")
      }
    } catch (error) {
      setErrorMsg("Failed to submit form. Please check your network connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden py-16 px-4 md:px-8">
      <FloatingOrbs variant="mixed" className="opacity-15" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <SectionHeader
          overline="Get In Touch"
          title="Contact Community Desk"
          gujaratiSubtitle="સંપર્ક કાર્યાલય"
          description="Have questions, suggestions, or want to register as a new family? Send us a message or reach out through our helpline."
          centered
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Panel */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard variant="gold" className="p-8 space-y-8">
              <h3 className="text-2xl font-bold font-heading text-foreground">Office Address</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Mandal Office</h4>
                    <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                      Plot No. 124-125, G.I.D.C. Industrial Estate,<br />
                      Opposite Pandesara Police Station, Pandesara,<br />
                      Surat, Gujarat - 394221
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Helpline Numbers</h4>
                    <p className="text-muted-foreground text-sm mt-1">
                      +91 98765 43210 (Office Desk)<br />
                      +91 94281 12345 (Secretary Office)
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Email Address</h4>
                    <p className="text-muted-foreground text-sm mt-1 hover:text-primary transition-colors">
                      <a href="mailto:info@skppmm.org">info@skppmm.org</a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Visiting Hours</h4>
                    <p className="text-muted-foreground text-sm mt-1">
                      Sunday: 9:00 AM - 12:30 PM<br />
                      Mon - Sat: Closed (Call Helpline)
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <span className="text-xs font-semibold text-primary tracking-widest uppercase block mb-1">
                  Connect Online
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Join our official WhatsApp group for faster alerts. Send a copy of your Member ID to our Helpline.
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Form Panel */}
          <div className="lg:col-span-7">
            <GlassCard className="p-8 md:p-10">
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-16 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-foreground">Message Sent!</h3>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    Thank you for contacting us. Our community desk officer will get back to you shortly.
                  </p>
                  <Button 
                    onClick={() => setSubmitSuccess(false)}
                    variant="outline"
                    className="mt-6"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <h3 className="text-2xl font-bold font-heading text-foreground mb-4">Send a Message</h3>

                  {errorMsg && (
                    <div className="p-4 text-sm font-semibold text-destructive bg-destructive/10 border border-destructive/20 rounded-xl text-center">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground ml-1">Your Full Name</label>
                      <input
                        type="text"
                        {...register("name")}
                        placeholder="e.g. Hasmukh Patel"
                        className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm text-foreground"
                      />
                      {errors.name && (
                        <span className="text-xs text-destructive font-medium ml-1">{errors.name.message}</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground ml-1">Mobile Number</label>
                      <input
                        type="tel"
                        {...register("phone")}
                        placeholder="e.g. 98250 12345"
                        className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm text-foreground"
                      />
                      {errors.phone && (
                        <span className="text-xs text-destructive font-medium ml-1">{errors.phone.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground ml-1">Email Address (Optional)</label>
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="e.g. hasmukh@gmail.com"
                      className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm text-foreground"
                    />
                    {errors.email && (
                      <span className="text-xs text-destructive font-medium ml-1">{errors.email.message}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground ml-1">Message Description</label>
                    <textarea
                      rows={5}
                      {...register("message")}
                      placeholder="Write your details, queries, or family registration requests here..."
                      className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm text-foreground resize-none"
                    />
                    {errors.message && (
                      <span className="text-xs text-destructive font-medium ml-1">{errors.message.message}</span>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 font-bold rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/25 transition-all"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </GlassCard>
          </div>

        </div>

      </div>
    </div>
  )
}
