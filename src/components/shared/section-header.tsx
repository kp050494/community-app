"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export interface SectionHeaderProps {
  overline?: string
  title: string
  description?: string
  gujaratiSubtitle?: string
  centered?: boolean
  className?: string
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const childVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

export function SectionHeader({
  overline,
  title,
  description,
  gujaratiSubtitle,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={cn(
        "mb-12 max-w-3xl",
        centered && "mx-auto text-center",
        className
      )}
    >
      {/* Overline */}
      {overline && (
        <motion.p
          variants={childVariants}
          className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A853]"
        >
          {overline}
        </motion.p>
      )}

      {/* Title */}
      <motion.h2
        variants={childVariants}
        className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
      >
        {title}
      </motion.h2>

      {/* Gujarati subtitle */}
      {gujaratiSubtitle && (
        <motion.p
          variants={childVariants}
          className="mt-2 text-lg italic text-muted-foreground/70 sm:text-xl"
        >
          {gujaratiSubtitle}
        </motion.p>
      )}

      {/* Description */}
      {description && (
        <motion.p
          variants={childVariants}
          className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  )
}
