"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { signInWithDiscord } from "@/lib/auth/auth-client";
import Image from "next/image";
import { useState } from "react";

export default function DiscordAuth({ lastLogin, loading, setLoading }: { lastLogin: string, loading: boolean, setLoading: (loading: boolean) => void }) {
    const [discordLoading, setDiscordLoading] = useState(false);

    const handleDiscordLogin = async () => {
        setLoading(true);
        setDiscordLoading(true)
        try {
            await signInWithDiscord();
        } catch (err) {
            console.error(err);
            setDiscordLoading(false)
            setLoading(false);
        }
    }

    return (
        <Button
            onClick={handleDiscordLogin}
            variant="outline"
            tabIndex={6}
            disabled={loading}
            className="relative rounded-2xl h-14 px-6 flex items-center justify-center gap-3 hover:bg-muted/50 border-border/50 transition-all duration-300 active:scale-[0.98] group/discord shadow-sm"
        >
            {discordLoading ? (
                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
                <Image src="/images/social/discord.svg" alt="Discord" width={20} height={20} className="group-hover/discord:scale-110 transition-transform" />
            )}
            <span className="font-bold">{discordLoading ? "..." : "Discord"}</span>
            {lastLogin === "discord" && !discordLoading && (
                <Badge variant="secondary" className="absolute -top-3 -right-2 px-3 py-1 bg-background border-primary/20 text-primary shadow-md">Last used</Badge>
            )}
        </Button>
    )
}