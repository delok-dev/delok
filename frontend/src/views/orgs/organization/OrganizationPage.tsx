// src/views/orgs/organization/OrganizationPage.tsx
"use client";

import { ROUTES } from "@/src/constants/routes";
import Link from "next/link";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams<{ organizationSlug: string }>();
  const organizationSlug = params.organizationSlug;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
      <p className="text-sm font-medium text-foreground">Organization overview</p>
      <p className="text-xs text-muted-foreground">
        This page is under development :)
      </p>
      <Link
        href={ROUTES.ORGANIZATION.PROJECTS(organizationSlug)}
        className="underline text-blue-500"
      >
        Go to projects page
      </Link>
    </div>
  );
};

export default Page;
