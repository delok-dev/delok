// src/components/legal/LegalLayout.tsx
import Link from "next/link";
import Image from "next/image";
import { ASSETS } from "@/src/constants/assets";
import { ROUTES } from "@/src/constants/routes";
import { Footer } from "@/src/components/landing/Footer";
import { ThemeToggle } from "@/src/components/ThemeToggle";

type TocItem = { id: string; label: string };

type LegalLayoutProps = {
  title: string;
  lastUpdated: string;
  toc: TocItem[];
  children: React.ReactNode;
};

function LegalHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.HOME} aria-label="Delok Home" className="flex items-center gap-2">
          <Image src={ASSETS.LOGO.LIGHT_TEXT} alt="Delok" width={120} height={28} className="h-7 w-auto" priority />
        </Link>
        <nav aria-label="Legal navigation" className="flex items-center gap-2">
          <Link
            href={ROUTES.LEGAL.PRIVACY}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Privacy
          </Link>
          <Link
            href={ROUTES.LEGAL.TERMS}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Terms
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export function LegalLayout({ title, lastUpdated, toc, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LegalHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="mx-auto max-w-[800px]">
            {/* Title block */}
            <div className="mb-8 border-b border-border pb-8">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Last updated: <time dateTime="2026-09-09">{lastUpdated}</time>
              </p>
            </div>

            <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
              {/* TOC - desktop sticky */}
              <aside className="hidden lg:block lg:w-[200px] lg:shrink-0">
                <nav aria-label="Table of contents" className="sticky top-20">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">On this page</p>
                  <ul className="space-y-1 border-l border-border">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="block border-l-2 border-transparent -ml-px pl-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors focus-visible:outline-none focus-visible:text-foreground"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>

              {/* Mobile TOC */}
              <div className="lg:hidden -mt-2 mb-2">
                <details className="rounded-lg border border-border bg-surface">
                  <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-foreground">On this page</summary>
                  <ul className="px-4 pb-3 space-y-1">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a href={`#${item.id}`} className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>

              {/* Content */}
              <article className="min-w-0 flex-1 prose-legal">{children}</article>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
