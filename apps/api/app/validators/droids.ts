import vine from '@vinejs/vine'
import { DROID_TYPES, DROID_MAKERS } from '@repo/types'

/** Index */
export const droidsIndexSchema = vine.object({
  page: vine.number().withoutDecimals().positive().optional(),
  pageSize: vine.number().withoutDecimals().positive().max(100).optional(),
  q: vine.string().trim().minLength(1).optional(),
  type: vine.enum(DROID_TYPES).optional(),
  inStock: vine.boolean().optional(),
})

/** Create */
export const droidsCreateSchema = vine.object({
  name: vine.string().trim().minLength(2).maxLength(120),
  description: vine.string().trim().nullable().optional(),
  type: vine.enum(DROID_TYPES),
  maker: vine.enum(DROID_MAKERS),
  price: vine.number().min(0),
  stock: vine.number().withoutDecimals().min(0),
  imageUrl: vine.string().url().nullable().optional(),
})

/** Update */
export const droidsUpdateSchema = vine.object({
  name: vine.string().trim().minLength(2).maxLength(120).optional(),
  description: vine.string().trim().nullable().optional(),
  type: vine.enum(DROID_TYPES).optional(),
  maker: vine.enum(DROID_MAKERS).optional(),
  price: vine.number().min(0).optional(),
  stock: vine.number().withoutDecimals().min(0).optional(),
  imageUrl: vine.string().url().nullable().optional(),
})
