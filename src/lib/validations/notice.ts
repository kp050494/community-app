import { z } from 'zod'

// ─── Notice Create Schema ────────────────────────────────────────────────────

export const noticeCreateSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  attachmentUrl: z
    .string()
    .url('Enter a valid attachment URL')
    .optional()
    .nullable(),
  expiryDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().date())
    .optional()
    .nullable(),
  isVisible: z.boolean().default(true),
})

// ─── Notice Update Schema ────────────────────────────────────────────────────

export const noticeUpdateSchema = noticeCreateSchema.partial()

// ─── Inferred Types ──────────────────────────────────────────────────────────

export type NoticeCreateInput = z.infer<typeof noticeCreateSchema>
export type NoticeUpdateInput = z.infer<typeof noticeUpdateSchema>
