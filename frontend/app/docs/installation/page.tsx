// app/docs/installation/page.tsx
import type { Metadata } from "next";
import { CodeBlock } from "@/src/components/docs/CodeBlock";

export const metadata: Metadata = {
  title: "Installation",
  description: "Install the Delok SDK.",
};

export default function InstallationPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">
          SDK
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Installation
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          Install the Delok SDK.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Requirements
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Node.js <span className="font-mono text-foreground">&gt;=18</span>
          </li>
          <li>No runtime dependencies</li>
          <li>No peer dependencies</li>
          <li>Available as both ESM and CommonJS</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Install
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Install the Delok SDK
        </p>
        <CodeBlock language="bash" code={`npm install delok`} />
        <p className="text-sm leading-relaxed text-muted-foreground">
          Delok requires Node.js 18 or later.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Verify
        </h2>
        <CodeBlock
          language="typescript"
          code={`import { Delok } from "delok";

const delok = new Delok({
  apiKey: "your_api_key",
  environment: "development",
});`}
        />
        <p className="text-sm leading-relaxed text-muted-foreground">
          If <span className="font-mono text-foreground">apiKey</span> or{" "}
          <span className="font-mono text-foreground">environment</span> is
          invalid, the constructor throws{" "}
          <span className="font-mono text-foreground">
            DelokConfigurationError
          </span>
          .
        </p>
      </section>
    </article>
  );
}
