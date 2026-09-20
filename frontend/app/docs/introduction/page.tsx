// app/docs/introduction/page.tsx
import type { Metadata } from "next";

import IntroductionPage from "@/src/views/docs/introduction/IntroductionPage";

export const metadata: Metadata = {
  title: "Introduction",
  description:
    "Learn what Delok is, how it works, and how to centralize application logs for monitoring and search.",
  alternates: { canonical: "https://delok.site/docs/introduction" },
};

export default function Page() {
  return <IntroductionPage />;
}
