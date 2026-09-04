// src/domains/api-key/components/GenerateApiKeyModal.tsx
"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import Modal from "@/src/components/ui/Modal";
import { showToast } from "@/src/components/ui/toast";
import { useCooldown } from "@/src/hooks/useCooldown";
import { apiKeySchema } from "@/src/domains/api-key/schemas/api-key.schema";

type GenerateApiKeyModalProps = {
  open: boolean;
  onClose: () => void;
  onGenerate: (name: string) => Promise<string>;
};

const FIELD =
  "rounded-md border border-border bg-surface text-[12.5px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors";

export function GenerateApiKeyModal({
  open,
  onClose,
  onGenerate,
}: GenerateApiKeyModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [keyCopied, setKeyCopied] = useState(false);

  const { isCooldownActive, startCooldown } = useCooldown();

  const reset = () => {
    setName("");
    setError("");
    setCreating(false);
    setGeneratedKey(null);
    setKeyCopied(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleGenerate = async () => {
    if (creating || isCooldownActive) return;

    const validationResult = apiKeySchema.safeParse({ name: name.trim() });
    if (!validationResult.success) {
      setError(validationResult.error.issues[0].message);
      return;
    }

    setCreating(true);
    setError("");
    try {
      const key = await onGenerate(validationResult.data.name);

      showToast({ message: "API key created", type: "success" });

      startCooldown();

      setGeneratedKey(key);
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={generatedKey ? "API Key Generated" : "Generate API Key"}
      description={
        generatedKey
          ? "Copy this key now — it will not be shown again."
          : "Enter a name for your new API key"
      }
    >
      <div className="p-6">
        {!generatedKey ? (
          <>
            <div className="mb-4">
              <label className="mb-2 block text-xs font-medium text-foreground">
                API Key Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Production Key"
                autoFocus
                className={`${FIELD} w-full px-3 py-2`}
              />
            </div>

            {error && (
              <div className="mb-4 rounded-md bg-danger/10 px-3 py-2 text-xs text-danger">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="flex-1 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={creating || isCooldownActive || !name.trim()}
                className="flex-1 rounded-md bg-primary text-primary-foreground text-xs font-medium py-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {creating ? "Generating…" : "Generate"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 rounded-md border border-dashed border-border bg-background p-3">
              <code className="break-all font-mono text-xs text-foreground">
                {`${generatedKey.slice(0, 12)}*********************`}
              </code>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedKey);
                setKeyCopied(true);
                setTimeout(() => setKeyCopied(false), 1500);
              }}
              className="w-full mb-3 flex items-center justify-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5" />
              {keyCopied ? "Copied!" : "Copy Key"}
            </button>

            <button
              onClick={handleClose}
              className="w-full rounded-md bg-primary text-primary-foreground text-xs font-medium py-2 hover:opacity-90 transition-opacity cursor-pointer"
            >
              Done
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
