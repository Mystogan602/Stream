import { z } from 'zod'

export const changeInfoSchema = z.object({
    username: z
        .string()
        .min(1, { message: "Username is required" })
        .regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/, { message: "Username must contain only letters, numbers, and single hyphens" }),
    displayName: z
        .string()
        .min(1, { message: "Display name is required" }),
    bio: z
        .string()
        .max(300, { message: "Bio must not exceed 300 characters" })
})

export type TypeChangeInfoSchema = z.infer<typeof changeInfoSchema>