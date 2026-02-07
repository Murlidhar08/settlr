"use client";

import { useSession } from "@/lib/auth-client";
import { SessionModalBody } from "../components/session-modal-body";
import { getListSessions } from "@/actions/user-settings.actions";
import { useEffect, useState } from "react";
import { Session } from "@/lib/generated/prisma/client";
import { BackHeader } from "@/components/back-header";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    if (isPending || loading) {
        return <SessionSkeleton />;
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <BackHeader
                title="Active Sessions"
                backUrl="/settings"
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto max-w-lg p-6 mt-4"
            >
                <SessionModalBody
                    sessions={sessionsList as any}
                    currentSessionToken={session?.session.token}
                />
            </motion.div>
        </div>
    );
}

function SessionSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <BackHeader title="Active Sessions" />
            <div className="mx-auto max-w-lg p-6 mt-6 space-y-8">
                <div className="space-y-4">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-28 w-full rounded-3xl" />
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-8 w-24 rounded-lg" />
                    </div>
                    {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-28 w-full rounded-3xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}
