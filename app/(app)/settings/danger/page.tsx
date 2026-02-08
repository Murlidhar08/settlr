"use client";

import { useSession } from "@/lib/auth-client";
import { DangerModalBody } from "../components/danger-body";
import { BackHeader } from "@/components/back-header";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function DangerPage() {
    const router = useRouter();
    const { isPending } = useSession();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    if (isPending) {
        return <DangerSkeleton />;
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <BackHeader
                title="Danger Zone"
                backUrl="/settings"
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto max-w-lg p-6 mt-4"
            >
                <DangerModalBody />
            </motion.div>
        </div>
    );
}

function DangerSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <BackHeader title="Danger Zone" />
            <div className="mx-auto max-w-lg p-6 mt-6 space-y-8">
                <div className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-[2.5rem]" />
                </div>
            </div>
        </div>
    );
}
