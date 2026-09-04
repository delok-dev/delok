// src/domains/auth/hooks/useResetPassword.ts
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { resetPasswordSchema } from "../schemas/auth.schema";
import type { ResetPasswordForm } from "../types/auth.type";
import { AuthService } from "../api/auth.service";

type ResetPasswordErrors = Partial<Record<keyof ResetPasswordForm, string>>;

type UseResetPasswordOptions = {
  /**
   * Called after a successful password reset. Navigation (e.g. back to the
   * sign-in screen) is a screen-level decision owned by the calling view.
   */
  onSuccess?: () => void;
};

export function useResetPassword({ onSuccess }: UseResetPasswordOptions = {}) {
  const searchParam = useSearchParams();
  const token = searchParam.get("token");

  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      setIsLoading(true);
      setFormError("");
      setErrors({});

      const formData = new FormData(e.currentTarget);
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      const result = resetPasswordSchema.safeParse({
        password,
        confirmPassword,
      });

      if (!result.success) {
        const fieldErrors: ResetPasswordErrors = {};

        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof ResetPasswordErrors;
          fieldErrors[field] = issue.message;
        });

        setErrors(fieldErrors);
        return;
      }

      if (!token) {
        setFormError("Invalid reset link");
        return;
      }

      const { error } = await AuthService.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        if (error.status === 429) {
          setFormError("Too many requests. Please try again later.");
          return;
        }
        setFormError(error.message ?? "Unable to reset password.");
        return;
      }

      onSuccess?.();
    } catch (e) {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    token,
    errors,
    formError,
    isLoading,
    submit,
  };
}
