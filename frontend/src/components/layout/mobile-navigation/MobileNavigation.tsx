// src/components/layout/mobile-navigation/MobileNavigation.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { MobileNavigationDrawer, MOBILE_DRAWER_ID } from "./MobileNavigationDrawer";

const MD_BREAKPOINT = 768;

type MobileNavigationProps = {
  organizationSlug: string;
};

/**
 * Mobile counterpart of the desktop Sidebar: a trigger button rendered in the
 * topbar that opens the organization navigation as a drawer. The drawer reuses
 * SIDEBAR_ITEMS and the sidebar subcomponents so navigation stays in sync.
 */
export function MobileNavigation({ organizationSlug }: MobileNavigationProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const close = () => setIsOpen(false);

  // Close on navigation (route change) so the drawer never survives a new page.
  // Depends on `pathname` only: including `isOpen` would re-run on open and
  // close the drawer again on the next tick, making it impossible to open.
  useEffect(() => {
    const timer = setTimeout(close, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // The drawer is a mobile-only affordance; close it when reaching the desktop
  // breakpoint so it cannot linger behind the always-visible sidebar.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= MD_BREAKPOINT) {
        close();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Escape closes the drawer.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls={MOBILE_DRAWER_ID}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-foreground transition-colors hover:bg-surface-hover cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mounted && isOpen && (
        <MobileNavigationDrawer
          organizationSlug={organizationSlug}
          pathname={pathname}
          onClose={close}
        />
      )}
    </>
  );
}