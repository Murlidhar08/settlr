"use client";

import { useSession } from "@/lib/auth-client";
import { SecurityModalBody } from "../components/security-modal-body";
import { BackHeader } from "@/components/back-header";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function SecurityPage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();

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
        return <SecuritySkeleton />;
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <BackHeader
                title="Security"
                backUrl="/settings"
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto max-w-lg p-6 mt-4"
            >
                <SecurityModalBody
                    email={session?.user.email ?? ""}
                    isTwoFactorEnabled={session?.user?.twoFactorEnabled ?? false}
                />
            </motion.div>
        </div>
    );
}

function SecuritySkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <BackHeader title="Security" />
            <div className="mx-auto max-w-lg p-6 mt-6 space-y-8">
                <div className="space-y-4">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-48 w-full rounded-3xl" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-32 w-full rounded-3xl" />
                </div>
            </div>
        </div>
    );
}
