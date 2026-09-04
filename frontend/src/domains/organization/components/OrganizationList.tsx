// src/domains/organization/components/OrganizationList.tsx
import type { Organization } from "../types/organization.type";
import { OrganizationCard } from "./OrganizationCard";

type OrganizationListProps = {
  organizations: Organization[];
};

export function OrganizationList({ organizations }: OrganizationListProps) {
  return (
    <div className="flex flex-col max-h-60 overflow-scroll gap-2">
      {organizations.map((organization) => (
        <OrganizationCard key={organization.id} organization={organization} />
      ))}
    </div>
  );
}
