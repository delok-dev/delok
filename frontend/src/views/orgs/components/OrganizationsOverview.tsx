// src/views/orgs/components/OrganizationsOverview.tsx
import {
  GetStartedSection,
  OrganizationsPanel,
} from "@/src/domains/organization";

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
      <GetStartedSection />

      <OrganizationsPanel organizations={organizations} isLoading={isLoading} />
    </section>
  );
}
