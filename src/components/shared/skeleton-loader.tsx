import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  Base skeleton block                                                       */
/* -------------------------------------------------------------------------- */

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      aria-hidden="true"
    />
  )
}

/* -------------------------------------------------------------------------- */
/*  SkeletonCard                                                              */
/* -------------------------------------------------------------------------- */

export interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4",
        className
      )}
    >
      {/* Image placeholder */}
      <Skeleton className="h-40 w-full rounded-xl" />
      {/* Title */}
      <Skeleton className="h-5 w-3/4" />
      {/* Subtitle */}
      <Skeleton className="h-4 w-1/2" />
      {/* Body lines */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  SkeletonTable                                                             */
/* -------------------------------------------------------------------------- */

export interface SkeletonTableProps {
  rows?: number
  className?: string
}

export function SkeletonTable({ rows = 5, className }: SkeletonTableProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header row */}
      <div className="flex items-center gap-4 px-4 py-3">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24 ml-auto" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3 rounded-lg border border-white/5"
        >
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20 ml-auto" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  SkeletonText                                                              */
/* -------------------------------------------------------------------------- */

export interface SkeletonTextProps {
  lines?: number
  className?: string
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  const widths = ["w-full", "w-5/6", "w-4/6", "w-3/4", "w-2/3"]

  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3.5", widths[i % widths.length])}
        />
      ))}
    </div>
  )
}
