// src/views/home/HomePage.tsx
import { Navbar } from "@/src/components/layout/navigation/Navbar";
import { Hero } from "./components/Hero";
import { LogInvestigationSection } from "./components/LogInvestigationSection";
import { ProjectsAwarenessSection } from "./components/ProjectsAwarenessSection";
import { FindSignalSection } from "./components/FindSignalSection";
import { InstallCtaSection } from "./components/InstallCtaSection";
import { Footer } from "@/src/components/layout/Footer";
import { HomeGate } from "./components/HomeGate";

export function HomePage() {
  return (
    <HomeGate>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <Hero />
        <LogInvestigationSection />
        <ProjectsAwarenessSection />
        <FindSignalSection />
        <InstallCtaSection />
        <Footer />
      </div>
    </HomeGate>
  );
}

export default HomePage;