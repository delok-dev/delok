// src/views/orgs/OrganizationsLayout.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/src/lib/auth/auth-client";
import { ROUTES } from "@/src/constants/routes";

import OrganizationsLoading from "@/src/views/orgs/components/OrganizationsLoading";

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
    return <OrganizationsLoading />;
  }

  return children;
}
