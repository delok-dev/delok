// src/views/docs/logging/LoggingPage.tsx
import { CodeBlock } from "@/src/components/docs/CodeBlock";
import { Callout } from "@/src/components/docs/Callout";

export default function LoggingPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">
          SDK
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Logging
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          Send structured events with level, message, and payload. Logs are sent
          immediately
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Methods
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The SDK exposes four methods. Level is determined by the method you
          call.
        </p>
        <div className="space-y-6">
          <div>
            <h3 className="font-mono text-sm font-semibold text-foreground">
              info()
            </h3>
            <p className="text-sm text-muted-foreground">
              Normal application events.
            </p>
            <div className="mt-3">
              <CodeBlock
                language="typescript"
                code={`delok.info({ event: "user_login" });`}
              />
            </div>
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold text-foreground">
              warn()
            </h3>
            <p className="text-sm text-muted-foreground">
              Potentially problematic conditions.
            </p>
            <div className="mt-3">
              <CodeBlock
                language="typescript"
                code={`delok.warn({
  event: "payment_retry",
  message: "Payment gateway timeout",
});`}
              />
            </div>
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold text-foreground">
              error()
            </h3>
            <p className="text-sm text-muted-foreground">Application errors.</p>
            <div className="mt-3">
              <CodeBlock
                language="typescript"
                code={`delok.error({
  event: "payment_failed",
  message: "Payment failed",
});`}
              />
            </div>
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold text-foreground">
              fatal()
            </h3>
            <p className="text-sm text-muted-foreground">Critical failures.</p>
            <div className="mt-3">
              <CodeBlock
                language="typescript"
                code={`delok.fatal({
  event: "database_crash",
  message: "Primary DB unavailable",
});`}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Event shape
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <span className="font-mono text-foreground">event</span> — required,
            non-empty string
          </li>
          <li>
            <span className="font-mono text-foreground">message</span> —
            optional string
          </li>
          <li>
            <span className="font-mono text-foreground">payload</span> —
            optional structured JSON
          </li>
          <li>
            All methods return{" "}
            <span className="font-mono text-foreground">void</span>
          </li>
        </ul>
        <Callout>
          <p>
            <span className="font-mono text-foreground">error()</span> does not
            automatically capture JavaScript{" "}
            <span className="font-mono text-foreground">Error</span> objects.
            Pass <span className="font-mono text-foreground">event</span> and{" "}
            <span className="font-mono text-foreground">payload</span>{" "}
            explicitly.
          </p>
        </Callout>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Error handling
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The SDK sends logs fire-and-forget. Failures are swallowed internally (logged to self-monitoring); logging methods never reject.
        </p>
        <Callout>
          <p>
            If you need delivery guarantees, check the self-monitoring channel (DelokError events) rather than wrapping calls in try/catch.
        </Callout>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Configuration errors (invalid Delok constructor args) throw synchronously from{" "}
            <span className="font-mono text-foreground">new Delok()</span>
          </li>
          <li>Event validation catches invalid input before the request is sent</li>
          <li>
            Delivery failures are swallowed internally and logged to self-monitoring{" "}
            <span className="font-mono text-foreground">DelokError</span>
          </li>
        </ul>
      </section>
    </article>
  );
}
