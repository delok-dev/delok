// src/domains/auth/hooks/useForgotPassword.ts
"use client";

import { useEffect, useState } from "react";
import { z } from "zod";

import { forgotPasswordSchema } from "../schemas/auth.schema";
import { AuthService } from "../api/auth.service";

type ForgotPasswordErrors = Partial<
  Record<keyof z.infer<typeof forgotPasswordSchema>, string>
>;

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const submit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading || countdown > 0) return;

    setLoading(true);
    setFormError(null);
    setErrors({});

    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      const fieldErrors: ForgotPasswordErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ForgotPasswordErrors;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const { error } = await AuthService.requestPasswordReset({
        email: result.data.email,
      });

      if (error?.status === 429) {
        setFormError("Too many requests. Please try again later.");
        return;
      }

      if (error) {
        setFormError(
          error.message ?? "Something went wrong. Please try again.",
        );
        return;
      }

      setSent(true);
      setCountdown(60);
    } catch (error) {
      console.error(error);
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    sent,
    countdown,
    loading,
    errors,
    formError,
    submit,
  };
}
