// src/domains/organization/components/OrganizationEmptyState.tsx
import { Building2 } from "lucide-react";

import EmptyState from "@/src/components/ui/EmptyState";

export function OrganizationEmptyState() {
  return (
    <EmptyState
      icon={<Building2 className="h-6 w-6" />}
      title="No organizations yet"
      description="Create an organization to start managing your projects and logs."
    />
  );
}
