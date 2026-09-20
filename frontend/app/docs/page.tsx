// app/docs/page.tsx
import type { Metadata } from "next";

import DocsPage from "@/src/views/docs/DocsPage";

export const metadata: Metadata = {
  title: "Documentation | Delok",
  description:
    "Everything you need to start sending and viewing application logs with Delok.",
  alternates: { canonical: "https://delok.site/docs" },
};

export default function Page() {
  return <DocsPage />;
}
