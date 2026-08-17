import { z } from "zod";
export declare const signUpSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const signInSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const updateUserProfileSchema: z.ZodObject<{
    fullName: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=user.schema.d.ts.map