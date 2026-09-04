// src/domains/auth/hooks/useSignUp.ts
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { signUpSchema } from "../schemas/sign-up.schema";
import type { SignUpForm } from "../types/auth.type";
import { AuthService } from "../api/auth.service";

type UseSignUpOptions = {
  /**
   * Called after a successful sign-up. Navigation (e.g. to the verify-email
   * screen) is a screen-level decision owned by the calling view.
   */
  onSuccess?: () => void;
};

export function useSignUp({ onSuccess }: UseSignUpOptions = {}) {
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const submit = form.handleSubmit(async (values) => {
    const response = await AuthService.signUp({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (response.error) {
      form.setError("root", {
        message: response.error.message,
      });

      return;
    }

    onSuccess?.();
  });

  return {
    form,
    submit,
  };
}
