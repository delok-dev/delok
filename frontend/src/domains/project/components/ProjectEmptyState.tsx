// src/domains/project/components/ProjectEmptyState.tsx
import { FolderKanban } from "lucide-react";

import EmptyState from "@/src/components/ui/EmptyState";

export function ProjectEmptyState() {
  return (
    <EmptyState
      icon={<FolderKanban className="h-6 w-6" />}
      title="No projects yet"
      description="Get started by creating your first project."
      bare={true}
    />
  );
}
