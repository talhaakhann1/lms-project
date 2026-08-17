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
    .max(50000, "body must be 50000 characters"),
  instructor: z.string().min(1, "Instructor is required"),
  video: z
    .custom<File>((value) => value instanceof File, {
      message: "Video is required",
    })
    .refine((file) => file.size > 0, {
      message: "Video is required", 
    }),
  order: z.coerce.number().min(1).positive({ error: "lesson order must be positive" }),
  isPublished: z.boolean(),
});

export const updateLessonSchema = z.object({
  title: z
    .string()
    .min(4, "Title must be at least 4 characters")
    .max(128, "Title must not exceed 128 characters")
    .optional(),

  description: z
    .string()
    .min(4, "Description must be at least 4 characters")
    .max(300, "Description must not exceed 300 characters")
    .optional(),

  body: z
    .string()
    .min(4, "Body must be at least 4 characters")
    .max(50000, "Body must not exceed 50000 characters")
    .optional(),

  video: z
    .custom<File | undefined>(
      (value) => value === undefined || value instanceof File
    )
    .optional(),

  instructor: z.string().min(1, "Instructor is required"),

  order: z.coerce
    .number()
    .min(1, { error: "Lesson order must be at least 1" })
    .optional(),

  isPublished: z.boolean().optional(),
});