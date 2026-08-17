import { z } from "zod";

export const createReviewSchema = z.object({
  comment: z
    .string()
    .min(4, "comment must be 4 characters")
    .max(754  , "comment must be 754   characters"),
});

export const updateReviewSchema = z.object({
  comment: z
    .string()
    .min(4, "comment must be 4 characters")
    .max(754, "comment must be 754 characters"),
});
