import { z } from 'zod';
export const createCategorySchema = z.object({
    name: z
        .string()
        .min(4, "Name must be 4 characters")
        .max(32, "Name must be 32 characters"),
});
export const updateCategorySchema = z.object({
    name: z
        .string()
        .min(4, "Name must be 4 characters")
        .max(32, "Name must be 32 characters"),
});
//# sourceMappingURL=category.schema.js.map