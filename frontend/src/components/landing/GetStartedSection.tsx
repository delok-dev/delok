// src/components/landing/GetStartedSection.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Copy,
  Package,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { ASSETS } from "@/src/constants/assets";
import { EXTERNAL_LINKS } from "@/src/constants/external-links";

const INSTALL_COMMAND = "npm install delok";

const BENEFITS = [
  {
    icon: Package,
    bold: "Lightweight",
    rest: " by design.",
    detail:
      "Install the Delok SDK won't hurt your page speed or Core Web vitals",
  },
  {
    icon: Zap,
    bold: "5-minute",
    rest: " integration.",
    detail:
      "One SDK, one API key, and your first logs flowing into Delok in minutes.",
  },
  {
    icon: ShieldCheck,
    bold: "Privacy-first",
    rest: " logging.",
    detail:
      "Secure ingestion without exposing your API key to your application logs.",
  },
] as const;

// The install command is the primary CTA — a compact terminal-like surface
// with an inline copy action. No terminal chrome by design.
function InstallCommand() {
  const [copied, setCopied] = useState(false);
  const revertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
      revertTimerRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable — keep the resting label.
    }
  };

  return (
    <div className="flex items-stretch overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex min-w-0 items-center gap-2.5 px-4 py-3 font-mono text-sm sm:px-5 sm:text-base">
        <span className="shrink-0 text-primary">$</span>
        <span className="whitespace-nowrap text-foreground">
          {INSTALL_COMMAND}
        </span>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy install command"
        className="ml-auto flex shrink-0 cursor-pointer items-center gap-1.5 border-l border-border bg-background/40 px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground sm:px-5"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-success" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export function GetStartedSection() {
  const [hasEntered, setHasEntered] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const hasEnteredRef = useRef(false);

  // --- Entrance: once-only viewport reveal (same system as other sections) ---
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || hasEnteredRef.current) return;

    const triggerEntrance = () => {
      if (hasEnteredRef.current) return;
      hasEnteredRef.current = true;
      setHasEntered(true);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        triggerEntrance();
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(section);

    // Fallback: already on screen at mount (large viewport / observer timing)
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      observer.disconnect();
      triggerEntrance();
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden py-32 lg:py-40"
    >
      <div
        aria-hidden
        className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
          hasEntered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-y-0 right-0 w-[44%] opacity-10 sm:w-[38%] lg:w-[30%]">
          <video
            src={ASSETS.VIDEO.TWO}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
            className="h-full w-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-linear-to-l from-transparent via-background/35 to-background" />
        </div>

        {/* Vertical dissolve into the page background */}
        <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent" />
      </div>

      {/* Central content */}
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Heading */}
          <h2
            className={`max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl text-pretty ${
              hasEntered ? "animate-section-heading" : "opacity-0"
            }`}
          >
            Bring
            <span className="text-primary"> Delok </span>
            to your stack.
          </h2>

          {/* Install command — the primary CTA */}
          <div
            className={`mt-10 w-full max-w-sm sm:mt-12 ${
              hasEntered ? "animate-section-visual" : "opacity-0"
            }`}
            style={{ animationDelay: "120ms" }}
          >
            <InstallCommand />
          </div>

          {/* Documentation link — secondary */}
          <Link
            href={EXTERNAL_LINKS.DOCS}
            className={`mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground ${
              hasEntered ? "animate-section-copy" : "opacity-0"
            }`}
            style={{ animationDelay: "220ms" }}
          >
            <BookOpen className="h-4 w-4" />
            View documentation
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          <div className="mt-24 w-full grid grid-cols-1 lg:mt-32 lg:grid-cols-3">
            {BENEFITS.map((benefit, index) => (
              <div
                key={benefit.bold + benefit.rest}
                className={`flex items-start gap-4 py-10 text-left first:pt-0 last:pb-0 lg:flex-col lg:items-center lg:gap-0 lg:px-10 lg:py-0 lg:first:pl-0 lg:last:pr-0 lg:text-center ${
                  hasEntered ? "animate-section-copy" : "opacity-0"
                }`}
                style={{ animationDelay: `${320 + index * 80}ms` }}
              >
                <benefit.icon className="mt-1 h-5 w-5 shrink-0 text-primary lg:mt-0" />
                <div className="min-w-0">
                  <p className="text-lg lg:mt-5">
                    <span className="font-semibold text-foreground">
                      {benefit.bold}
                    </span>
                    <span className="font-normal text-muted-foreground">
                      {benefit.rest}
                    </span>
                  </p>
                  <p className="mt-2 max-w-none text-sm leading-relaxed text-muted-foreground lg:max-w-xs">
                    {benefit.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
