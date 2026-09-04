// src/views/auth/AuthErrorPage.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { AuthErrorCard, ResendVerificationForm } from "@/src/domains/auth";

function AuthErrorContent() {
  const params = useSearchParams();

  const error = params.get("error");

  if (error === "account_not_linked") {
    return <ResendVerificationForm />;
  }

  return <AuthErrorCard />;
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={null}>
      <AuthErrorContent />
    </Suspense>
  );
}
