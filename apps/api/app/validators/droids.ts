import vine from '@vinejs/vine'
import { DROID_TYPES } from '@repo/types'

export const droidsIndexSchema = vine.object({
  page: vine.number().withoutDecimals().positive().optional(),
  pageSize: vine.number().withoutDecimals().positive().max(100).optional(),
  q: vine.string().trim().minLength(1).optional(),
  type: vine.enum(DROID_TYPES).optional(),
  inStock: vine.boolean().optional(),
})
