// src/domains/auth/components/ForgotPasswordForm.tsx
"use client";

import Link from "next/link";

import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";

import { ROUTES } from "@/src/constants/routes";

import AuthCard from "./AuthCard";
import AuthLayout from "./AuthLayout";
import { useForgotPassword } from "../hooks/useForgotPassword";

export default function ForgotPasswordForm() {
  const {
    email,
    setEmail,
    sent,
    countdown,
    loading,
    errors,
    formError,
    submit,
  } = useForgotPassword();

  return (
    <AuthLayout>
      <AuthCard
        title="Reset your password"
        subtitle="Enter your email and we'll send you a link to get back into Delok."
      >
        {sent && (
          <div className="mb-4 rounded-md bg-success/10 p-3 text-sm text-success">
            Check your email for instructions to reset your password.
          </div>
        )}

        {formError && (
          <div className="mb-4 rounded-md border border-danger bg-danger/10 p-3 text-sm text-danger">
            {formError}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            error={errors.email}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={loading || countdown > 0 || sent}
          >
            {loading
              ? "Sending..."
              : countdown > 0
                ? `Resend in ${countdown}s`
                : "Send Reset Link"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Remembered your password?{" "}
          <Link
            href={ROUTES.AUTH.SIGN_IN}
            className="text-primary hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
