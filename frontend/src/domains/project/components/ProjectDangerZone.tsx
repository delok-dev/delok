// src/domains/project/components/ProjectDangerZone.tsx
"use client";

import { useState } from "react";
import Button from "@/src/components/ui/Button";
import ConfirmModal from "@/src/components/ui/ConfirmModal";

type ProjectDangerZoneProps = {
  projectName: string;
  onDelete: () => Promise<void>;
};

export function ProjectDangerZone({
  projectName,
  onDelete,
}: ProjectDangerZoneProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-danger">Danger zone</h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Irreversible and destructive actions.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 rounded-lg border border-danger/25 bg-danger/5 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-4">
          <div>
            <p className="text-sm font-medium text-foreground">Delete project</p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Permanently delete this project. This action cannot be undone.
            </p>
          </div>

          <Button
            type="button"
            variant="danger"
            onClick={() => setShowConfirm(true)}
            className="shrink-0"
          >
            Delete project
          </Button>
        </div>
      </section>

      {showConfirm && (
        <ConfirmModal
          title="Delete project"
          description="This action is permanent and cannot be undone."
          expectedText={projectName}
          inputLabel="Project name"
          helperText={`Type "${projectName}" to confirm deletion.`}
          confirmLabel="Delete project"
          busyLabel="Deleting…"
          onConfirm={onDelete}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
