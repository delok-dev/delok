// src/domains/auth/types/auth.type.ts
import { z } from "zod";
import { signUpSchema } from "../schemas/sign-up.schema";
import { signInSchema, resetPasswordSchema } from "../schemas/auth.schema";

export type SignUpForm = z.infer<typeof signUpSchema>;

export type SignInForm = z.infer<typeof signInSchema>;

export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
