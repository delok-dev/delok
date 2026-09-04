// app/page.tsx
import {
  Navbar,
  Hero,
  LogInvestigationSection,
  ProjectsAwarenessSection,
  FindSignalSection,
  GetStartedSection,
  Footer,
} from "@/src/components/landing";
import { HomeGate } from "@/src/components/landing/HomeGate";

export default function HomePage() {
  return (
    <HomeGate>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <Hero />
        <LogInvestigationSection />
        <ProjectsAwarenessSection />
        <FindSignalSection />
        <GetStartedSection />
        <Footer />
      </div>
    </HomeGate>
  );
}
