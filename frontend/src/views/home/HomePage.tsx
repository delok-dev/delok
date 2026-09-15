// src/views/home/HomePage.tsx
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { LogInvestigationSection } from "./components/LogInvestigationSection";
import { ProjectsAwarenessSection } from "./components/ProjectsAwarenessSection";
import { FindSignalSection } from "./components/FindSignalSection";
import { GetStartedSection } from "./components/GetStartedSection";
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
        <GetStartedSection />
        <Footer />
      </div>
    </HomeGate>
  );
}

export default HomePage;
