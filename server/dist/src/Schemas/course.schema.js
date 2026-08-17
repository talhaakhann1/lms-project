import { z } from "zod";
import { CourseLevels } from "../types/course.enum.js";
export const createCourseSchema = z.object({
    title: z
        .string()
        .min(4, "title must be 4 characters")
        .max(64, "title must be 32 characters"),
    description: z
        .string()
        .min(4, "description must be 4 characters")
        .max(10000, "description must be 10000 characters"),
    tagline: z
        .string()
        .min(4, "tagline must be 4 characters")
        .max(10000, "tagline must be 10000 characters"),
    level: z.enum(CourseLevels),
    instructor: z.string().min(1, "Instructor is required"),
    learningOutcomes: z.string().min(1, "Learning outcomes are required"),
    requirements: z.string().min(1, "Requirements are required"),
    price: z.coerce.number().positive("Price must be greater than zero"),
    category: z
        .string()
        .trim()
        .min(1, "Category is required")
        .optional(),
    isPublished: z.coerce.boolean(),
});
export const updateCourseSchema = z.object({
    title: z
        .string()
        .min(4, "title must be 4 characters")
        .max(64, "title must be 32 characters")
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
    price: z.coerce
        .number()
        .positive("Price must be greater than zero")
        .optional(),
    category: z
        .string()
        .trim()
        .min(1, "Category is required")
        .optional(),
    isPublished: z.coerce.boolean().optional(),
});
//# sourceMappingURL=course.schema.js.map