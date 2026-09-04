// src/domains/auth/hooks/useResendVerification.ts
"use client";

import { useEffect, useState } from "react";
import { z } from "zod";

import { AuthService } from "../api/auth.service";

const emailSchema = z.email();

export function useResendVerification() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const resendVerification = async () => {
    const result = emailSchema.safeParse(email);

    if (!result.success) {
      setFieldError("Please enter a valid email");
      return;
    }

    setFieldError(null);
    setLoading(true);

    try {
      const response = await AuthService.resendVerification({
        email: result.data,
      });

      if (response.ok) {
        setSuccess(true);
        setCountdown(60);
        return;
      }

      if (response.status === 429) {
        setFieldError(response.data?.message);
        return;
      }

      setFieldError("Something went wrong. Please try again.");
    } catch {
      setFieldError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    fieldError,
    setFieldError,
    loading,
    success,
    countdown,
    resendVerification,
  };
}
