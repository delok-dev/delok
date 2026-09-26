// src/views/orgs/OrganizationsPage.tsx
"use client";

import { useOrganizations } from "@/src/domains/organization";

import OrganizationsShell from "./components/OrganizationsShell";
import OrganizationsOverview from "./components/OrganizationsOverview";
import { authClient } from "@/src/lib/auth/auth-client";

export default function OrganizationsPage() {
  const { data } = authClient.useSession();
  const name = data?.user.name;
  const { organizations, isLoading } = useOrganizations();

  return (
    <OrganizationsShell>
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Hello, <span className="text-primary">{name?.split(" ")[0] ?? "there"}</span>
        </h1>

        <p className="mt-1 text-lg text-muted-foreground">
          Let's get your organization set up.
        </p>
      </header>
      <OrganizationsOverview
        organizations={organizations}
        isLoading={isLoading}
      />
    </OrganizationsShell>
  );
}