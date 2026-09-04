// src/components/landing/HomeGate.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { ROUTES } from "@/src/constants/routes";
import { STORAGE_KEYS } from "@/src/constants/storage";
import { authClient } from "@/src/lib/auth/auth-client";

export function HomeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending || !session?.user?.id) return;
    if (pathname !== ROUTES.HOME) return;

    const lastOrganizationSlug = window.localStorage.getItem(
      STORAGE_KEYS.LAST_ORGANIZATION_SLUG,
    );

    router.replace(
      lastOrganizationSlug
        ? ROUTES.ORGANIZATION.PROJECTS(lastOrganizationSlug)
        : ROUTES.ORGANIZATION.ROOT,
    );
  }, [isPending, pathname, router, session?.user?.id]);

  if (isPending) {
    return null;
  }

  if (session?.user?.id) {
    return null;
  }

  return children;
}
