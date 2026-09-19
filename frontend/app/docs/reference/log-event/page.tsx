// app/docs/reference/log-event/page.tsx
import type { Metadata } from "next";

import LogEventPage from "@/src/views/docs/reference/log-event/LogEventPage";

export const metadata: Metadata = {
  title: "Log Event",
  description:
    "Reference for the Delok log event — fields, types, and the JSON payload sent to the ingestion endpoint.",
  alternates: { canonical: "https://delok.site/docs/reference/log-event" },
};

export default function Page() {
  return <LogEventPage />;
}
