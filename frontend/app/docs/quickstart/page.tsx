// app/docs/quickstart/page.tsx
import type { Metadata } from "next";

import QuickstartPage from "@/src/views/docs/quickstart/QuickstartPage";

export const metadata: Metadata = {
  title: "Quickstart",
  description:
    "Create a project, generate an API key, and send your first application log with the Delok SDK.",
  alternates: { canonical: "https://delok.site/docs/quickstart" },
};

export default function Page() {
  return <QuickstartPage />;
}
