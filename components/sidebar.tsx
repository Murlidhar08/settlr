"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  User2Icon,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
  LandmarkIcon,
} from "lucide-react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { envClient } from "@/lib/env.client";
import { useUserConfig } from "./providers/user-config-provider";
import { t } from "@/lib/languages/i18n";
import { useSession } from "@/lib/auth-client";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

const Sidebar = () => {
  const { language } = useUserConfig();
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const navItems: NavItem[] = [
    { label: t("nav.dashboard", language), icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { label: t("nav.accounts", language), icon: <LandmarkIcon size={20} />, href: "/accounts" },
    { label: t("nav.parties", language), icon: <User2Icon size={20} />, href: "/parties" },
    { label: t("nav.cashbook", language), icon: <Wallet size={20} />, href: "/cashbook" },
    ...(isAdmin ? [{ label: t("nav.admin", language), icon: <Settings size={20} />, href: "/admin" }] : []),
    { label: t("nav.settings", language), icon: <Settings size={20} />, href: "/settings" },
  ];

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
          <div className="h-10 w-10 shrink-0 flex items-center justify-center relative translate-y-px">
            <Image
              src="/images/logo/light_logo.svg"
              alt={envClient.NEXT_PUBLIC_APP_NAME}
              width={34}
              height={34}
              className="dark:hidden"
            />
            <Image
              src="/images/logo/dark_logo.svg"
              alt={envClient.NEXT_PUBLIC_APP_NAME}
              width={34}
              height={34}
              className="hidden dark:block"
            />
          </div>

          {!collapsed && (
            <span className="text-xl font-black tracking-tight whitespace-nowrap transition-opacity duration-200">
              {envClient.NEXT_PUBLIC_APP_NAME}
            </span>
          )}
          <span>ROLE: {session?.user.role}</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-6 space-y-1">
          {navItems.map((item) => {
            const active = pathname?.startsWith(item.href);

            return (
              <DesktopNavItem
                key={item.href}
                {...item}
                active={active}
                collapsed={collapsed}
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
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span className="text-sm font-bold uppercase tracking-widest text-[10px]">{t("sidebar.collapse", language)}</span>}
          </button>
        </div>
      </aside>

      {/* ================= Mobile Bottom Nav ================= */}
      <nav className="fixed bottom-0 z-50 w-full border-t border-sidebar-border bg-sidebar/90 backdrop-blur-xl lg:hidden">
        <div className="flex h-16 items-center justify-around px-2">
          {navItems.map((item) => {
            const active = pathname?.startsWith(item.href);

            return (
              <MobileNavItem
                key={item.href}
                {...item}
                active={active}
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
  href: string;
}

function DesktopNavItem({ icon, label, active, collapsed, href }: desktopNavProps) {
  return (
    <Link
      href={href as any}
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
    </Link>
  );
}

/* ================= Mobile Item ================= */
interface MobileNavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  href: string;
}

function MobileNavItem({ icon, label, active, href }: MobileNavItemProps) {
  return (
    <Link
      href={href as any}
      className={clsx(
        "flex flex-col items-center justify-center transition-all duration-300 active:scale-90 h-full min-w-[64px]",
        active ? "text-primary" : "text-muted-foreground"
      )}
    >
      <span className={clsx(
        "transition-all duration-300",
        active ? "scale-100 mb-0.5" : "scale-90 opacity-60"
      )}>
        {icon}
      </span>
      {active && (
        <span className="text-[8px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-bottom-1 duration-300">
          {label}
        </span>
      )}
    </Link>
  );
}


export { Sidebar }
