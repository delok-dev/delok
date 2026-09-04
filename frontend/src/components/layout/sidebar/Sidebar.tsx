// src/components/layout/sidebar/Sidebar.tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarFooter } from "./SidebarFooter";

type SidebarProps = {
  organizationSlug: string;
};

const EXPANDED_WIDTH = 178;
const COLLAPSED_WIDTH = 50;

export function Sidebar({ organizationSlug }: SidebarProps) {
  const pathname = usePathname();

  const [pinned, setPinned] = useState(true);
  const [hovered, setHovered] = useState(false);

  // Expanded when pinned OR temporarily hovered.
  const collapsed = !pinned && !hovered;

  // Branches on `pinned` (not the derived `collapsed`): any click on the
  // sidebar happens while the mouse is inside it, so `hovered` is always true
  // by click time. Branching on `collapsed` would make clicking the collapsed
  // logo mark collapse the sidebar instead of expanding it.
  const handleToggle = () => {
    if (pinned) {
      // Collapse permanently. Reset hover so the sidebar closes immediately
      // even if the mouse is still inside the sidebar.
      setPinned(false);
      setHovered(false);
    } else {
      // Expand and pin open.
      setPinned(true);
    }
  };

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
      }}
      className="bg-surface flex flex-col transition-[width] duration-200 ease-in-out"
    >
      <SidebarHeader
        collapsed={collapsed}
        pinned={pinned}
        onToggle={handleToggle}
      />

      <SidebarNavigation
        organizationSlug={organizationSlug}
        pathname={pathname}
        collapsed={collapsed}
      />

      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
}
