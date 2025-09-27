import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().maxLength(100),
    email: vine.string().email().toLowerCase().trim(),
    password: vine.string().maxLength(8),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().toLowerCase().trim(),
    password: vine.string(),
  })
)
