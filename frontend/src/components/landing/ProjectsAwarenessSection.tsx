// src/components/landing/ProjectsAwarenessSection.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  FileText,
  FolderKanban,
  LayoutDashboard,
  PanelLeftClose,
  Settings,
  Users,
} from "lucide-react";
import Image from "next/image";
import { ASSETS } from "@/src/constants/assets";

import type { Project } from "@/src/domains/project";
import { AWARENESS_PROJECTS } from "./delok-projects-awareness.data";

// --- Presentation-only rows (faithful to ProjectCard: bg-surface px-4 py-3 rounded-md) ---
function DashboardProjectRow({ project }: { project: Project }) {
  const countRef = useRef<HTMLSpanElement | null>(null);
  const prevRef = useRef<number | undefined>(project.logCount);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = project.logCount;
    if (
      prev === undefined ||
      project.logCount === undefined ||
      prev === project.logCount ||
      !countRef.current
    )
      return;
    const anim = countRef.current.animate(
      [
        { backgroundColor: "rgba(34, 197, 94, 0.24)" },
        { backgroundColor: "rgba(34, 197, 94, 0)", offset: 1 },
      ],
      { duration: 1000, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
    return () => anim.cancel();
  }, [project.logCount]);

  return (
    <div className="flex items-center justify-between rounded-md bg-surface px-4 py-3 transition-colors hover:bg-surface-hover">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center text-primary">
          <FileText className="h-4 w-4" />
        </span>
        <span className="truncate text-sm font-medium text-foreground">
          {project.name}
        </span>
      </div>
      <span
        ref={countRef}
        className="ml-3 shrink-0 rounded px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
      >
        {project.logCount !== undefined
          ? `${project.logCount.toLocaleString()} logs`
          : "—"}
      </span>
    </div>
  );
}

// --- Presentation-only sidebar — clearly visible (real product) ---
function PreviewSidebar() {
  return (
    <div className="flex w-43 shrink-0 flex-col bg-surface">
      {/* Header — real Delok mark + collapse icon (PanelLeftClose as in SidebarHeader) */}
      <div className="flex items-center justify-between px-3 py-4">
        <Image src={ASSETS.LOGO.LIGHT_TEXT} alt="Delok" width={90} height={22} priority />
        <span
          aria-hidden
          className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground"
        >
          <PanelLeftClose className="h-4 w-4" />
        </span>
      </div>

      {/* Navigation — faithful to sidebar.config */}
      <nav className="flex flex-1 flex-col gap-1 px-2 py-3">
        <span className="flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground/50 cursor-not-allowed">
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          <span className="truncate">Overview</span>
        </span>
        <span className="flex items-center gap-2.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-white">
          <FolderKanban className="h-4 w-4 shrink-0" />
          <span className="truncate">Projects</span>
        </span>
        <span className="flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground/50 cursor-not-allowed">
          <Users className="h-4 w-4 shrink-0" />
          <span className="truncate">Members</span>
        </span>
        <span className="flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground">
          <Settings className="h-4 w-4 shrink-0" />
          <span className="truncate">Settings</span>
        </span>
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-2 py-3">
        <span className="flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground">
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span className="truncate">All organizations</span>
        </span>
      </div>
    </div>
  );
}

function PreviewTopbar() {
  return (
    <div className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-[11px] font-semibold text-primary">
          A
        </span>
        <span className="max-w-30 truncate text-sm font-medium text-foreground sm:max-w-none">
          Acme Corp
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground text-xs font-semibold text-primary">
          JD
        </span>
        <span className="hidden text-xs font-medium text-foreground sm:inline">
          Jane Doe
        </span>
      </div>
    </div>
  );
}

export function ProjectsAwarenessSection() {
  const [hasEntered, setHasEntered] = useState(false);
  const [projects, setProjects] = useState<Project[]>(AWARENESS_PROJECTS);

  const sectionRef = useRef<HTMLElement | null>(null);
  const hasEnteredRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || hasEnteredRef.current) return;
    const trigger = () => {
      if (hasEnteredRef.current) return;
      hasEnteredRef.current = true;
      setHasEntered(true);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        trigger();
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(section);
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      observer.disconnect();
      trigger();
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasEntered) return;
    let cancelled = false;
    const schedule = () => {
      const delay = 2600 + Math.random() * 1400;
      const t = setTimeout(() => {
        if (cancelled) return;
        setProjects((prev) => {
          const idx = Math.floor(Math.random() * prev.length);
          const inc = 1 + Math.floor(Math.random() * 5);
          return prev.map((p, i) =>
            i === idx ? { ...p, logCount: (p.logCount ?? 0) + inc } : p,
          );
        });
        schedule();
      }, delay);
      timersRef.current.push(t);
    };
    const initial = setTimeout(schedule, 1800);
    timersRef.current.push(initial);
    return () => {
      cancelled = true;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [hasEntered]);

  return (
    <section ref={sectionRef} className="w-full overflow-hidden py-32 lg:py-40">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[35%_1fr] lg:gap-6 xl:gap-8">
          {/* Headline — left ~35%, natural wrapping (2 lines) */}
          <div
            className={`lg:pr-4 xl:pr-6 ${
              hasEntered ? "animate-section-heading" : "opacity-0"
            }`}
          >
            <h2 className="text-4xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-5xl lg:text-[2.7rem] xl:text-[3.25rem] text-pretty">
              Every <span className="text-primary">project,</span> alive at a
              glance.
            </h2>
          </div>

          {/* Dashboard — right 70%, large */}
          <div
            className={`relative min-w-0 overflow-hidden ${
              hasEntered ? "animate-section-visual" : "opacity-0"
            }`}
          >
            <div className="relative flex justify-end overflow-hidden rounded-xl bg-background lg:justify-start">
              {/* Atmospheric border — top more visible, bottom/sides fade */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-xl border border-white/[0.07]"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 58%, transparent 97%), radial-gradient(ellipse 94% 88% at 50% 38%, black 62%, transparent 92%)",
                  maskImage:
                    "linear-gradient(to bottom, black 58%, transparent 97%), radial-gradient(ellipse 94% 88% at 50% 38%, black 62%, transparent 92%)",
                  WebkitMaskComposite: "source-in" as const,
                  maskComposite: "intersect" as const,
                }}
              />
              <div className="flex h-105 w-170 shrink-0 sm:h-115 sm:w-180 lg:h-130 lg:w-full lg:min-w-0">
                <PreviewSidebar />
                <div className="flex min-w-115 flex-1 flex-col">
                  <PreviewTopbar />
                  <div className="flex flex-1 flex-col overflow-hidden p-4 sm:p-5 lg:p-6">
                    <div className="mb-4 flex shrink-0 items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">
                        Projects
                      </h3>
                      <span className="font-mono text-xs text-muted-foreground">
                        {projects.length} total
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-3 overflow-hidden">
                      {projects.map((project) => (
                        <DashboardProjectRow
                          key={project.id}
                          project={project}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Horizontal fade between headline area and dashboard — left edge */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-[22%] bg-linear-to-r from-background via-background/70 to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-[36%] bg-linear-to-r from-background via-background/35 via-42% to-transparent"
              />
              {/* Bottom + right atmospheric blend */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] bg-linear-to-t from-background via-background/70 via-30% to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 w-[8%] bg-linear-to-l from-background/50 to-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
