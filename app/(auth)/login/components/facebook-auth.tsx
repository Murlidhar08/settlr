"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { signInWithFacebook } from "@/lib/auth/auth-client";
import Image from "next/image";
import { useState } from "react";

export default function FacebookAuth({ lastLogin, loading, setLoading }: { lastLogin: string, loading: boolean, setLoading: (loading: boolean) => void }) {
    const [facebookLoading, setFacebookLoading] = useState(false);

    const handleFacebookLogin = async () => {
        setLoading(true);
        setFacebookLoading(true)
        try {
            await signInWithFacebook();
        } catch (err) {
            console.error(err);
            setFacebookLoading(false)
            setLoading(false);
        }
    }

    return (
        <Button
            onClick={handleFacebookLogin}
            variant="outline"
            tabIndex={7}
            disabled={loading}
            className="relative rounded-2xl h-14 px-6 flex items-center justify-center gap-3 hover:bg-muted/50 border-border/50 transition-all duration-300 active:scale-[0.98] group/facebook shadow-sm"
        >
            {facebookLoading ? (
                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
                <Image src="/images/social/facebook.svg" alt="Facebook" width={20} height={20} className="group-hover/facebook:scale-110 transition-transform" />
            )}
            <span className="font-bold">{facebookLoading ? "..." : "Facebook"}</span>
            {lastLogin === "facebook" && !facebookLoading && (
                <Badge variant="secondary" className="absolute -top-3 -right-2 px-3 py-1 bg-background border-primary/20 text-primary shadow-md">Last used</Badge>
            )}
        </Button>
    )
}