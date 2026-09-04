// src/domains/api-key/components/ApiKeyList.tsx
"use client";

import { useState } from "react";
import { KeyRound, Plus } from "lucide-react";

import Button from "@/src/components/ui/Button";
import ConfirmModal from "@/src/components/ui/ConfirmModal";
import EmptyState from "@/src/components/ui/EmptyState";
import Skeleton from "@/src/components/ui/Skeleton";
import { showToast } from "@/src/components/ui/toast";
import { useCooldown } from "@/src/hooks/useCooldown";

import type { ApiKey } from "../types/api-key.type";
import { GenerateApiKeyModal } from "./GenerateApiKeyModal";

type ApiKeyListProps = {
  apiKeys: ApiKey[];
  isLoading?: boolean;
  onGenerate: (name: string) => Promise<string>;
  onRename: (id: string, name: string) => Promise<void>;
  onRevoke: (id: string) => Promise<void>;
};

const FIELD =
  "rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors";

const ACTION =
  "rounded-md px-1.5 py-0.5 text-xs font-medium transition-colors cursor-pointer sm:px-2 sm:py-1";

const formatDate = (iso: string) => {
  const date = new Date(iso);

  return date.toLocaleString("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

export function ApiKeyList({
  apiKeys,
  isLoading = false,
  onGenerate,
  onRename,
  onRevoke,
}: ApiKeyListProps) {
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const [editingApiKeyId, setEditingApiKeyId] = useState<string | null>(null);

  const [editingApiKeyName, setEditingApiKeyName] = useState("");

  const [renaming, setRenaming] = useState(false);

  const [revokingKey, setRevokingKey] = useState<ApiKey | null>(null);

  const {
    isCooldownActive: isRenameCooldown,
    startCooldown: startRenameCooldown,
  } = useCooldown();

  const handleRename = async (id: string) => {
    const name = editingApiKeyName.trim();

    if (!name || renaming || isRenameCooldown) return;

    setRenaming(true);

    try {
      await onRename(id, name);

      showToast({ message: "API key renamed", type: "success" });

      startRenameCooldown();

      setEditingApiKeyId(null);
      setEditingApiKeyName("");
    } catch (err) {
      showToast({
        message: err instanceof Error ? err.message : "Failed to rename API key",
        type: "error",
      });
    } finally {
      setRenaming(false);
    }
  };

  return (
    <section id="api-keys" className="scroll-mt-24 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            API keys
            {!isLoading && (
              <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                {apiKeys.length}
              </span>
            )}
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            API keys authenticate requests made to this project.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setShowGenerateModal(true)}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs "
        >
          Generate key
          <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </Button>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-14" />
          ))}
        </div>
      ) : apiKeys.length === 0 ? (
        /* Empty */
        <EmptyState
          icon={<KeyRound className="h-5 w-5" />}
          description="No API keys yet. Generate one to get started."
          className="py-10"
        />
      ) : (
        /* API key list */
        <ul className="divide-y divide-border border border-border rounded-md overflow-hidden bg-surface">
          {apiKeys.map((apiKey) => (
            <li
              key={apiKey.id}
              className="flex items-center justify-between gap-2 px-3 py-1.5 sm:gap-4 sm:px-4 sm:py-3"
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                {/* Rename */}
                {editingApiKeyId === apiKey.id ? (
                  <div className="flex max-w-xs gap-1.5">
                    <input
                      value={editingApiKeyName}
                      onChange={(e) => setEditingApiKeyName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          void handleRename(apiKey.id);
                        }

                        if (e.key === "Escape") {
                          setEditingApiKeyId(null);
                          setEditingApiKeyName("");
                        }
                      }}
                      autoFocus
                      disabled={renaming || isRenameCooldown}
                      className={`${FIELD} flex-1 px-2.5 py-1.5`}
                    />

                    <button
                      type="button"
                      onClick={() => void handleRename(apiKey.id)}
                      disabled={
                        renaming ||
                        isRenameCooldown ||
                        !editingApiKeyName.trim()
                      }
                      className="shrink-0 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                    >
                      {renaming ? "Saving..." : "Save"}
                    </button>
                  </div>
                ) : (
                  <span className="truncate text-sm font-medium text-foreground">
                    {apiKey.name}
                  </span>
                )}

                {/* Key prefix + status */}
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 sm:gap-x-2">
                  <span className="font-mono text-[11px] text-muted-foreground sm:text-xs">
                    {apiKey.keyPrefix}********
                  </span>

                  {apiKey.revokedAt ? (
                    <span className="inline-flex items-center rounded-sm bg-danger/10 px-1.5 py-0.5 text-[10px] font-medium text-danger">
                      Revoked {formatDate(apiKey.revokedAt)}
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground sm:text-xs">
                      Last used:{" "}
                      {apiKey.lastUsedAt
                        ? formatDate(apiKey.lastUsedAt)
                        : "Never"}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              {!apiKey.revokedAt && (
                <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingApiKeyId(apiKey.id);
                      setEditingApiKeyName(apiKey.name);
                    }}
                    className={`${ACTION} text-muted-foreground hover:bg-surface-hover hover:text-foreground`}
                  >
                    Rename
                  </button>

                  <button
                    type="button"
                    onClick={() => setRevokingKey(apiKey)}
                    className={`${ACTION} text-danger hover:bg-danger/10`}
                  >
                    Revoke
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Generate modal */}
      <GenerateApiKeyModal
        open={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onGenerate={onGenerate}
      />

      {/* Revoke confirm modal */}
      {revokingKey && (
        <ConfirmModal
          title="Revoke API key"
          description="This key will immediately stop working."
          expectedText={revokingKey.name}
          inputLabel="Key name"
          helperText={`Type "${revokingKey.name}" to confirm revoking.`}
          confirmLabel="Revoke key"
          busyLabel="Revoking…"
          onConfirm={async () => {
            await onRevoke(revokingKey.id);

            showToast({ message: "API key revoked", type: "success" });
          }}
          onClose={() => setRevokingKey(null)}
        />
      )}
    </section>
  );
}
