// src/domains/auth/hooks/useSignIn.ts
"use client";

import { useState } from "react";

import { signInSchema } from "../schemas/auth.schema";
import type { SignInForm } from "../types/auth.type";
import { AuthService } from "../api/auth.service";

type SignInErrors = Partial<Record<keyof SignInForm, string>>;

export function useSignIn() {
  const [errors, setErrors] = useState<SignInErrors>({});
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const signInGoogle = async () => {
    await AuthService.signInGoogle();
  };

  const signInGithub = async () => {
    await AuthService.signInGithub();
  };

  const submit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      setIsLoading(true);
      setFormError("");
      setErrors({});

      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const result = signInSchema.safeParse({ email, password });

      if (!result.success) {
        const fieldErrors: SignInErrors = {};

        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof SignInErrors;
          fieldErrors[field] = issue.message;
        });

        setErrors(fieldErrors);
        return;
      }

      const { error } = await AuthService.signIn({ email, password });

      if (error) {
        setFormError(error.message ?? "Unable to sign in.");
        return;
      }
    } catch (e) {
      console.error(e);
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    errors,
    formError,
    isLoading,
    submit,
    signInGoogle,
    signInGithub,
  };
}
