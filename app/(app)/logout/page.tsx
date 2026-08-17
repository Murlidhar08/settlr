"use client";

import { BackHeader } from "@/components/back-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { containerVariants, itemVariants } from "@/lib/animations";
import { authClient, useSession } from "@/lib/auth/auth-client";
import { getFileUrl } from "@/lib/utils";
import { useDeviceSessions, useRevokeSession, useSetActiveSession } from "@/tanstacks/user";
import { getInitials } from "@/utility/common-function";
import { motion } from "framer-motion";
import { LogOut, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutPage() {
    const router = useRouter();
    const { data: currentSessionData, isPending: isSessionPending } = useSession();
    const { data: deviceSessions, isLoading: isListLoading, refetch } = useDeviceSessions();
    const { mutateAsync: revokeSession } = useRevokeSession();
    const { mutateAsync: setActive } = useSetActiveSession();

    const [loadingToken, setLoadingToken] = useState<string | null>(null);
    const [isSigningOutAll, setIsSigningOutAll] = useState(false);

    const handleSignOutSingle = async (sessionToken: string, isCurrent: boolean) => {
        setLoadingToken(sessionToken);
        try {
            if (isCurrent) {
                const remaining = (deviceSessions || []).filter((ds: any) => ds.session?.token !== sessionToken);
                if (remaining.length > 0 && remaining[0]?.session?.token) {
                    await revokeSession(sessionToken);
                    await setActive(remaining[0].session.token);
                    window.location.reload();
                    return;
                } else {
                    await authClient.signOut();
                    router.push("/login");
                    return;
                }
            } else {
                await revokeSession(sessionToken);
                await refetch();
            }
        } catch (error) {
            console.error("Failed to sign out session:", error);
        } finally {
            setLoadingToken(null);
        }
    };

    const handleSignOutAll = async () => {
        setIsSigningOutAll(true);
        try {
            await authClient.signOut();
            router.push("/login");
        } catch (error) {
            console.error("Failed to sign out all accounts:", error);
            setIsSigningOutAll(false);
        }
    };

    if (isSessionPending || isListLoading) {
        return <LogoutSkeleton />;
    }

    const currentToken = currentSessionData?.session?.token;
    const sessionsList = deviceSessions || [];

    return (
        <div className="min-h-screen bg-background pb-20 select-none">
            <BackHeader title="Logout" backUrl="/dashboard" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto max-w-lg p-6 mt-4 space-y-6"
            >
                {/* Header Title */}
                <motion.div variants={itemVariants} className="text-center space-y-2 py-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                        Select account to sign out
                    </h1>
                </motion.div>

                {/* Account List Card */}
                <motion.div variants={itemVariants}>
                    <Card className="p-0 overflow-hidden border border-border/60 shadow-lg rounded-3xl bg-card/80 backdrop-blur-sm">
                        <div className="divide-y divide-border/50">
                            {sessionsList.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground text-sm">
                                    No active accounts found.
                                </div>
                            ) : (
                                sessionsList.map((ds: any, index: number) => {
                                    const sessionToken = ds.session?.token;
                                    const isCurrent = sessionToken === currentToken || ds.user?.id === currentSessionData?.user?.id;
                                    const isLoading = loadingToken === sessionToken;

                                    return (
                                        <div
                                            key={sessionToken || index}
                                            className="flex items-center justify-between p-4 sm:p-5 hover:bg-muted/30 transition-colors"
                                        >
                                            <div className="flex items-center gap-3.5 min-w-0 pr-2">
                                                <Avatar className="h-11 w-11 border-2 border-primary/20 ring-2 ring-background shadow-sm shrink-0">
                                                    <AvatarImage src={getFileUrl(ds.user?.image) || ''} className="object-cover" />
                                                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                                                        {getInitials(ds.user?.name)}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex flex-col min-w-0 space-y-0.5">
                                                    {isCurrent ? (
                                                        <>
                                                            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                                                                Signed in as
                                                            </span>
                                                            <p className="text-sm sm:text-base font-bold text-foreground truncate">
                                                                {ds.user?.name || ds.user?.username || "Account"}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <p className="text-sm sm:text-base font-bold text-foreground truncate">
                                                            {ds.user?.name || ds.user?.username || "Account"}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {ds.user?.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={isLoading || isSigningOutAll}
                                                onClick={() => handleSignOutSingle(sessionToken, isCurrent)}
                                                className="rounded-xl px-4 font-semibold text-xs border-border/80 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all shrink-0"
                                            >
                                                {isLoading ? "Signing out..." : "Sign out"}
                                            </Button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </Card>
                </motion.div>

                {/* Sign Out From All Accounts Button */}
                <motion.div variants={itemVariants}>
                    <Button
                        variant="outline"
                        disabled={isSigningOutAll}
                        onClick={handleSignOutAll}
                        className="w-full h-14 rounded-2xl border-rose-500/20 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/40 font-bold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>{isSigningOutAll ? "Signing out all..." : "Sign out from all accounts"}</span>
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}

function LogoutSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <BackHeader title="Logout" />
            <div className="mx-auto max-w-lg p-6 mt-6 space-y-6">
                <div className="text-center space-y-2">
                    <Skeleton className="h-8 w-64 mx-auto rounded-lg" />
                </div>
                <Skeleton className="h-44 w-full rounded-3xl" />
                <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
        </div>
    );
}
