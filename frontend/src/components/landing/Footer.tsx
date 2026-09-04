// src/components/landing/Footer.tsx
"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ASSETS } from "@/src/constants/assets";
import { EXTERNAL_LINKS } from "@/src/constants/external-links";

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

const FOOTER_NAV_LINKS = [
  { label: "Documentation", href: EXTERNAL_LINKS.DOCS, external: false },
  { label: "GitHub", href: EXTERNAL_LINKS.GITHUB, external: true },
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
        <div className="mt-16 border-t border-border/50  pt-6 sm:mt-20 flex justify-between items-center ">
          <p className="text-xs text-muted-foreground">© 2026 Delok</p>
          <a
            href={EXTERNAL_LINKS.DEVELOPER}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Meet the developer
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
