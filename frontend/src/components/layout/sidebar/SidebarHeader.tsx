// src/components/layout/sidebar/SidebarHeader.tsx
import { ASSETS } from "@/src/constants/assets";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Image from "next/image";

type SidebarHeaderProps = {
  collapsed: boolean;
  pinned: boolean;
  onToggle: () => void;
};

export function SidebarHeader({
  collapsed,
  pinned,
  onToggle,
}: SidebarHeaderProps) {
  return (
    <div
      className={`px-3 py-4 flex items-center ${
        collapsed ? "justify-center" : "justify-between"
      }`}
    >
      {collapsed ? (
        <button
          type="button"
          onClick={onToggle}
          title="Expand sidebar"
          aria-label="Expand sidebar"
          className="flex items-center justify-center rounded-md hover:bg-surface-hover transition-colors cursor-pointer"
        >
          <Image
            src={ASSETS.LOGO.LIGHT}
            alt=""
            aria-hidden
            width={24}
            height={24}
          />
        </button>
      ) : (
        <>
          <Image src={ASSETS.LOGO.LIGHT_TEXT} alt="Delok" width={90} height={22} />

          <button
            type="button"
            onClick={onToggle}
            title={pinned ? "Collapse sidebar" : "Pin sidebar"}
            aria-label={pinned ? "Collapse sidebar" : "Pin sidebar"}
            className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors cursor-pointer"
          >
            {pinned ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </button>
        </>
      )}
    </div>
  );
}
