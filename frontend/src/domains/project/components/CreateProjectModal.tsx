// src/domains/project/components/CreateProjectModal.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Modal from "@/src/components/ui/Modal";
import { showToast } from "@/src/components/ui/toast";
import { useCooldown } from "@/src/hooks/useCooldown";

import { projectSchema } from "../schemas/project.schema";
import { useProjects } from "../hooks/useProjects";

type CreateProjectModalProps = {
  organizationSlug: string;
};

export function CreateProjectModal({
  organizationSlug,
}: CreateProjectModalProps) {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState("");

  const { createProject } = useProjects(organizationSlug);

  const { isCooldownActive, startCooldown } = useCooldown();

  const handleOpen = () => {
    setError("");
    setProjectName("");
    setOpen(true);
  };

  const handleClose = () => {
    if (createProject.isPending) return;

    setOpen(false);
    setError("");
    setProjectName("");
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (createProject.isPending || isCooldownActive) return;

    const result = projectSchema.safeParse({
      name: projectName,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError("");

    try {
      await createProject.mutateAsync(result.data);

      showToast({ message: "Project created", type: "success" });

      startCooldown();

      setProjectName("");
      setOpen(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 sm:gap-2"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Add Project</span>
        <span className="sm:hidden">Add</span>
      </Button>

      <Modal open={open} onClose={handleClose} title="Create Project">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Create a new project in this organization.
          </p>

          <Input
            id="projectName"
            label="Project Name"
            name="name"
            placeholder="e.g. My API Service"
            value={projectName}
            onChange={(event) => {
              setProjectName(event.target.value);

              if (error) {
                setError("");
              }
            }}
            error={error}
            autoFocus
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              onClick={handleClose}
              disabled={createProject.isPending}
              className="border border-border bg-surface text-foreground hover:bg-surface-hover"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                createProject.isPending || isCooldownActive || !projectName.trim()
              }
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {createProject.isPending ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
