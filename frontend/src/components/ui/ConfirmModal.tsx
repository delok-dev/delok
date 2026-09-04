// src/components/ui/ConfirmModal.tsx
"use client";

import { useId, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Modal from "./Modal";

type ConfirmModalProps = {
  /** Defaults to true; pass false to keep the modal mounted but hidden. */
  open?: boolean;
  title: string;
  description: string;
  /** The exact text the user must type to enable the confirm button. */
  expectedText: string;
  inputLabel?: string;
  helperText?: string;
  confirmLabel: string;
  busyLabel?: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
};

/**
 * Type-to-confirm modal for destructive actions.
 *
 * Mount it conditionally (e.g. `{open && <ConfirmModal ... />}`) so its
 * internal state resets every time it opens.
 */
export default function ConfirmModal({
  open = true,
  title,
  description,
  expectedText,
  inputLabel = "Confirmation",
  helperText,
  confirmLabel,
  busyLabel,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const inputId = useId();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const canConfirm = text === expectedText && !busy;

  const close = () => {
    if (busy) return;
    onClose();
  };

  const handleConfirm = async () => {
    if (!canConfirm) return;

    setBusy(true);
    setError("");
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={close} title={title} description={description}>
      <div className="p-6">
        <Input
          id={inputId}
          label={inputLabel}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={expectedText}
          helperText={helperText}
          autoFocus
          disabled={busy}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
              void handleConfirm();
            }
          }}
        />

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-md bg-danger/10 px-2 py-1.5 text-xs text-danger"
          >
            {error}
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={close}
            disabled={busy}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            className="flex-1"
            onClick={() => void handleConfirm()}
            disabled={!canConfirm}
          >
            {busy ? (busyLabel ?? confirmLabel) : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
