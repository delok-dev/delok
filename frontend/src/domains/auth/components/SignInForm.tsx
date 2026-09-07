// src/domains/auth/components/SignInForm.tsx
"use client";

import AuthCard from "./AuthCard";
import AuthLayout from "./AuthLayout";
import SocialLogin from "./SocialLogin";

export default function SignInForm() {
  return (
    <AuthLayout>
      <AuthCard
        title="Sign in to Delok"
        subtitle="Continue with your Google or GitHub account."
      >
        <SocialLogin />
      </AuthCard>
    </AuthLayout>
  );
}
