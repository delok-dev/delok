// src/views/orgs/organization/OrganizationLayout.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { Sidebar } from "@/src/components/layout/sidebar";
import { Topbar } from "@/src/components/layout/topbar";
import Loader from "@/src/components/ui/Loader";

import { useOrganization } from "@/src/domains/organization";
import { STORAGE_KEYS } from "@/src/constants/storage";
import { ROUTES } from "@/src/constants/routes";

type Props = {
  children: ReactNode;
};

export default function OrganizationLayout({ children }: Props) {
  const router = useRouter();
  const params = useParams<{
    organizationSlug: string;
  }>();

  const organizationSlug = params.organizationSlug;

  const { organization, isPending, isError } =
    useOrganization(organizationSlug);

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (!isError && organization) {
      window.localStorage.setItem(
        STORAGE_KEYS.LAST_ORGANIZATION_SLUG,
        organizationSlug,
      );
      return;
    }

    if (
      window.localStorage.getItem(STORAGE_KEYS.LAST_ORGANIZATION_SLUG) ===
      organizationSlug
    ) {
      window.localStorage.removeItem(STORAGE_KEYS.LAST_ORGANIZATION_SLUG);
      router.replace(ROUTES.ORGANIZATION.ROOT);
    }
  }, [isError, isPending, organization, organizationSlug, router]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader label="Loading organization" />
      </div>
    );
  }

  if (isError || !organization) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Organization not found
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar organizationSlug={organizationSlug} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          organizationSlug={organizationSlug}
          organizationName={organization.name}
        />

        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
