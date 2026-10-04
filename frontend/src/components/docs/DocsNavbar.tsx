// src/components/docs/DocsNavbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X } from "lucide-react";
import { ASSETS } from "@/src/constants/assets";
import { ROUTES } from "@/src/constants/routes";
import { EXTERNAL_LINKS } from "@/src/constants/external-links";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import { GitHubIcon } from "@/src/components/svg";

type DocsNavbarProps = {
  onMenuToggle?: () => void;
  menuOpen?: boolean;
  onSearchOpen?: () => void;
};

export function DocsNavbar({
  onMenuToggle,
  menuOpen,
  onSearchOpen,
}: DocsNavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-14 w-full max-w-360 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.HOME} className="flex items-center" aria-label="Delok home">
          <Image
            src={ASSETS.LOGO.LIGHT_TEXT}
            alt="Delok"
            width={512}
            height={128}
            className="w-21.5 h-auto"
          />
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href={ROUTES.DOCS.ROOT}
            className="hidden items-center rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground sm:inline-flex"
          >
            Documentation
          </Link>
          <button
            type="button"
            onClick={onSearchOpen}
            aria-label="Search documentation"
            className="inline-flex items-center cursor-pointer justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <Search className="h-5 w-5" />
          </button>
          <ThemeToggle />
          <a
            href={EXTERNAL_LINKS.GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
          <button
            type="button"
            onClick={onMenuToggle}
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md border border-border cursor-pointer bg-surface text-foreground hover:bg-surface-hover lg:hidden"
            aria-label={menuOpen ? "Close docs menu" : "Open docs menu"}
          >
            {menuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
