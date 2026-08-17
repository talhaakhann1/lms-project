import { z } from "zod";

export const createLessonSchema = z.object({
  title: z
    .string()
    .min(4, "title must be 4 characters")
    .max(128, "title must be 128 characters"),
  description: z
    .string()
    .min(4, "description must be 4 characters")
    .max(300, "description must be 300 characters"),
  body: z
    .string()
    .min(4, "body must be 4 characters")
    .max(50000, "body must be 50,000 characters"),
    instructor: z.string().min(1, "Instructor is required"),
  order: z.coerce
  .number()
  .positive({ error: "lesson order must be positive" }),
  isPublished:z.coerce.boolean()
});

export const updateLessonSchema = z.object({
  title: z
    .string()
    .min(4, "title must be 4 characters")
    .max(128, "title must be 128 characters")
    .optional(),
  description: z
    .string()
    .min(4, "description must be 4 characters")
    .max(300, "description must be 300 characters")
    .optional(),
  body: z
    .string()
    .min(4, "body must be 4 characters")
    .max(50000, "body must be 50,000 characters")
    .optional(),
     instructor: z.string().min(1, "Instructor is required").optional(),
  order: z.coerce
    .number()
    .positive({ error: "lesson order must be positive" })
    .optional(),
     isPublished:z.coerce.boolean().optional()
});
