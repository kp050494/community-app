import { z } from 'zod'

// ─── Event Create Schema ─────────────────────────────────────────────────────

export const eventCreateSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Event name must be at least 3 characters')
      .max(200, 'Event name must not exceed 200 characters'),
    description: z
      .string()
      .max(2000, 'Description must not exceed 2000 characters')
      .optional()
      .nullable(),
    date: z.string().datetime({ offset: true }).or(z.string().date()),
    venue: z
      .string()
      .max(300, 'Venue must not exceed 300 characters')
      .optional()
      .nullable(),
    time: z
      .string()
      .max(50, 'Time must not exceed 50 characters')
      .optional()
      .nullable(),
    organizer: z
      .string()
      .max(200, 'Organizer must not exceed 200 characters')
      .optional()
      .nullable(),
    bannerUrl: z
      .string()
      .url('Enter a valid banner URL')
      .or(z.literal(''))
      .optional()
      .nullable(),
    isFeeRequired: z.boolean().default(false),
    feeAmount: z
      .number()
      .min(0, 'Fee amount must be a positive number')
      .optional()
      .nullable(),
    deadline: z
      .string()
      .datetime({ offset: true })
      .or(z.string().date())
      .or(z.literal(''))
      .optional()
      .nullable(),
    maxAttendees: z
      .number()
      .int()
      .min(1, 'Max attendees must be at least 1')
      .optional()
      .nullable(),
    status: z
      .enum(['DRAFT', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'])
      .default('DRAFT'),
  })
  .refine(
    (data) => {
      // If fee is required, feeAmount must be provided and > 0
      if (data.isFeeRequired) {
        return data.feeAmount != null && data.feeAmount > 0
      }
      return true
    },
    {
      message: 'Fee amount is required when fee is enabled',
      path: ['feeAmount'],
    }
  )

// ─── Event Update Schema ─────────────────────────────────────────────────────

export const eventUpdateSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Event name must be at least 3 characters')
      .max(200, 'Event name must not exceed 200 characters')
      .optional(),
    description: z
      .string()
      .max(2000, 'Description must not exceed 2000 characters')
      .optional()
      .nullable(),
    date: z
      .string()
      .datetime({ offset: true })
      .or(z.string().date())
      .optional(),
    venue: z
      .string()
      .max(300, 'Venue must not exceed 300 characters')
      .optional()
      .nullable(),
    time: z
      .string()
      .max(50, 'Time must not exceed 50 characters')
      .optional()
      .nullable(),
    organizer: z
      .string()
      .max(200, 'Organizer must not exceed 200 characters')
      .optional()
      .nullable(),
    bannerUrl: z
      .string()
      .url('Enter a valid banner URL')
      .or(z.literal(''))
      .optional()
      .nullable(),
    isFeeRequired: z.boolean().optional(),
    feeAmount: z
      .number()
      .min(0, 'Fee amount must be a positive number')
      .optional()
      .nullable(),
    deadline: z
      .string()
      .datetime({ offset: true })
      .or(z.string().date())
      .or(z.literal(''))
      .optional()
      .nullable(),
    maxAttendees: z
      .number()
      .int()
      .min(1, 'Max attendees must be at least 1')
      .optional()
      .nullable(),
    status: z
      .enum(['DRAFT', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'])
      .optional(),
  })
  .refine(
    (data) => {
      if (data.isFeeRequired === true) {
        return data.feeAmount != null && data.feeAmount > 0
      }
      return true
    },
    {
      message: 'Fee amount is required when fee is enabled',
      path: ['feeAmount'],
    }
  )

// ─── Inferred Types ──────────────────────────────────────────────────────────

export type EventCreateInput = z.infer<typeof eventCreateSchema>
export type EventUpdateInput = z.infer<typeof eventUpdateSchema>
