// src/components/landing/Navbar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/src/constants/routes";
import { EXTERNAL_LINKS } from "@/src/constants/external-links";
import { ASSETS } from "@/src/constants/assets";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import Image from "next/image";

type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

const NAV_LINKS: readonly NavLink[] = [
  { label: "Docs", href: EXTERNAL_LINKS.DOCS },
  {
    label: "GitHub",
    href: EXTERNAL_LINKS.GITHUB,
    external: true,
  },
];

const AUTH_LINKS = [
  {
    label: "Sign in",
    href: ROUTES.AUTH.SIGN_IN,
    variant: "primary" as const,
  },
] as const;

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Close menu on route change (back/forward or programmatic navigation)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll while mobile menu is open, without shifting layout
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isMobileMenuOpen]);

  // Escape to close + focus trap + autofocus when open
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    // Autofocus first link for immediate keyboard operation
    firstLinkRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const menu = document.getElementById("mobile-menu");
      if (!menu) return;
      const focusable = menu.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navContent = (
    <>
      {/* LEFT: Logo */}
      <Link
        href={ROUTES.HOME}
        className="flex items-center gap-2"
        aria-label="Delok Home"
      >
        <Image
          src={ASSETS.LOGO.LIGHT_TEXT}
          alt="Delok"
          width={512}
          height={128}
          className="w-21.5 h-auto"
          priority
        />
      </Link>

      {/* CENTER: Nav links (hidden on mobile) */}
      <nav
        className="hidden md:flex items-center justify-center gap-6"
        aria-label="Main navigation"
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md px-2 py-1 inline-flex items-center gap-1"
          >
            {link.label}
            {link.external && <GitHubIcon className="h-4 w-4" />}
          </Link>
        ))}
      </nav>

      {/* RIGHT: Auth + hamburger */}
      <div className="flex items-center justify-end gap-2 sm:gap-3">
        <ThemeToggle />
        <div className="hidden md:flex items-center gap-3">
          {AUTH_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                link.variant === "primary"
                  ? "bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 text-sm"
                  : "text-foreground hover:bg-surface-hover px-4 py-2 text-sm"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="md:hidden relative flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-surface-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? "top-1.75 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1.75 h-0.5 w-5 bg-current transition-opacity duration-200 ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-3.5 h-0.5 w-5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? "top-1.75 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>
    </>
  );

  const mobileMenu = mounted
    ? createPortal(
        <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            aria-hidden={!isMobileMenuOpen}
            // @ts-expect-error inert is valid in React 19 but not yet in TS lib
            inert={!isMobileMenuOpen ? "" : undefined}
            className={`fixed top-14 inset-x-0 bottom-0 z-40 flex flex-col overflow-y-auto border-t border-border bg-background transition-all duration-200 ease-out md:hidden ${
              isMobileMenuOpen
                ? "translate-y-0 opacity-100 pointer-events-auto"
                : "-translate-y-2 opacity-0 pointer-events-none"
            }`}
          >
            <nav className="p-4" aria-label="Mobile navigation">
              <ul className="space-y-1">
                {NAV_LINKS.map((link, idx) => (
                  <li key={link.label}>
                    <Link
                      ref={idx === 0 ? firstLinkRef : undefined}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="block px-3 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      onClick={closeMobileMenu}
                    >
                      <span className="flex items-center gap-1.5">
                        {link.label}
                        {link.external && <GitHubIcon className="h-4 w-4" />}
                      </span>
                    </Link>
                  </li>
                ))}
                <li className="pt-4 border-t border-border">
                  <div className="flex flex-col gap-2">
                    {AUTH_LINKS.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                          link.variant === "primary"
                            ? "bg-primary text-primary-foreground hover:opacity-90 px-4 py-3 text-base"
                            : "text-foreground hover:bg-surface-hover px-4 py-3 text-base border border-border"
                        }`}
                        onClick={closeMobileMenu}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </li>
              </ul>
            </nav>
          </div>,
        document.body,
      )
    : null;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
          {navContent}
        </div>
      </div>
      {mobileMenu}
    </header>
  );
}
