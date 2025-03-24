import { z } from 'zod'

export const loginSchema = z.object({
  login: z.string().min(3),
  password: z.string().min(8),
  pin: z.string().min(6).optional()
})

export type TypeLoginSchema = z.infer<typeof loginSchema>