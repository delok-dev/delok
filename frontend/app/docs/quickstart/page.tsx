// app/docs/quickstart/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CodeBlock } from "@/src/components/docs/CodeBlock";
import { Callout } from "@/src/components/docs/Callout";
import { ROUTES } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: "Quickstart",
  description: "Send your first log with the Delok SDK.",
};

export default function QuickstartPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">
          Getting Started
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Quickstart
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          From account to first log. create your project, get an API key, and
          send a structured event.
        </p>
      </header>

      <section id="install" className="scroll-mt-20 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          1. Install the SDK
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Requires Node.js{" "}
          <span className="font-mono text-foreground"> &gt;=18</span>. No
          runtime dependencies.
        </p>
        <CodeBlock language="bash" code={`npm install delok`} />
      </section>

      <section id="account" className="scroll-mt-20 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          2. Log in to Delok
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Create an account or sign in at{" "}
          <span className="font-mono text-foreground">/sign-up</span> and{" "}
          <span className="font-mono text-foreground">/sign-in</span>. After
          authentication you will be redirected to your organizations.
        </p>
        <div className="flex gap-2">
          <Link
            href={ROUTES.AUTH.SIGN_UP}
            className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Create account
          </Link>
          <Link
            href={ROUTES.AUTH.SIGN_IN}
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground hover:bg-surface-hover"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section id="organization" className="scroll-mt-20 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          3. Open your organization
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Delok organizes work by{" "}
          <span className="font-mono text-foreground">organization</span>.
          Select an existing organization from{" "}
          <span className="font-mono text-foreground">/orgs</span> or create a
          new one. All projects belong to an organization.
        </p>
      </section>

      <section id="project" className="scroll-mt-20 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          4. Create a project
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Inside your organization, go to{" "}
          <span className="font-mono text-foreground">Projects</span> and create
          a new project. Each project isolates its own logs and API keys.
        </p>
        <Callout>
          <p>
            Clear project names recommended. For example{" "}
            <span className="font-mono text-foreground">api-production</span> or{" "}
            <span className="font-mono text-foreground">web-production</span>.
            You can create multiple projects per organization.
          </p>
        </Callout>
      </section>

      <section id="api-key" className="scroll-mt-20 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          5. Generate an API key
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Open your project, go to{" "}
          <span className="font-mono text-foreground">Settings → API Keys</span>{" "}
          and generate a new key. Copy it immediately, it will be shown only
          once.
        </p>
        <Callout>
          <p>
            Store the key in an environment variable, for example{" "}
            <span className="font-mono text-foreground">DELOK_API_KEY</span>.
            Never commit it to git or expose it to the browser.
          </p>
        </Callout>
      </section>

      <section id="initialize" className="scroll-mt-20 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          6. Initialize Delok
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Connect the SDK to your project by initializing it with the API key
          and environment.
        </p>
        <CodeBlock
          language="typescript"
          code={`import { Delok } from "delok";

const delok = new Delok({
  apiKey: process.env.DELOK_API_KEY!,
  environment: "development", // "development" | "staging" | "production"
});`}
        />
        <p className="text-sm leading-relaxed text-muted-foreground">
          Supported{" "}
          <span className="font-mono text-foreground">environment</span> values
          are <span className="font-mono text-foreground">development</span>,{" "}
          <span className="font-mono text-foreground">staging</span>, and{" "}
          <span className="font-mono text-foreground">production</span>.
        </p>
      </section>

      <section id="first-log" className="scroll-mt-20 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          7. Send your first log
        </h2>
        <CodeBlock
          language="typescript"
          code={`delok.info({
  event: "user_login",
  message: "User successfully logged in",
});`}
        />
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-mono text-foreground">event</span> is required.{" "}
          <span className="font-mono text-foreground">message</span> is
          optional. The method returns{" "}
          <span className="font-mono text-foreground">void</span> and may reject
          on validation, network, timeout, or HTTP errors.
        </p>
      </section>

      <section id="payload" className="scroll-mt-20 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          8. Add structured data
        </h2>
        <CodeBlock
          language="typescript"
          code={`delok.info({
  event: "user_created",
  message: "New user created",
  payload: {
    userId: "123",
    plan: "pro",
  },
});`}
        />
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-mono text-foreground">payload</span> is optional
          structured JSON. You can filter the stored logs by the{" "}
          <span className="font-mono text-foreground">level</span>,{" "}
          <span className="font-mono text-foreground">environment</span>,{" "}
          <span className="font-mono text-foreground">dateTime</span>, or search
          it through the{" "}
          <span className="font-mono text-foreground">message</span> or{" "}
          <span className="font-mono text-foreground">payload</span> in the
          dashboard.
        </p>
      </section>

      <section className="space-y-3 border-t border-border pt-6">
        <h2 className="text-base font-semibold text-foreground">Next steps</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Your log is now visible in the project&apos;s log view. Try varying
          the level with{" "}
          <span className="font-mono text-foreground">warn()</span>,{" "}
          <span className="font-mono text-foreground">error()</span>, and{" "}
          <span className="font-mono text-foreground">fatal()</span>.
        </p>
        <Link
          href={ROUTES.DOCS.LOGGING}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Continue with Logging
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>
    </article>
  );
}
