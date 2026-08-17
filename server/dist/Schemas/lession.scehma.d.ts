import { z } from "zod";
export declare const createLessonSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    body: z.ZodString;
    instructor: z.ZodString;
    order: z.ZodCoercedNumber<unknown>;
    isPublished: z.ZodCoercedBoolean<unknown>;
}, z.core.$strip>;
export declare const updateLessonSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    body: z.ZodOptional<z.ZodString>;
    instructor: z.ZodOptional<z.ZodString>;
    order: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    isPublished: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
}, z.core.$strip>;
//# sourceMappingURL=lession.scehma.d.ts.map