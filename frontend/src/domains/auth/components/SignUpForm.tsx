// src/domains/auth/components/SignUpForm.tsx
"use client";

import Link from "next/link";

import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";

import { ROUTES } from "@/src/constants/routes";

import AuthCard from "./AuthCard";
import AuthLayout from "./AuthLayout";
import SocialLogin from "./SocialLogin";
import { useSignUp } from "../hooks/useSignUp";

type SignUpFormProps = {
  /** Invoked after successful sign-up; the view owns navigation. */
  onSuccess?: () => void;
};

export default function SignUpForm({ onSuccess }: SignUpFormProps = {}) {
  const { form, submit } = useSignUp({ onSuccess });

  return (
    <AuthLayout>
      <AuthCard
        title="Start seeing your systems clearly"
        subtitle="Create your Delok account and start seeing your application activity in real time."
      >
        <form onSubmit={submit} className="space-y-4">
          {form.formState.errors.root && (
            <div className="rounded-md border border-danger bg-danger/10 p-3 text-danger">
              {form.formState.errors.root.message}
            </div>
          )}

          <Input
            id="name"
            label="Name"
            placeholder="Ada Lovelace"
            {...form.register("name")}
            error={form.formState.errors.name?.message}
          />

          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="ada@company.com"
            {...form.register("email")}
            error={form.formState.errors.email?.message}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="********"
            {...form.register("password")}
            error={form.formState.errors.password?.message}
          />

          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="********"
            {...form.register("confirmPassword")}
            error={form.formState.errors.confirmPassword?.message}
          />

          <Button className="w-full" loading={form.formState.isSubmitting}>
            Create Account
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
          Already have an account?{" "}
          <Link
            href={ROUTES.AUTH.SIGN_IN}
            className="text-primary hover:underline"
          >
            Sign In
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
