import { z } from "zod";

export const createLessonSchema = z.object({
  title: z
    .string()
    .min(4, "title must be 4 characters")
    .max(32, "description must be 32 characters"),
  description: z
    .string()
    .min(4, "title must be 4 characters")
    .max(10000, "description must be 10000 characters"),
  order: z.number().positive({ error: "lesson order must be positive" }),
  videUrls: z.array(z.string()),
});

export const updateLessonSchema = z.object({
  title: z
    .string()
    .min(4, "title must be 4 characters")
    .max(32, "title must be 64 characters")
    .optional(),
  description: z
    .string()
    .min(4, "title must be 4 characters")
    .max(10000, "description must be 10000 characters")
    .optional(),
  order: z
    .number()
    .positive({ error: "lesson order must be positive" })
    .optional(),
  videUrls: z.array(z.string()).optional(),
});
