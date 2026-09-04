// app/docs/introduction/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: "Introduction",
  description: "What Delok is and why you would use it.",
};

export default function IntroductionPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">
          Getting Started
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Introduction
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Delok helps developers collect and explore application logs in one
          place.
        </p>
      </header>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          Instead of relying only on terminal output or scattered server logs,
          Delok gives your application a central place to send and inspect
          structured logs.
        </p>

        <p>You can use Delok to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>record application events</li>
          <li>understand what happened in your application</li>
          <li>attach structured data to logs</li>
          <li>inspect logs from your projects</li>
          <li>See what your systems are doing</li>
        </ul>

        <p>
          Delok is built with a lightweight SDK. You initialize it once and send
          logs with <span className="font-mono text-foreground">info()</span>,{" "}
          <span className="font-mono text-foreground">warn()</span>,{" "}
          <span className="font-mono text-foreground">error()</span>, and{" "}
          <span className="font-mono text-foreground">fatal()</span>. Each log
          carries the context you provide — event name, message, and payload —
          along with the environment you configured.
        </p>

        <div className="flex gap-3 pt-4">
          <Link
            href={ROUTES.DOCS.QUICKSTART}
            className="inline-flex items-center gap-1.5 justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Quickstart
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
