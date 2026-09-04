// src/views/auth/ResetPasswordPage.tsx
"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";

import Loader from "@/src/components/ui/Loader";
import { ResetPasswordForm } from "@/src/domains/auth";
import { ROUTES } from "@/src/constants/routes";

export default function ResetPasswordPage() {
  const router = useRouter();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader label="Loading reset password form" />
        </div>
      }
    >
      <ResetPasswordForm
        onSuccess={() => router.push(`${ROUTES.AUTH.SIGN_IN}?reset=success`)}
      />
    </Suspense>
  );
}
