// src/domains/project/hooks/useProjectsRealtime.ts
"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { websocketManager } from "@/src/lib/websocket/websocket";

type UseProjectsRealtimeOptions = {
  organizationSlug: string | undefined;
  projectIds: string[];
};

type ProjectCache = {
  id: string;
  logCount?: number;
  [key: string]: unknown;
};

/**
 * Subscribes to the visible projects and updates their log counts in the
 * React Query cache when `project.log_count.updated` events arrive.
 *
 * The WebSocket connection itself is owned by the shared WebSocket manager
 * (initialized by SocketProvider); this hook only manages subscriptions and
 * the domain-specific event handling.
 */
export function useProjectsRealtime({
  organizationSlug,
  projectIds,
}: UseProjectsRealtimeOptions) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!organizationSlug || projectIds.length === 0) {
      return;
    }

    for (const projectId of projectIds) {
      websocketManager.subscribe(projectId);
    }

    const removeListener = websocketManager.on(
      "project.log_count.updated",
      (data) => {
        const { projectId, logCount } = data;

        if (!projectIds.includes(projectId)) {
          return;
        }

        const projectsKey = ["projects", organizationSlug] as const;

        queryClient.setQueryData<ProjectCache[]>(
          projectsKey,
          (oldProjects) => {
            if (!oldProjects) {
              return oldProjects;
            }

            return oldProjects.map((project) =>
              project.id === projectId ? { ...project, logCount } : project,
            );
          },
        );
      },
    );

    return () => {
      removeListener();

      for (const projectId of projectIds) {
        websocketManager.unsubscribe(projectId);
      }
    };
  }, [organizationSlug, projectIds.length]);
}
