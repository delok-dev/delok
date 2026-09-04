// src/views/orgs/OrganizationsPage.tsx
"use client";

import { useOrganizations } from "@/src/domains/organization";

import OrganizationsShell from "./components/OrganizationsShell";
import OrganizationsWelcome from "./components/OrganizationsWelcome";
import OrganizationsOverview from "./components/OrganizationsOverview";
import { authClient } from "@/src/lib/auth/auth-client";

export default function OrganizationsPage() {
  const { data } = authClient.useSession();
  const name = data?.user.name;
  const { organizations, isLoading } = useOrganizations();

  return (
    <OrganizationsShell>
      <OrganizationsWelcome name={name} />
      <OrganizationsOverview
        organizations={organizations}
        isLoading={isLoading}
      />
    </OrganizationsShell>
  );
}
