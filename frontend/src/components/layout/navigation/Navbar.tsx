// src/components/layout/navigation/Navbar.tsx
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
import { GitHubIcon } from "@/src/components/svg";

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
    const timer = setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 0);
    return () => clearTimeout(timer);
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
          className="md:hidden relative flex h-9 w-9 items-center justify-center text-foreground cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 h-0.5 w-5 bg-current transition-all duration-300 ${
                isMobileMenuOpen
                  ? "top-1/2 -translate-y-1/2 rotate-45"
                  : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 bg-current transition-opacity duration-200 ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-0.5 w-5 bg-current transition-all duration-300 ${
                isMobileMenuOpen
                  ? "top-1/2 -translate-y-1/2 -rotate-45"
                  : "top-3.5"
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