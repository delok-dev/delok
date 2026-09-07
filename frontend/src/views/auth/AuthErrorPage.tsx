// src/views/auth/AuthErrorPage.tsx
"use client";

import { Suspense } from "react";

import { AuthErrorCard } from "@/src/domains/auth";

export default function AuthErrorPage() {
  return (
    <Suspense fallback={null}>
      <AuthErrorCard />
    </Suspense>
  );
}
