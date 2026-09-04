// src/components/layout/sidebar/SidebarNavigation.tsx
import { SIDEBAR_ITEMS } from "./sidebar.config";
import { SidebarNavigationItem } from "./SidebarNavigationItem";

type SidebarNavigationProps = {
  organizationSlug: string;
  pathname: string;
  collapsed: boolean;
};

export function SidebarNavigation({
  organizationSlug,
  pathname,
  collapsed,
}: SidebarNavigationProps) {
  return (
    <nav className="flex-1 flex flex-col gap-1 px-2 py-3">
      {SIDEBAR_ITEMS.map((item) => (
        <SidebarNavigationItem
          key={item.label}
          item={item}
          organizationSlug={organizationSlug}
          pathname={pathname}
          collapsed={collapsed}
        />
      ))}
    </nav>
  );
}
