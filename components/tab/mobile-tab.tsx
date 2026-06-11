"use client"

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { TabItem } from "../navbar/tab-item";
import { useNavItems } from "../navbar/use-nav-items";

const SPRING_TRANSITION = { type: "spring", stiffness: 400, damping: 30 } as const;

interface MobileNavProps {
    navItems?: (TabItem & { active?: boolean })[];
    onChange?: (value: string) => void;
}

export default function MobileNav({ navItems: propNavItems, onChange }: MobileNavProps) {
    const pathname = usePathname();
    const defaultNavItems = useNavItems();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navItems = propNavItems && propNavItems.length > 0 ? propNavItems : defaultNavItems;

    if (!mounted) return null;

    return (
        <>
            <div className="fixed bottom-2 left-0 right-0 z-50 flex justify-center lg:hidden px-6">
                <nav className="w-full max-w-110 h-16 p-2 bg-background/70 dark:bg-card/60 backdrop-blur-3xl border border-border/50 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-3xl flex items-center justify-between relative overflow-hidden">
                    {navItems.map((item) => {
                        const active = item.active !== undefined
                            ? item.active
                            : (item.href ? pathname === item.href : false);

                        return (
                            <MobileNavItem
                                onChange={onChange}
                                key={item.id}
                                {...item}
                                active={active}
                            />
                        );
                    })}
                </nav>
            </div>

            {/* Mobile bottom shade */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-linear-to-t from-background via-background/80 to-transparent h-32 pointer-events-none lg:hidden opacity-80"></div>
        </>
    );
}

interface MobileNavItemProps {
    icon?: React.ReactNode;
    label: string;
    active: boolean;
    href?: string;
    onChange?: (value: string) => void;
}

function MobileNavItem({ icon, label, active, href, onChange }: MobileNavItemProps) {
    const isHash = href?.startsWith("#");

    const handleClick = (e: React.MouseEvent) => {
        if (isHash && href && onChange) {
            e.preventDefault();
            onChange(href.replace("#", ""));
        } else if (onChange && href) {
            onChange(href);
        }
    };

    return (
        <Link
            href={(href || "#") as any}
            onClick={handleClick}
            aria-label={label}
            className="relative flex-1 flex items-center justify-center h-full group"
        >
            <div className={clsx(
                "relative z-10 flex items-center justify-center transition-all duration-300",
                active ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground active:scale-90"
            )}>
                <div className="flex items-center justify-center [&>svg]:size-5">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active ? "active" : "inactive"}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            {icon}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Sliding Active Background Indicator */}
            {active && (
                <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute inset-x-1 inset-y-0.5 bg-primary/10 dark:bg-primary/20 rounded-2xl z-0"
                    transition={SPRING_TRANSITION}
                />
            )}

            {/* Tiny active dot */}
            {active && (
                <motion.div
                    layoutId="mobile-nav-dot"
                    className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"
                    transition={SPRING_TRANSITION}
                />
            )}
        </Link>
    );
}
