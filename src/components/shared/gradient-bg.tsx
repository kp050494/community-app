"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface GradientBgProps {
  className?: string
  children?: React.ReactNode
}

export function GradientBg({ className, children }: GradientBgProps) {
  return (
    <section className={cn("relative overflow-hidden", className)}>
      {/* Animated gradient base */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#111827] to-[#0d1321] animate-[gradientShift_12s_ease_infinite]"
        style={{
          backgroundSize: "200% 200%",
        }}
      />

      {/* Gold orb */}
      <div
        className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#D4A853]/15 blur-[120px] animate-[float_15s_ease-in-out_infinite]"
        aria-hidden="true"
      />

      {/* Teal orb */}
      <div
        className="absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-[#2DD4BF]/12 blur-[140px] animate-[float_20s_ease-in-out_infinite_reverse]"
        aria-hidden="true"
      />

      {/* Navy accent orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-[#1e3a5f]/20 blur-[100px] animate-[float_25s_ease-in-out_infinite]"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(30px, -30px);
          }
          66% {
            transform: translate(-20px, 20px);
          }
        }
      `}</style>
    </section>
  )
}
