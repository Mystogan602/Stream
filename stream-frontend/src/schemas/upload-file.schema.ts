import { z } from 'zod';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const uploadFileSchema = z.object({
    file: z
        .union([
            z.instanceof(File).refine(file => file.size <= MAX_FILE_SIZE, {
                message: `File size must be less than or equal to ${MAX_FILE_SIZE / (1024 * 1024)}MB`
            }),
            z.string().transform(value => (value === '' ? undefined : value))
        ])
        .optional()
})

export type TypeUploadFileSchema = z.infer<typeof uploadFileSchema>