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

interface sidebarProps {
    collapsed: boolean;
    onCollapse: (status: boolean) => VoidFunction;
}

export default function Sidebar({ collapsed, onCollapse }: sidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <>
            {/* ================= Desktop Sidebar ================= */}
            <aside
                className={clsx(
                    "hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:flex-col border-r bg-white dark:bg-slate-900",
                    "transition-[width] duration-300 ease-in-out",
                    collapsed ? "w-20" : "w-64"

                )}
            >
                {/* Header */}
                <div className="flex items-center gap-3 border-b px-4 py-5">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-[#2C3E50] text-white flex items-center justify-center">
                        <Wallet className="h-5 w-5" />
                    </div>

                    {!collapsed && (
                        <span className="text-xl font-bold whitespace-nowrap transition-opacity duration-200">
                            Settlr
                        </span>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const active = !!pathname?.includes(item.href);

                        return (
                            <DesktopNavItem
                                key={item.href}
                                {...item}
                                active={active}
                                collapsed={collapsed}
                                onClick={() => router.push(item.href)}
                            />
                        );
                    })}
                </nav>

                {/* Collapse Toggle */}
                <div className="border-t p-3">
                    <button
                        onClick={() => onCollapse(!collapsed)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                        {collapsed ? <ChevronRight /> : <ChevronLeft />}
                        {!collapsed && <span className="text-sm">Collapse</span>}
                    </button>
                </div>
            </aside>

            {/* ================= Mobile Bottom Nav ================= */}
            <nav className="fixed bottom-0 z-50 w-full border-t bg-white dark:bg-slate-900 pb-safe lg:hidden">
                <div className="flex h-20 items-center justify-around">
                    {NAV_ITEMS.map((item) => {
                        const active = !!pathname?.includes(item.href);

                        return (
                            <MobileNavItem
                                key={item.href}
                                {...item}
                                active={active}
                                onClick={() => router.push(item.href)}
                            />
                        );
                    })}
                </div>
            </nav>
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
                "group relative flex items-center rounded-xl px-3 py-3 font-medium transition-all duration-200 w-full",
                active
                    ? "bg-slate-200 text-[#2C3E50] dark:bg-slate-800"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800",
                collapsed ? "justify-center" : "gap-3 justify-start"
            )}
        >
            {/* Active indicator */}
            <span
                className={clsx(
                    "absolute left-0 h-6 w-1 rounded-r bg-[#2C3E50] transition-opacity",
                    active ? "opacity-100" : "opacity-0"
                )}
            />

            <span className="transition-transform duration-200 group-hover:scale-110">
                {icon}
            </span>

            {!collapsed && (
                <span className={clsx("whitespace-nowrap", active && "font-semibold")}>
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
                "flex flex-col items-center gap-1 transition-all duration-200 active:scale-90",
                active ? "text-[#2C3E50]" : "text-slate-400"
            )}
        >
            <span className={clsx("transition-transform", active && "scale-110")}>
                {icon}
            </span>
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
}
