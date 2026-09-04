// app/docs/reference/log-event/page.tsx
import type { Metadata } from "next";
import { CodeBlock } from "@/src/components/docs/CodeBlock";

export const metadata: Metadata = {
  title: "Log Event",
  description: "Understand the structure of a log event sent to Delok.",
};

export default function LogEventPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">
          Reference
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Log Event
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          The JSON payload sent to the Delok ingestion endpoint.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Example
        </h2>
        <CodeBlock
          language="json"
          code={`{
  "environment": "production",
  "occurredAt": "2026-07-30T12:00:00.000Z",
  "level": "info",
  "event": "user_login",
  "message": "User logged in",
  "payload": {
    "userId": "123"
  }
}`}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Fields
        </h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Field</th>
                <th className="px-4 py-2 font-medium">Source</th>
                <th className="px-4 py-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr>
                <td className="px-4 py-2 font-mono text-foreground">event</td>
                <td className="px-4 py-2">developer</td>
                <td className="px-4 py-2">required</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-foreground">message</td>
                <td className="px-4 py-2">developer</td>
                <td className="px-4 py-2">optional</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-foreground">payload</td>
                <td className="px-4 py-2">developer</td>
                <td className="px-4 py-2">optional structured JSON</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-foreground">level</td>
                <td className="px-4 py-2">SDK</td>
                <td className="px-4 py-2">info | warn | error | fatal</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-foreground">
                  occurredAt
                </td>
                <td className="px-4 py-2">SDK</td>
                <td className="px-4 py-2">ISO timestamp generated at call</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-foreground">
                  environment
                </td>
                <td className="px-4 py-2">developer</td>
                <td className="px-4 py-2">from Delok config</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-mono text-foreground">apiKey</span>{" "}
          authenticates your project and is not part of the JSON body. Keep it
          secret.
        </p>
      </section>
    </article>
  );
}
