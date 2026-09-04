// src/domains/auth/components/SignInForm.tsx
"use client";

import Link from "next/link";

import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";

import { ROUTES } from "@/src/constants/routes";

import AuthCard from "./AuthCard";
import AuthLayout from "./AuthLayout";
import SocialLogin from "./SocialLogin";
import { useSignIn } from "../hooks/useSignIn";

export default function SignInForm() {
  const { errors, formError, isLoading, submit } = useSignIn();

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back!"
        subtitle="Continue monitoring your systems with Delok."
      >
        <form onSubmit={submit} className="space-y-4">
          {formError && (
            <div className="rounded-md border border-danger bg-danger/10 p-3 text-sm text-danger">
              {formError}
            </div>
          )}

          <Input
            id="email"
            label="Email"
            name="email"
            type="email"
            placeholder="you@company.com"
            error={errors.email}
          />

          <Input
            id="password"
            label="Password"
            name="password"
            type="password"
            placeholder="********"
            error={errors.password}
          />

          <div className="flex items-center justify-end">
            <Link
              href={ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-sm text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <Button type="submit" className="w-full" loading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <SocialLogin />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={ROUTES.AUTH.SIGN_UP}
            className="text-primary hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
