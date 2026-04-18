"use client";

import { useSession } from "@/lib/auth/auth-client";
import { envClient } from "@/lib/env.client";
import { t } from "@/lib/languages/i18n";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  LandmarkIcon,
  LayoutDashboard,
  Settings,
  User2Icon,
  UserRoundCog,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useUserConfig } from "./providers/user-config-provider";

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
    ...(isAdmin ? [{ label: t("nav.admin", language), icon: <UserRoundCog size={20} />, href: "/admin" }] : []),
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
              loading="eager"
              width={34}
              height={34}
              className="dark:hidden"
            />
            <Image
              src="/images/logo/dark_logo.svg"
              alt={envClient.NEXT_PUBLIC_APP_NAME}
              loading="eager"
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
      <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center lg:hidden px-4">
        <nav className="w-full max-w-md h-18 px-2 py-2 bg-background/80 dark:bg-card/80 backdrop-blur-2xl border border-border shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[2.5rem] flex items-center justify-around relative">
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
        </nav>
      </div>
      {/* Bottom Shade */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-linear-to-t from-background to-transparent h-28 pointer-events-none lg:hidden"></div>

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

function MobileNavItem({ icon, active, href }: MobileNavItemProps) {
  return (
    <Link
      href={href as any}
      className="flex flex-col items-center justify-center transition-all duration-300 active:scale-95 group h-full w-full relative"
    >
      <div className={clsx(
        "relative flex flex-col items-center justify-center h-full w-full transition-all duration-500 rounded-[1.5rem] overflow-hidden",
        active
          ? "bg-primary/20 text-primary shadow-[inset_0_0_15px_rgba(var(--primary-rgb),0.15)]"
          : "bg-transparent text-muted-foreground hover:bg-muted/15"
      )}>
        {/* ICON with smooth transition */}
        <div className="relative w-6 h-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active ? "active" : "inactive"}
              initial={{ opacity: 0, scale: 0.5, rotate: active ? -15 : 15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {icon}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Animated Active Background Indicator */}
        {active && (
          <motion.div
            layoutId="active-pill"
            className="absolute inset-0 bg-primary/10 -z-10"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </div>
    </Link>
  );
}


export { Sidebar };

