// src/components/docs/DocsSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAVIGATION } from "./navigation";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation" className="space-y-7">
      {DOCS_NAVIGATION.map((section) => (
        <div key={section.title}>
          <h3 className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {section.title}
          </h3>
          <ul className="mt-3 space-y-1">
            {section.items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                      active
                        ? "bg-primary font-medium text-primary-foreground"
                        : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
