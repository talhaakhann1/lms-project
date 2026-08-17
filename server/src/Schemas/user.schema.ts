import {z} from "zod"


export const signUpSchema=z.object({
    fullName:z.string().min(8,"fullName must be atleast 8 letters")
    .regex(
      /^[A-Za-z]+(?:[' -][A-Za-z]+)+$/,
      "Please enter a valid first and last name using only letters."
    ),
    email:z.string()
    .email({ message: "Invalid email address" })
    .regex(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please provide a valid email address",
    ),
    password:z.string().min(6,"Password must be atleast 6 letters"),
  }
)

export const signInSchema=z.object({
    email:z.string(),
    password:z.string(),
})

export const updateUserProfileSchema = z.object({
   fullName:z.string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(10, "Name must not exceed 10 characters").optional(),
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must not exceed 100 characters").optional(),

  bio: z
    .string()
    .trim()
    .min(10, "Bio must be at least 10 characters")
    .max(1000, "Bio must not exceed 1000 characters").optional(),
});