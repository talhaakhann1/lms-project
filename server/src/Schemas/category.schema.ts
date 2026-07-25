import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(4, "Name must be 4 characters")
    .max(16, "Name must be 16 characters"),
    
  slug: z
    .string()
    .toLowerCase()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
});
