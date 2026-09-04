// src/domains/organization/components/OrganizationSettings.tsx
"use client";

import { useEffect, useRef, useState } from "react";

import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { showToast } from "@/src/components/ui/toast";
import { useCooldown } from "@/src/hooks/useCooldown";

import { organizationSchema } from "../schemas/organization.schema";

type OrganizationSettingsProps = {
  organizationName: string;
  onUpdate: (name: string) => Promise<unknown>;
};

/**
 * Organization rename form. Owns form-local state, validation, and the
 * update interaction only; the caller supplies the mutation through
 * `onUpdate`. This component does not navigate or own screen state.
 */
export function OrganizationSettings({
  organizationName,
  onUpdate,
}: OrganizationSettingsProps) {
  const [editingName, setEditingName] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const initializedRef = useRef(false);

  const { isCooldownActive, startCooldown } = useCooldown();

  // Tracks whether the component is still mounted so async callbacks that
  // resolve after navigation/logout do not touch stale UI.
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Initialize the form once the organization has been loaded.
   *
   * We intentionally use a ref instead of state because
   * initialization is not UI state.
   */
  useEffect(() => {
    if (!organizationName || initializedRef.current) {
      return;
    }

    setEditingName(organizationName);
    initializedRef.current = true;
  }, [organizationName]);

  const name = organizationName ?? "";

  const isUnchanged = editingName.trim() === name;

  const handleUpdate = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (updating || isCooldownActive || isUnchanged) {
      return;
    }

    const result = organizationSchema.safeParse({
      name: editingName,
    });

    if (!result.success) {
      setUpdateError(result.error.issues[0].message);
      return;
    }

    setUpdating(true);
    setUpdateError("");

    try {
      await onUpdate(result.data.name);

      if (isMountedRef.current) {
        setEditingName(result.data.name);

        showToast({ message: "Organization renamed", type: "success" });

        // Short anti-spam lock: the cache/UI/toast above already applied
        // immediately. The cooldown only blocks another rename for a moment.
        startCooldown();
      }
    } catch (error) {
      if (isMountedRef.current) {
        setUpdateError(
          error instanceof Error
            ? error.message
            : "Failed to update organization.",
        );
      }
    } finally {
      if (isMountedRef.current) {
        setUpdating(false);
      }
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">General</h2>

        <p className="mt-1 text-xs text-muted-foreground">
          Change the name of your organization.
        </p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <Input
          id="organizationName"
          label="Organization name"
          name="organizationName"
          value={editingName}
          onChange={(event) => {
            setEditingName(event.target.value);

            if (updateError) {
              setUpdateError("");
            }
          }}
          placeholder="Acme Inc."
          disabled={updating || isCooldownActive}
        />

        {updateError && (
          <p className="w-fit rounded-md bg-danger/10 px-2 py-1.5 text-xs text-danger">
            {updateError}
          </p>
        )}

        <Button
          type="submit"
          disabled={
            updating ||
            isCooldownActive ||
            isUnchanged ||
            !editingName.trim()
          }
        >
          {updating ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </section>
  );
}
