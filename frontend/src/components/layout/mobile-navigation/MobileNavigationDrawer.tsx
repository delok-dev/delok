// src/components/layout/mobile-navigation/MobileNavigationDrawer.tsx
"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, X } from "lucide-react";

import { SidebarFooter, SidebarNavigation } from "@/src/components/layout/sidebar";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import { ASSETS } from "@/src/constants/assets";
import { ROUTES } from "@/src/constants/routes";

export const MOBILE_DRAWER_ID = "mobile-navigation-drawer";

type MobileNavigationDrawerProps = {
  organizationSlug: string;
  pathname: string;
  onClose: () => void;
};

export function MobileNavigationDrawer({
  organizationSlug,
  pathname,
  onClose,
}: MobileNavigationDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Move focus into the drawer so keyboard and screen-reader users land inside
  // the dialog as soon as it opens.
  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  return createPortal(
    <div id={MOBILE_DRAWER_ID} className="fixed inset-0 z-1000 md:hidden">
      {/* Backdrop: click closes the drawer. Escape and the close button cover
          keyboard users, so this is hidden from assistive technology. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Organization navigation"
        className="bg-surface absolute inset-y-0 left-0 flex w-[min(280px,85vw)] flex-col shadow-xl outline-none"
      >
        <div className="flex items-center justify-between px-3 py-4">
          <Image
            src={ASSETS.LOGO.LIGHT_TEXT}
            alt="Delok"
            width={512}
            height={128}
            className="w-22.5 h-auto"
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            title="Close navigation menu"
            className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <SidebarNavigation
          organizationSlug={organizationSlug}
          pathname={pathname}
          collapsed={false}
          onNavigate={onClose}
        />

        {/* Desktop-only topbar controls stay reachable on mobile here. */}
        <div className="flex items-center gap-2 border-t border-border px-2 py-3">
          <Link
            href={ROUTES.DOCS.ROOT}
            onClick={onClose}
            className="flex flex-1 items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <BookOpen className="h-4 w-4 shrink-0" />
            <span className="truncate">Docs</span>
          </Link>

          <ThemeToggle />
        </div>

        <SidebarFooter collapsed={false} />
      </div>
    </div>,
    document.body,
  );
}