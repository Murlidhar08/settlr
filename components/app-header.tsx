"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { useUserConfig } from "./providers/user-config-provider";
import { t } from "@/lib/languages/i18n";
import { useEffect, useState } from "react";

const ROUTE_TITLE_MAP: Record<string, string> = {
    "/dashboard": "dashboard.title",
    "/accounts": "accounts.title",
    "/parties": "parties.title",
    "/cashbook": "cashbook.title",
    "/settings": "settings.title",
    "/profile": "settings.title", // Or map to a specific profile key if exists
};

export function AppHeader() {
    const pathname = usePathname();
    const { language } = useUserConfig();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Find the exact match or the parent match
    const translationKey = ROUTE_TITLE_MAP[pathname];
    const isTopLevelRoute = !!translationKey;

    // Only show header (or its skeleton) if it's a designated top-level route
    if (!isTopLevelRoute)
        return null;

    if (!mounted) {
        return (
            <header className="sticky top-0 z-40 flex items-center justify-between bg-background/80 dark:bg-background/60 backdrop-blur-xl px-6 py-4 border-b border-border/90">
                <div className="flex items-center gap-4">
                    {/* Logo area skeleton for mobile */}
                    <div className="h-10 w-10 rounded-xl bg-muted animate-pulse lg:hidden" />
                    {/* Title skeleton */}
                    <div className="h-8 w-32 bg-muted rounded-lg animate-pulse lg:h-10 lg:w-48" />
                </div>
                {/* Profile skeleton */}
                <div className="h-11 w-11 rounded-full bg-muted animate-pulse" />
            </header>
        );
    }

    return (
        <Header title={t(translationKey, language)} />
    );
}

