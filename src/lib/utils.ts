import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, differenceInYears, parseISO } from 'date-fns'

// ─── Tailwind Classname Merge ────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Currency Formatting ─────────────────────────────────────────────────────

/**
 * Formats a number as Indian Rupees (INR) with the ₹ symbol.
 * Uses the Indian numbering system (lakhs, crores).
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

// ─── Date Formatting ─────────────────────────────────────────────────────────

/**
 * Formats a date using the specified format string.
 * Defaults to "dd MMM yyyy" (e.g., "24 May 2025").
 */
export function formatDate(
  date: Date | string,
  formatStr: string = 'dd MMM yyyy'
): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return format(parsedDate, formatStr)
}

/**
 * Returns a human-readable relative time string (e.g., "2 hours ago").
 */
export function formatDateRelative(date: Date | string): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(parsedDate, { addSuffix: true })
}

// ─── Age & Eligibility ───────────────────────────────────────────────────────

/**
 * Calculates age in years from a date of birth.
 */
export function calculateAge(dob: Date | string): number {
  const parsedDate = typeof dob === 'string' ? parseISO(dob) : dob
  return differenceInYears(new Date(), parsedDate)
}

/**
 * Determines if a member is eligible for annual fee (age >= 18).
 */
export function isEligibleForFee(dob: Date | string): boolean {
  return calculateAge(dob) >= 18
}

// ─── ID Generation ───────────────────────────────────────────────────────────

/**
 * Generates a formatted member ID from a sequence number.
 * Example: 1 → "SKPM-0001", 42 → "SKPM-0042"
 */
export function generateMemberId(sequence: number): string {
  return `SKPM-${String(sequence).padStart(4, '0')}`
}

/**
 * Generates a formatted receipt number from year and sequence.
 * Example: (2025, 1) → "RCP-2025-0001"
 */
export function generateReceiptNumber(year: number, sequence: number): string {
  return `RCP-${year}-${String(sequence).padStart(4, '0')}`
}
