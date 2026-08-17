import { z } from "zod";
import { UserRoles } from "../types/enums/user.enum";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  avatar: {
    url: string;
    localPath?: string;
  };
  role: string;
  isActive: boolean;
}

export const changeRoleSchema = z.object({
  role: z.enum(UserRoles, {
    error: "Role is required",
  }),
});
export const changeAvatarSchema = z.object({
  avatar: z
    .instanceof(File, { message: "Avatar is required" })
    .refine((file) => file.size > 0, {
      message: "Avatar is required",
    }),
});


export const signUpSchema = z.object({
  fullName: z
    .string()
    .min(8, "fullName must be atleast 8 letters")
    .regex(
      /^[A-Za-z]+(?:[' -][A-Za-z]+)+$/,
      "Please enter a valid first and last name using only letters.",
    ),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .regex(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please provide a valid email address",
    ),
  password: z.string().min(6, "Password must be atleast 6 letters"),
  terms: z.boolean(),
});

export const signInSchema = z.object({
  email: z.string(),
  password: z.string(),
  rememberMe: z.boolean(),
});



export const updateUserProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .optional(),

  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must not exceed 100 characters")
    .optional(),

  bio: z
    .string()
    .trim()
    .min(10, "Bio must be at least 10 characters")
    .max(1000, "Bio must not exceed 1000 characters")
    .optional(),

  avatar: z.instanceof(File).nullable().optional(),
});