"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

const variantStyles = {
  default:
    "bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg",
  elevated:
    "bg-white/10 dark:bg-white/10 backdrop-blur-2xl border border-white/15 shadow-2xl",
  gold:
    "bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-[#D4A853]/30 shadow-lg shadow-[#D4A853]/5",
} as const

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variantStyles
  hover?: boolean
}

export function GlassCard({
  variant = "default",
  hover = false,
  className,
  children,
  ...props
}: GlassCardProps) {
  const baseClasses = cn("rounded-2xl", variantStyles[variant], className)

  if (hover) {
    return (
      <motion.div
        className={baseClasses}
        whileHover={{
          y: -4,
          boxShadow:
            variant === "gold"
              ? "0 20px 40px -12px rgba(212, 168, 83, 0.25)"
              : "0 20px 40px -12px rgba(0, 0, 0, 0.35)",
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.div>)}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  )
}
