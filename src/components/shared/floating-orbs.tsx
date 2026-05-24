"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface OrbConfig {
  color: string
  size: string
  position: string
  duration: string
  opacity: string
  blur: string
  delay?: string
}

const orbPresets: Record<string, OrbConfig[]> = {
  gold: [
    {
      color: "bg-[#D4A853]",
      size: "h-72 w-72",
      position: "-top-20 -right-20",
      duration: "15s",
      opacity: "opacity-[0.18]",
      blur: "blur-[100px]",
    },
    {
      color: "bg-[#D4A853]",
      size: "h-56 w-56",
      position: "bottom-10 -left-16",
      duration: "20s",
      opacity: "opacity-[0.15]",
      blur: "blur-[90px]",
      delay: "3s",
    },
    {
      color: "bg-[#b8922e]",
      size: "h-48 w-48",
      position: "top-1/3 right-1/4",
      duration: "25s",
      opacity: "opacity-[0.12]",
      blur: "blur-[80px]",
      delay: "6s",
    },
  ],
  teal: [
    {
      color: "bg-[#2DD4BF]",
      size: "h-72 w-72",
      position: "-top-20 -left-20",
      duration: "15s",
      opacity: "opacity-[0.18]",
      blur: "blur-[100px]",
    },
    {
      color: "bg-[#2DD4BF]",
      size: "h-56 w-56",
      position: "bottom-10 -right-16",
      duration: "20s",
      opacity: "opacity-[0.15]",
      blur: "blur-[90px]",
      delay: "3s",
    },
    {
      color: "bg-[#14b8a6]",
      size: "h-48 w-48",
      position: "top-1/2 left-1/3",
      duration: "25s",
      opacity: "opacity-[0.12]",
      blur: "blur-[80px]",
      delay: "6s",
    },
  ],
  mixed: [
    {
      color: "bg-[#D4A853]",
      size: "h-72 w-72",
      position: "-top-20 -right-20",
      duration: "15s",
      opacity: "opacity-[0.20]",
      blur: "blur-[100px]",
    },
    {
      color: "bg-[#2DD4BF]",
      size: "h-64 w-64",
      position: "-bottom-24 -left-24",
      duration: "20s",
      opacity: "opacity-[0.18]",
      blur: "blur-[110px]",
      delay: "4s",
    },
    {
      color: "bg-[#1e3a5f]",
      size: "h-56 w-56",
      position: "top-1/3 left-1/2",
      duration: "25s",
      opacity: "opacity-[0.25]",
      blur: "blur-[90px]",
      delay: "2s",
    },
    {
      color: "bg-[#D4A853]",
      size: "h-40 w-40",
      position: "bottom-1/4 right-1/4",
      duration: "18s",
      opacity: "opacity-[0.12]",
      blur: "blur-[80px]",
      delay: "7s",
    },
  ],
}

export interface FloatingOrbsProps {
  variant?: "gold" | "teal" | "mixed"
  className?: string
}

export function FloatingOrbs({
  variant = "mixed",
  className,
}: FloatingOrbsProps) {
  const orbs = orbPresets[variant]

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={cn(
            "absolute rounded-full",
            orb.color,
            orb.size,
            orb.position,
            orb.opacity,
            orb.blur
          )}
          style={{
            animation: `floatingOrb ${orb.duration} ease-in-out infinite`,
            animationDelay: orb.delay ?? "0s",
          }}
        />
      ))}

      <style jsx>{`
        @keyframes floatingOrb {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -30px) scale(1.05);
          }
          50% {
            transform: translate(-15px, 15px) scale(0.95);
          }
          75% {
            transform: translate(25px, 10px) scale(1.02);
          }
        }
      `}</style>
    </div>
  )
}
