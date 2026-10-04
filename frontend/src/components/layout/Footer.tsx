// src/components/layout/Footer.tsx
"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ASSETS } from "@/src/constants/assets";
import { EXTERNAL_LINKS } from "@/src/constants/external-links";
import { GitHubIcon } from "@/src/components/svg";

const FOOTER_NAV_LINKS = [
  { label: "Documentation", href: EXTERNAL_LINKS.DOCS, external: false },
  { label: "GitHub", href: EXTERNAL_LINKS.GITHUB, external: true },
] as const;

const FOOTER_LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;

export function Footer() {
  const [hasEntered, setHasEntered] = useState(false);
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        setHasEntered(true);
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(footer);

    // Fallback: already on screen at mount (large viewport / observer timing)
    const rect = footer.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      observer.disconnect();
      setHasEntered(true);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="border-t border-border/50">
      <div
        className={`mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 ${
          hasEntered ? "animate-section-copy" : "opacity-0"
        }`}
      >
        {/* Identity + navigation */}
        <div className="mt-16 flex flex-col gap-10 sm:mt-20 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Image src={ASSETS.LOGO.LIGHT} alt="Delok" width={40} height={40} />
            <p className="mt-3 text-sm text-muted-foreground">
              See what your systems are doing.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex items-center gap-8">
              {FOOTER_NAV_LINKS.map((link) =>
                link.external ? (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {link.label}
                      <GitHubIcon className="h-4 w-4" />
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="rounded-md text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>

        {/* Bottom row */}
        <div className="mt-16 grid grid-cols-1 items-center gap-4 border-t border-border/50 pt-6 sm:mt-20 sm:grid-cols-3">
          <p className="text-xs text-muted-foreground">© 2026 Delok</p>

          <nav aria-label="Legal" className="sm:justify-self-center">
            <ul className="flex items-center gap-6">
              {FOOTER_LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="rounded-md text-xs font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href={EXTERNAL_LINKS.DEVELOPER}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 self-start rounded-md text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:justify-self-end"
          >
            Meet the developer
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
