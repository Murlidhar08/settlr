"use client";

import { useSession } from "@/lib/auth-client";
import { SessionModalBody } from "../components/session-modal-body";
import { getListSessions } from "@/actions/user-settings.actions";
import { useEffect, useState } from "react";
import { Session } from "@/lib/generated/prisma/client";
import { Header } from "@/components/header";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SessionManagementPage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [sessionsList, setSessionsList] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getListSessions().then((res) => {
            if (res) setSessionsList(res as Session[]);
            setLoading(false);
        });
    }, []);

    if (isPending || loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header
                    title="Session Management"
                    leftAction={
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    }
                />
                <div className="mx-auto max-w-4xl p-6 mt-6 space-y-4">
                    <div className="h-40 w-full animate-pulse rounded-2xl bg-muted" />
                    <div className="h-40 w-full animate-pulse rounded-2xl bg-muted" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header
                title="Session Management"
                leftAction={
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                }
            />
            <div className="mx-auto max-w-4xl p-6 mt-6">
                <SessionModalBody
                    sessions={sessionsList as any}
                    currentSessionToken={session?.session.token}
                />
            </div>
        </div>
    );
}
