"use client";

import { getCredientialAccounts } from "@/actions/user-settings.actions";
import { BackHeader } from "@/components/back-header";
import { useUserConfig } from "@/components/providers/user-config-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth/auth";
import { t } from "@/lib/languages/i18n";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LinkAccountModalBody } from "./components/link-account-body";

type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number];

export default function LinkAccountPage() {
    const { language } = useUserConfig();
    const [currAccount, setCurrAccount] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCredientialAccounts().then((res) => {
            setCurrAccount(res as Account[]);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <LinkAccountSkeleton />;
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <BackHeader
                title={t("linked_accounts.title", language)}
                backUrl="/settings"
            />

            <motion.div
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
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
    const { language } = useUserConfig();
    return (
        <div className="min-h-screen bg-background">
            <BackHeader title={t("linked_accounts.title", language)} />
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
