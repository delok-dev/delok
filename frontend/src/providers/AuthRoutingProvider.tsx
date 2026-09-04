// src/providers/AuthRoutingProvider.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { ROUTES } from "@/src/constants/routes";
import { STORAGE_KEYS } from "@/src/constants/storage";
import { authClient } from "@/src/lib/auth/auth-client";

export function AuthRoutingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (
      isPending ||
      !session?.user?.id ||
      pathname === ROUTES.ORGANIZATION.ROOT ||
      pathname.startsWith(`${ROUTES.ORGANIZATION.ROOT}/`) ||
      pathname === ROUTES.DOCS.ROOT ||
      pathname.startsWith(`${ROUTES.DOCS.ROOT}/`)
    ) {
      return;
    }

    const lastOrganizationSlug = window.localStorage.getItem(
      STORAGE_KEYS.LAST_ORGANIZATION_SLUG,
    );

    router.replace(
      lastOrganizationSlug
        ? ROUTES.ORGANIZATION.PROJECTS(lastOrganizationSlug)
        : ROUTES.ORGANIZATION.ROOT,
    );
  }, [isPending, pathname, router, session?.user?.id]);

  return children;
}
