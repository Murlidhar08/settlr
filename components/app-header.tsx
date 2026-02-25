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

    if (!mounted) return null;

    // Find the exact match or the parent match
    // For now, we only handle top-level routes as per user request to "change title text based on url"
    const translationKey = ROUTE_TITLE_MAP[pathname];

    // If no translation key found, it might be a subpage (which likely uses BackHeader)
    // For subpages, we might want to hide this global header
    const isTopLevelRoute = !!translationKey;

    if (!isTopLevelRoute) return null;

    return (
        <Header title={t(translationKey, language)} />
    );
}
