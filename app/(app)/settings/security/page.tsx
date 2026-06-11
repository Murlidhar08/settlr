"use client";

import { getListUserAccounts } from "@/actions/user-settings.actions";
import { BackHeader } from "@/components/back-header";
import AppTabs from "@/components/tab/app-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { containerVariants } from "@/lib/animations";
import { useSession } from "@/lib/auth/auth-client";
import { tran } from "@/lib/languages/i18n";
import { motion } from "framer-motion";
import { Key, Lock, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { PasskeyTab } from "./components/passkey-tab";
import { SecureTab } from "./components/secure-tab";
import { TwoFactorTab } from "./components/two-factor-tab";

export default function SecurityPage() {
    const { data: session, isPending } = useSession();
    const [hasPasswordAccount, setHasPasswordAccount] = useState<boolean | null>(null);

    useEffect(() => {
        getListUserAccounts()
            .then(accounts => {
                const hasPassAcc = accounts.some(a => a.providerId === "credential")
                setHasPasswordAccount(hasPassAcc);
            })
    }, [])

    if (isPending || hasPasswordAccount === null) {
        return <SecuritySkeleton />;
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <BackHeader
                title={tran("security.title")}
                backUrl="/settings"
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto max-w-4xl p-6 mt-4"
            >
                <AppTabs
                    defaultTab="password"
                    tabs={[
                        {
                            id: "password",
                            label: tran("security.access.title"),
                            icon: <Lock size={14} />,
                            content: (
                                <SecureTab
                                    email={session?.user.email ?? ""}
                                    hasPasswordAccount={hasPasswordAccount}
                                />
                            )
                        },
                        {
                            id: "2fa",
                            label: tran("security.two_factor.title"),
                            icon: <ShieldCheck size={14} />,
                            content: (
                                <TwoFactorTab
                                    isTwoFactorEnabled={session?.user?.twoFactorEnabled ?? false}
                                    hasPasswordAccount={hasPasswordAccount}
                                />
                            )
                        },
                        {
                            id: "passkeys",
                            label: tran("security.passkeys.title"),
                            icon: <Key size={14} />,
                            content: (
                                <PasskeyTab />
                            )
                        }
                    ]}
                />
            </motion.div>
        </div>
    );
}

// @ts-ignore
function SecuritySkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <BackHeader title={tran("security.title")} />
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
