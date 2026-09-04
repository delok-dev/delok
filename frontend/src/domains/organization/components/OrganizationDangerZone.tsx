// src/domains/organization/components/OrganizationDangerZone.tsx
"use client";

import { useState } from "react";

import Button from "@/src/components/ui/Button";
import ConfirmModal from "@/src/components/ui/ConfirmModal";

type OrganizationDangerZoneProps = {
  organizationName: string;
  isDeleting: boolean;
  onDelete: () => Promise<void>;
};

/**
 * Destructive-actions panel for an organization. Owns only the confirmation
 * UI and the delete error display; the mutation and any post-delete
 * navigation are supplied by the caller through `onDelete`.
 */
export function OrganizationDangerZone({
  organizationName,
  isDeleting,
  onDelete,
}: OrganizationDangerZoneProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  return (
    <>
      <section className="space-y-4 border-t border-border pt-6 sm:pt-8">
        <div>
          <h2 className="text-sm font-semibold text-danger">Danger zone</h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Irreversible and destructive actions.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 rounded-lg border border-danger/25 bg-danger/5 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              Delete organization
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Permanently delete this organization and all of its projects,
              API keys, and data. This action cannot be undone.
            </p>
          </div>

          <Button
            type="button"
            variant="danger"
            disabled={isDeleting}
            onClick={() => {
              setDeleteError("");
              setShowDeleteConfirm(true);
            }}
            className="shrink-0"
          >
            Delete organization
          </Button>
        </div>

        {deleteError && (
          <p className="w-fit rounded-md bg-danger/10 px-2 py-1.5 text-xs text-danger">
            {deleteError}
          </p>
        )}
      </section>

      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete organization"
          description="This action is permanent and cannot be undone."
          expectedText={organizationName}
          inputLabel="Organization name"
          helperText={`Type "${organizationName}" to confirm deletion.`}
          confirmLabel="Delete"
          busyLabel="Deleting…"
          onConfirm={async () => {
            try {
              await onDelete();
            } catch (error) {
              setDeleteError(
                error instanceof Error
                  ? error.message
                  : "Failed to delete organization.",
              );
            }
          }}
          onClose={() => {
            if (!isDeleting) {
              setShowDeleteConfirm(false);
            }
          }}
        />
      )}
    </>
  );
}
