"use client";
import { useEffect, useState } from "react";
import { Header } from "./header";
import { tran } from "@/lib/languages/i18n";

export function AppHeader(props: { title: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <header className="sticky top-0 z-40 h-14 sm:h-16 flex items-center justify-between bg-background px-4 sm:px-6 border-b border-border shadow-sm">
                <div className="flex items-center gap-4">
                    {/* Hamburger skeleton for mobile */}
                    <div className="h-9 w-9 rounded-xl bg-muted animate-pulse lg:hidden" />
                    {/* Title skeleton */}
                    <div className="h-6 w-24 sm:h-7 sm:w-32 bg-muted rounded-lg animate-pulse" />
                </div>
                {/* Profile skeleton */}
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-muted animate-pulse" />
            </header>
        );
    }

    return (
        <Header title={tran(props.title)} />
    );
}

