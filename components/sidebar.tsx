"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User2Icon,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { envClient } from "@/lib/env.client";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard />, href: "/dashboard" },
  { label: "Parties", icon: <User2Icon />, href: "/parties" },
  { label: "Cashbook", icon: <Wallet />, href: "/cashbook" },
  { label: "Settings", icon: <Settings />, href: "/settings" },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* ================= Desktop Sidebar ================= */}
      <aside
        className={clsx(
          "hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:flex-col border-r bg-sidebar text-sidebar-foreground border-sidebar-border",
          "transition-[width] duration-300 ease-in-out",
          collapsed ? "w-20" : "w-64"

        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-5">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center shadow-lg shadow-sidebar-primary/20">
            <Wallet className="h-5 w-5" />
          </div>

          {!collapsed && (
            <span className="text-xl font-black tracking-tight whitespace-nowrap transition-opacity duration-200">
              {envClient.NEXT_PUBLIC_APP_NAME}
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = !!pathname?.includes(item.href);

            return (
              <DesktopNavItem
                key={item.href}
                {...item}
                active={active}
                collapsed={collapsed}
                onClick={() => router.push(item.href as any)}
              />
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-sidebar-border border-t p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all active:scale-95"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            {!collapsed && <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ================= Mobile Bottom Nav ================= */}
      <nav className="fixed bottom-0 z-50 w-full border-t border-sidebar-border bg-sidebar/80 backdrop-blur-xl pb-safe lg:hidden">
        <div className="flex h-20 items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const active = !!pathname?.includes(item.href);

            return (
              <MobileNavItem
                key={item.href}
                {...item}
                active={active}
                onClick={() => router.push(item.href as any)}
              />
            );
          })}
        </div>
      </nav>

      <div className={`hidden lg:block shrink-0 ${collapsed ? "w-20" : "w-64"}`} />
    </>
  );
}

/* ================= Desktop Item ================= */
interface desktopNavProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}

function DesktopNavItem({ icon, label, active, collapsed, onClick }: desktopNavProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "group relative flex items-center rounded-xl px-3 py-3 font-bold transition-all duration-300 w-full",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
          : "text-muted-foreground hover:bg-sidebar-accent/15 hover:text-sidebar-foreground",
        collapsed ? "justify-center" : "gap-4 justify-start"
      )}
    >
      <span className={clsx(
        "transition-transform duration-300 group-hover:scale-110",
        active
          ? "text-sidebar-accent-foreground"
          : "text-muted-foreground group-hover:text-sidebar-foreground dark:text-sidebar-foreground/70"
      )}>
        {icon}
      </span>

      {!collapsed && (
        <span className={clsx("whitespace-nowrap text-sm", active && "tracking-wide")}>
          {label}
        </span>
      )}
    </button>
  );
}

/* ================= Mobile Item ================= */
interface MobileNavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function MobileNavItem({ icon, label, active, onClick }: MobileNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex flex-col items-center gap-1 transition-all duration-300 active:scale-90 px-4",
        active ? "text-sidebar-primary" : "text-muted-foreground"
      )}
    >
      <span className={clsx("transition-all duration-300", active ? "scale-110 drop-shadow-[0_0_8px_rgba(var(--sidebar-primary),0.5)]" : "opacity-70")}>
        {icon}
      </span>
      <span className={clsx("text-[10px] font-black uppercase tracking-tighter", active && "tracking-widest")}>{label}</span>
    </button>
  );
}

export { Sidebar }
