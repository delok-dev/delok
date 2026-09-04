// src/components/ui/Modal.tsx
"use client";

import { HTMLAttributes, useEffect } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  ...props
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  // Render in a portal so the overlay is detached from the page's scroll
  // container. Mounting/focusing the modal inside a scrollable ancestor can
  // otherwise make the browser adjust that container's scroll position,
  // shifting the page behind the modal.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
      {...props}
    >
      <div
        className={clsx(
          "w-full max-w-sm rounded-lg border border-border p-4 bg-surface shadow-lg",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
