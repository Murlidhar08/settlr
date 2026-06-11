"use client"

import { tran } from "@/lib/languages/i18n";

export default function WelcomeNote({ firstName }: { firstName: string }) {
    return (
        <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tighter sm:text-4xl text-foreground">
                {tran("dashboard.hello")}, <span className="text-primary">{firstName}</span> 👋
            </h1>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground/60">
                {tran("dashboard.subtitle")}
            </p>
        </div>
    );
}
