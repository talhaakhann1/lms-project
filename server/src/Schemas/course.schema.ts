import { z } from "zod";

export const createCourseSchema = z.object({
  title: z
    .string()
    .min(4, "title must be 4 characters")
    .max(32, "title must be 32 characters"),
  description: z
    .string()
    .min(4, "title must be 4 characters")
    .max(10000, "description must be 64 characters"),
     thumbnail:z.string(),
     price: z
    .number({ error: "Price is required" })
    .positive("Price must be greater than zero"),
    isPublished: z.boolean().optional(),
});

export const updateCourseSchema = z.object({
  title: z
    .string()
    .min(4, "title must be 4 characters")
    .max(32, "title must be 32 characters")
    .optional(),
  description: z
    .string()
    .min(4, "title must be 4 characters")
    .max(10000, "description must be 64 characters")
    .optional(),
     thumbnail:z.string()
     .optional(),
     price: z
    .number({ error: "Price is required" })
    .positive("Price must be greater than zero")
    .optional(),
});
