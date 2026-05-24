import { z } from 'zod'

// ─── Annual Fee Payment Schema ───────────────────────────────────────────────

export const annualFeePaymentSchema = z.object({
  memberId: z.string().cuid('Invalid member ID'),
  planId: z.string().cuid('Invalid plan ID'),
  year: z
    .number()
    .int()
    .min(2000, 'Year must be 2000 or later')
    .max(2100, 'Year must be 2100 or earlier'),
  dueAmount: z.number().min(0, 'Due amount must be a positive number'),
  paidAmount: z.number().min(0, 'Paid amount must be a positive number'),
  pendingAmount: z.number().min(0, 'Pending amount must be a positive number'),
  status: z.enum(['PAID', 'PENDING', 'PARTIAL', 'OVERDUE']).default('PENDING'),
  paidDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().date())
    .optional()
    .nullable(),
  paymentMode: z
    .enum(['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'ONLINE', 'OTHER'])
    .optional()
    .nullable(),
  receiptNumber: z
    .string()
    .max(50, 'Receipt number must not exceed 50 characters')
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(500, 'Notes must not exceed 500 characters')
    .optional()
    .nullable(),
})

// ─── Event Payment Schema ────────────────────────────────────────────────────

export const eventPaymentSchema = z.object({
  eventId: z.string().cuid('Invalid event ID'),
  memberId: z.string().cuid('Invalid member ID'),
  amountDue: z.number().min(0, 'Amount due must be a positive number'),
  amountPaid: z.number().min(0, 'Amount paid must be a positive number'),
  pendingAmount: z.number().min(0, 'Pending amount must be a positive number'),
  transactionRef: z
    .string()
    .max(100, 'Transaction reference must not exceed 100 characters')
    .optional()
    .nullable(),
  paymentDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().date())
    .optional()
    .nullable(),
  paymentMode: z
    .enum(['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'ONLINE', 'OTHER'])
    .optional()
    .nullable(),
  status: z.enum(['PAID', 'PENDING', 'PARTIAL', 'OVERDUE']).default('PENDING'),
})

// ─── Contact Form Schema ────────────────────────────────────────────────────

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number')
    .optional()
    .nullable(),
  email: z.string().email('Enter a valid email address').optional().nullable(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must not exceed 2000 characters'),
})

// ─── Login Schema ────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must not exceed 128 characters'),
})

// ─── Inferred Types ──────────────────────────────────────────────────────────

export type AnnualFeePaymentInput = z.infer<typeof annualFeePaymentSchema>
export type EventPaymentInput = z.infer<typeof eventPaymentSchema>
export type ContactFormInput = z.infer<typeof contactFormSchema>
export type LoginInput = z.infer<typeof loginSchema>
