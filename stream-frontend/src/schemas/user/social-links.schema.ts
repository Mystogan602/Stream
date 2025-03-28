import { z } from 'zod';

export const socialLinksSchema = z.object({
    title: z.string().min(1),
    url: z.string().url()
})

export type TypeSocialLinksSchema = z.infer<typeof socialLinksSchema>