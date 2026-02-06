"use client";

import { useSession } from "@/lib/auth-client";
import { DangerModalBody } from "../components/danger-modal-body";
import { Header } from "@/components/header";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DangerPage() {
    const router = useRouter();
    const { isPending } = useSession();

    if (isPending) {
        return (
            <div className="min-h-screen bg-background">
                <Header
                    title="Danger Zone"
                    leftAction={
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    }
                />
                <div className="mx-auto max-w-4xl p-6 mt-6 space-y-4">
                    <div className="h-40 w-full animate-pulse rounded-2xl bg-muted" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header
                title="Danger Zone"
                leftAction={
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                }
            />
            <div className="mx-auto max-w-4xl p-6 mt-6">
                <DangerModalBody />
            </div>
        </div>
    );
}
