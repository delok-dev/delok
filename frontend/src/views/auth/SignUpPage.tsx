// src/views/auth/SignUpPage.tsx
"use client";

import { useRouter } from "next/navigation";

import SignUpForm from "@/src/domains/auth/components/SignUpForm";
import { ROUTES } from "@/src/constants/routes";

export default function SignUpPage() {
  const router = useRouter();

  return (
    <SignUpForm
      onSuccess={() => router.push(ROUTES.AUTH.VERIFY_EMAIL)}
    />
  );
}
