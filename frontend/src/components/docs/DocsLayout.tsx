// src/components/docs/DocsLayout.tsx
"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { DocsNavbar } from "./DocsNavbar";
import { DocsSidebar } from "./DocsSidebar";
import { DocsSearchModal } from "./DocsSearch";
import { EXTERNAL_LINKS } from "@/src/constants/external-links";

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = () => setSearchOpen(true);
    window.addEventListener("open-docs-search", handler as EventListener);
    return () =>
      window.removeEventListener("open-docs-search", handler as EventListener);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DocsNavbar
        menuOpen={mobileOpen}
        onMenuToggle={() => setMobileOpen((v) => !v)}
        onSearchOpen={() => setSearchOpen(true)}
      />
      <DocsSearchModal open={searchOpen} onOpenChange={setSearchOpen} />

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-background lg:hidden">
          <div className="h-14" />
          <div className="overflow-y-auto border-t border-border bg-background p-4">
            <div onClick={() => setMobileOpen(false)}>
              <DocsSidebar />
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-360">
        <aside className="hidden w-60 shrink-0 border-r border-border lg:block">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-4 py-8">
            <DocsSidebar />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            {children}
            <div className="mt-12 border-t border-border pt-6">
              <p className="inline-flex flex-wrap items-center gap-1.5 text-sm leading-relaxed text-muted-foreground">
                <span>Found Something?</span>
                <a
                  href={EXTERNAL_LINKS.GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-foreground underline decoration-border underline-offset-4 hover:text-primary hover:decoration-primary"
                >
                  Share your feedback on GitHub
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
