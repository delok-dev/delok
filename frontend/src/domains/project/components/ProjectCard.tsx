// src/domains/project/components/ProjectCard.tsx
import Link from "next/link";
import { FileText } from "lucide-react";
import { useEffect, useRef } from "react";

import type { Project } from "../types/project.type";
import { ROUTES } from "@/src/constants/routes";

type ProjectCardProps = {
  project: Project;
  organizationSlug: string;
};

export function ProjectCard({ project, organizationSlug }: ProjectCardProps) {
  const logCountRef = useRef<HTMLSpanElement | null>(null);
  const previousLogCountRef = useRef(project.logCount);

  useEffect(() => {
    const previousLogCount = previousLogCountRef.current;
    previousLogCountRef.current = project.logCount;

    if (
      previousLogCount === undefined ||
      project.logCount === undefined ||
      previousLogCount === project.logCount ||
      !logCountRef.current
    ) {
      return;
    }

    const flash = logCountRef.current.animate(
      [
        { backgroundColor: "rgba(34, 197, 94, 0.24)" },
        { backgroundColor: "rgba(34, 197, 94, 0)", offset: 1 },
      ],
      { duration: 1000, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );

    return () => {
      flash.cancel();
    };
  }, [project.logCount]);

  return (
    <Link
      href={ROUTES.ORGANIZATION.PROJECT(organizationSlug, project.id)}
      className="
        group
        flex
        items-center
        justify-between
        bg-surface
        px-4
        py-3
        rounded-md
        transition-all
        hover:bg-surface-hover
      "
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center text-primary">
          <FileText className="h-4 w-4" />
        </div>

        <span className="truncate text-sm font-medium text-foreground">
          {project.name}
        </span>
      </div>

      <span
        ref={logCountRef}
        className="ml-3 shrink-0 font-mono text-xs text-muted-foreground"
      >
        {project.logCount === undefined
          ? "—"
          : `${project.logCount.toLocaleString()} logs`}
      </span>
    </Link>
  );
}
