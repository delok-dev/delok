// src/domains/log-explorer/components/LogExplorer.tsx
"use client";

import { ROUTES } from "@/src/constants/routes";

import { useLogExplorer } from "../hooks/useLogExplorer";

import { LogsPanel } from "./LogsPanel";

type LogExplorerProps = {
  organizationSlug: string;
  projectId: string;
};

export function LogExplorer({
  organizationSlug,
  projectId,
}: LogExplorerProps) {
  const {
    logs,
    pagination,
    page,
    isLoading,
    selectedLog,
    filters,
    hasActiveFilters,
    limit,
    setPage,
    setFilter,
    clearFilters,
    setLimit,
    selectLog,
    closeLogDetail,
  } = useLogExplorer({ projectId });

  // Where users manage API keys for this project (linked from the empty state
  // when the project has never received a log).
  const settingsUrl = `${ROUTES.ORGANIZATION.PROJECT_SETTINGS(
    organizationSlug,
    projectId,
  )}#api-keys`;

  return (
    <div className="min-h-0 flex-1 pb-10">
      <LogsPanel
        data={{
          logs,
          pagination,
          isLoading,
          page,
          selectedLog,
          filters,
          hasActiveFilters,
          limit,
        }}
        actions={{
          onPageChange: setPage,
          onSelectLog: selectLog,
          onCloseDetail: closeLogDetail,
          onFilterChange: setFilter,
          onClearFilters: clearFilters,
          onLimitChange: setLimit,
        }}
        settingsUrl={settingsUrl}
      />
    </div>
  );
}
