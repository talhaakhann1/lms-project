import { z } from "zod";
import { CourseLevels } from "../types/enums/course.enum";

export const createCourseSchema = z.object({
  title: z
    .string()
    .min(4, "title must be 4 characters")
    .max(64, "title must be 64 characters"),
  description: z
    .string()
    .min(4, "description must be 4 characters")
    .max(10000, "description must be 10000 characters"),

  tagline: z
    .string()
    .min(4, "tagline must be 4 characters")
    .max(10000, "tagline must be 10000 characters"),

  instructor: z.string().min(1, "Instructor is required"),
  level: z.enum(CourseLevels),
  price: z
  .number()
  .min(0, "Price cannot be negative"),
  learningOutcomes: z.string().min(1, "Learning outcomes are required"),
  requirements: z.string().min(1, "Requirements are required"),
 category: z
  .string()
  .trim()
  .min(1, "Category is required"),
  isPublished: z.boolean(),
  thumbnail: z
    .custom<File>((value) => value instanceof File, {
      message: "Thumbnail is required.",
    })
    .refine((file) => file.size > 0, { message: "Thumbnail is required." }),
});

export const updateCourseSchema = z.object({
  title: z
    .string()
    .min(4, "title must be 4 characters")
    .max(64, "title must be 64 characters")
    .optional(),
  description: z
    .string()
    .min(4, "description must be 4 characters")
    .max(10000, "description must be 10000 characters")
    .optional(),
     tagline: z
    .string()
    .min(4, "tagline must be 4 characters")
    .max(10000, "tagline must be 10000 characters").optional(),
  level: z.enum(CourseLevels).optional(),
  instructor: z.string().min(1, "Instructor is required").optional(),
 learningOutcomes: z.string().min(1, "Learning outcomes are required").optional(),
requirements: z.string().min(1, "Requirements are required").optional(),
  price: z
    .number()
    .positive("Price must be greater than zero")
    .optional(),
 category: z
  .string()
  .trim()
  .min(1, "Category is required").optional(),
  isPublished: z.boolean().optional(),
  thumbnail: z
  .instanceof(File)
  .optional(),
});
