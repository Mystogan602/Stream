import { z } from 'zod';
export const changeStreamInfoSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    categoryId: z.string().min(1, 'Category is required')
});

export type TypeChangeStreamInfoSchema = z.infer<typeof changeStreamInfoSchema>;