// src/views/orgs/components/OrganizationsOverview.tsx
import { CreateOrganizationPrompt } from "@/src/views/orgs/components/CreateOrganizationPrompt";
import { OrganizationsPanel } from "@/src/domains/organization/components/OrganizationsPanel";

import type { Organization } from "@/src/domains/organization";

type OrganizationsOverviewProps = {
  organizations: Organization[];
  isLoading: boolean;
};

export default function OrganizationsOverview({
  organizations,
  isLoading,
}: OrganizationsOverviewProps) {
  return (
    <section className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,320px)_1fr]">
      <CreateOrganizationPrompt />

      <OrganizationsPanel organizations={organizations} isLoading={isLoading} />
    </section>
  );
}