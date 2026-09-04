// app/docs/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DocsHomeSearch } from "@/src/components/docs/DocsHomeSearch";
import { ROUTES } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: "Delok | Documentation",
  description:
    "Everything you need to start sending and understanding logs with Delok.",
};

const SECTIONS = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Introduction",
        href: ROUTES.DOCS.INTRODUCTION,
        description:
          "Learn what Delok is and how it helps you monitor your application logs.",
      },
      {
        title: "Quickstart",
        href: ROUTES.DOCS.QUICKSTART,
        description: "Send your first log with the Delok SDK.",
      },
    ],
  },
  {
    title: "SDK",
    items: [
      {
        title: "Installation",
        href: ROUTES.DOCS.INSTALLATION,
        description: "Install the SDK and prepare your application.",
      },
      {
        title: "Logging",
        href: ROUTES.DOCS.LOGGING,
        description: "Learn how to send info, warning, error, and fatal logs.",
      },
    ],
  },
  {
    title: "Reference",
    items: [
      {
        title: "Log Event",
        href: ROUTES.DOCS.REFERENCE_LOG_EVENT,
        description: "Understand the structure of a log event sent to Delok.",
      },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Documentation
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Everything you need to start sending and understanding logs with
          Delok.
        </p>
        <DocsHomeSearch />
      </div>

      <div className="space-y-10">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              {section.title}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-surface-hover"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary">
                      {item.title}
                    </h3>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
