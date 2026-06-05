"use client"

import * as React from "react"
import { motion } from "motion/react"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      {/* Icon */}
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 dark:bg-white/5">
        <Icon className="h-8 w-8 text-muted-foreground/60" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-semibold text-foreground/90">
        {title}
      </h3>

      {/* Description */}
      <p className="mb-6 max-w-sm text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Optional CTA */}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-5 py-2.5",
            "bg-[#D4A853] text-white text-sm font-medium",
            "hover:bg-[#c49b47] transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
        >
          {action.label}
        </button>
      )}
    </motion.div>
  )
}
