import { cn } from "@/lib/utils"

const statusConfig = {
  success: {
    bg: "bg-emerald-500/15 dark:bg-emerald-500/20",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    label: "Success",
  },
  paid: {
    bg: "bg-emerald-500/15 dark:bg-emerald-500/20",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    label: "Paid",
  },
  warning: {
    bg: "bg-amber-500/15 dark:bg-amber-500/20",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
    label: "Warning",
  },
  partial: {
    bg: "bg-amber-500/15 dark:bg-amber-500/20",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
    label: "Partial",
  },
  error: {
    bg: "bg-red-500/15 dark:bg-red-500/20",
    text: "text-red-700 dark:text-red-400",
    dot: "bg-red-500",
    label: "Error",
  },
  overdue: {
    bg: "bg-red-500/15 dark:bg-red-500/20",
    text: "text-red-700 dark:text-red-400",
    dot: "bg-red-500",
    label: "Overdue",
  },
  info: {
    bg: "bg-blue-500/15 dark:bg-blue-500/20",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
    label: "Info",
  },
  pending: {
    bg: "bg-blue-500/15 dark:bg-blue-500/20",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
    label: "Pending",
  },
} as const

export type StatusType = keyof typeof statusConfig

export interface StatusBadgeProps {
  status: StatusType
  size?: "sm" | "md"
  className?: string
}

export function StatusBadge({
  status,
  size = "md",
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        config.bg,
        config.text,
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      {/* Pulsing dot */}
      <span className="relative flex h-1.5 w-1.5">
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
            config.dot
          )}
        />
        <span
          className={cn(
            "relative inline-flex h-1.5 w-1.5 rounded-full",
            config.dot
          )}
        />
      </span>
      {config.label}
    </span>
  )
}
