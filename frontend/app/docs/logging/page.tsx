// app/docs/logging/page.tsx
import type { Metadata } from "next";

import LoggingPage from "@/src/views/docs/logging/LoggingPage";

export const metadata: Metadata = {
  title: "Logging",
  description:
    "Learn how to send structured application logs with info, warn, error, and fatal levels using the Delok SDK.",
  alternates: { canonical: "https://delok.site/docs/logging" },
};

export default function Page() {
  return <LoggingPage />;
}
