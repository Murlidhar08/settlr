"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth/auth-client";
import Image from "next/image";
import { useState } from "react";

export default function GoogleAuth({ lastLogin, loading, setLoading }: { lastLogin: string, loading: boolean, setLoading: (loading: boolean) => void }) {
    const [googleLoading, setGoogleLoading] = useState(false);
    const handleGoogle = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
        } catch (err) {
            console.error(err);
            setGoogleLoading(false);
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleGoogle}
            variant="outline"
            tabIndex={5}
            disabled={loading || googleLoading}
            className="relative rounded-2xl h-14 px-6 flex items-center justify-center gap-3 hover:bg-muted/50 border-border/50 transition-all duration-300 active:scale-[0.98] group/google shadow-sm"
        >
            {googleLoading ? (
                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
                <Image src="/images/social/google.svg" alt="Google" width={20} height={20} className="group-hover/google:scale-110 transition-transform" />
            )}
            <span className="font-bold">{googleLoading ? "..." : "Google"}</span>
            {lastLogin === "google" && !googleLoading && (
                <Badge variant="secondary" className="absolute -top-3 -right-2 px-3 py-1 bg-background border-primary/20 text-primary shadow-md">Last used</Badge>
            )}
        </Button>
    )
}