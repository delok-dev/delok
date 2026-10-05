// src/views/orgs/OrganizationsLayout.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/src/lib/auth/auth-client";
import { ROUTES } from "@/src/constants/routes";

import Loader from "@/src/components/ui/Loader";

export default function OrganizationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace(ROUTES.AUTH.SIGN_IN);
    }
  }, [isPending, session, router]);

  if (!session) {
    return null;
  }
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader label="Loading organizations" />
      </div>
    );
  }

  return children;
}