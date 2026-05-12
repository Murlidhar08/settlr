"use client"

import { envClient } from "@/lib/env.client";
import clsx from "clsx";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useNavItems } from "./use-nav-items";

export default function DesktopNav() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const navItems = useNavItems();

    return (
        <>
            <aside
                className={clsx(
                    "hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-2xl",
                    "transition-[width] duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
                    collapsed ? "w-16" : "w-64"
                )}
            >
                {/* Toggle Button - Floating on Right Edge */}
                <div className="absolute top-22 -right-4">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="flex items-center justify-center h-8 w-8 rounded-full bg-sidebar border border-sidebar-border text-sidebar-foreground shadow-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-300 active:scale-90 cursor-pointer"
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {collapsed ? <ChevronLeft size={16} className="rotate-180" /> : <ChevronLeft size={16} />}
                    </button>
                </div>

                {/* Header */}
                <div className="flex items-center gap-3 px-3 py-6 relative shrink-0">
                    <div className="h-10 w-10 shrink-0 flex items-center justify-center relative rounded-xl bg-sidebar-accent/10">
                        <Image
                            src="/images/logo/light_logo.svg"
                            alt={envClient.NEXT_PUBLIC_APP_NAME}
                            loading="eager"
                            width={26}
                            height={26}
                            className="dark:hidden"
                        />
                        <Image
                            src="/images/logo/dark_logo.svg"
                            alt={envClient.NEXT_PUBLIC_APP_NAME}
                            loading="eager"
                            width={26}
                            height={26}
                            className="hidden dark:block"
                        />
                    </div>

                    {!collapsed && (
                        <span className="text-xl font-black tracking-tight whitespace-nowrap animate-in fade-in duration-500">
                            {envClient.NEXT_PUBLIC_APP_NAME}
                        </span>
                    )}
                </div>

                {/* Nav Container - Ensuring tooltips don't get clipped */}
                <nav className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 py-8 space-y-2 custom-scrollbar px-2">
                        {navItems.map((item) => {
                            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                            return (
                                <DesktopNavItem
                                    key={item.href}
                                    {...item}
                                    active={active}
                                    collapsed={collapsed}
                                />
                            );
                        })}
                    </div>
                </nav>
            </aside>

            {/* Desktop Hidden block */}
            <div className={`hidden lg:block shrink-0 ${collapsed ? "w-16" : "w-64"}`} />
        </>
    );
}

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
            key={href}
            href={href as any}
            className={clsx(
                "group relative flex items-center gap-4 rounded-xl transition-all duration-300 ease-out h-11",
                active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-lg shadow-indigo-500/20"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground",
                collapsed ? "justify-center w-12 mx-auto" : "px-4"
            )}
        >
            <div className={clsx(
                "shrink-0 transition-transform duration-300 group-hover:scale-110",
                active ? "text-sidebar-accent-foreground" : "group-hover:text-sidebar-foreground"
            )}>
                {icon}
            </div>

            {!collapsed && (
                <span className={clsx(
                    "text-sm tracking-wide font-semibold transition-colors whitespace-nowrap",
                    active ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground"
                )}>
                    {label}
                </span>
            )}

            {/* Anti-clipping Tooltip for collapsed mode */}
            {collapsed && (
                <div className="fixed left-20 z-100 flex items-center opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <div className="px-3 py-2 bg-sidebar-accent text-sidebar-accent-foreground text-xs font-bold rounded-lg shadow-2xl whitespace-nowrap relative border border-sidebar-border/20">
                        {label}
                        {/* Tooltip Arrow */}
                        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 border-y-[6px] border-y-transparent border-r-[6px] border-r-sidebar-accent" />
                    </div>
                </div>
            )}
        </Link>
    );
}