// src/domains/project/components/ProjectSettings.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { showToast } from "@/src/components/ui/toast";
import { useCooldown } from "@/src/hooks/useCooldown";
import { projectSchema } from "../schemas/project.schema";

type ProjectSettingsProps = {
  projectName: string;
  onUpdate: (name: string) => Promise<void>;
};

export function ProjectSettings({
  projectName,
  onUpdate,
}: ProjectSettingsProps) {
  const [editingName, setEditingName] = useState(projectName);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

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

  const isUnchanged = editingName.trim() === projectName;

  const handleUpdate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (updating || isCooldownActive || isUnchanged) return;

    const result = projectSchema.safeParse({ name: editingName });

    if (!result.success) {
      setUpdateError(result.error.issues[0].message);
      return;
    }

    setUpdating(true);
    setUpdateError("");
    try {
      await onUpdate(result.data.name);

      // Only commit the local UI value and show the toast if the component is
      // still mounted (i.e. the user did not navigate away or log out).
      if (isMountedRef.current) {
        setEditingName(result.data.name);
        showToast({ message: "Project renamed", type: "success" });
        // Short anti-spam lock: does NOT delay the cache/UI/toast above, which
        // already happened immediately. It only blocks another rename for a moment.
        startCooldown();
      }
    } catch (err) {
      if (isMountedRef.current) {
        setUpdateError(
          err instanceof Error ? err.message : "Something went wrong",
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
          Change the name of your project or manage the API Keys
        </p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="">
          <Input
            id="projectName"
            label="Project name"
            name="projectName"
            value={editingName}
            onChange={(e) => {
              setEditingName(e.target.value);

              if (updateError) {
                setUpdateError("");
              }
            }}
            placeholder={projectName}
          />
        </div>

        {updateError && (
          <p className="w-fit rounded-md bg-danger/10 px-2 py-1.5 text-xs text-danger">
            {updateError}
          </p>
        )}

        <Button
          type="submit"
          disabled={
            updating || isCooldownActive || isUnchanged || !editingName.trim()
          }
        >
          {updating ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </section>
  );
}
