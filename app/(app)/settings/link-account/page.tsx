"use client";

import { getCredientialAccounts } from "@/actions/user-settings.actions";
import { BackHeader } from "@/components/back-header";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth/auth";
import { useSession } from "@/lib/auth/auth-client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LinkAccountModalBody } from "../components/link-account-body";

type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number];

export default function LinkAccountPage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [currAccount, setCurrAccount] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCredientialAccounts().then((res) => {
            setCurrAccount(res as Account[]);
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

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    if (isPending || loading) {
        return <LinkAccountSkeleton />;
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <BackHeader
                title="Linked Accounts"
                backUrl="/settings"
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto max-w-lg p-6 mt-4"
            >
                <LinkAccountModalBody currentAccounts={currAccount} />
            </motion.div>
        </div>
    );
}

function LinkAccountSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <BackHeader title="Linked Accounts" />
            <div className="mx-auto max-w-lg p-6 mt-6 space-y-8">
                <div className="space-y-4">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-24 w-full rounded-3xl" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-24 w-full rounded-3xl" />
                    <Skeleton className="h-24 w-full rounded-3xl" />
                </div>
            </div>
        </div>
    );
}
