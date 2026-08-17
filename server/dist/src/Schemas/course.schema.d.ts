import { z } from "zod";
import { CourseLevels } from "../types/course.enum.js";
export declare const createCourseSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    tagline: z.ZodString;
    level: z.ZodEnum<typeof CourseLevels>;
    instructor: z.ZodString;
    learningOutcomes: z.ZodString;
    requirements: z.ZodString;
    price: z.ZodCoercedNumber<unknown>;
    category: z.ZodOptional<z.ZodString>;
    isPublished: z.ZodCoercedBoolean<unknown>;
}, z.core.$strip>;
export declare const updateCourseSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    tagline: z.ZodOptional<z.ZodString>;
    level: z.ZodOptional<z.ZodEnum<typeof CourseLevels>>;
    instructor: z.ZodOptional<z.ZodString>;
    learningOutcomes: z.ZodOptional<z.ZodString>;
    requirements: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    category: z.ZodOptional<z.ZodString>;
    isPublished: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
}, z.core.$strip>;
//# sourceMappingURL=course.schema.d.ts.map