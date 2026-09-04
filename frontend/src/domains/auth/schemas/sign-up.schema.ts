// src/domains/auth/schemas/sign-up.schema.ts
import { z } from "zod";
import { passwordSchema } from "./auth.schema";

export const signUpSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 character"),
    email: z.email("Invalid email"),
    password: passwordSchema,
    confirmPassword: z.string().min(8, "Password must be at least 8 character"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
