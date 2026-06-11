"use client";

import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button';
import { BackHeader } from "@/components/back-header";
import { Skeleton } from "@/components/ui/skeleton";
import { containerVariants } from '@/lib/animations';
import { authClient, useSession } from "@/lib/auth/auth-client";
import { tran } from "@/lib/languages/i18n";
import { motion } from 'framer-motion';
import { AlertTriangle, Info, Trash2 } from 'lucide-react';

export default function DangerPage() {
    const { isPending } = useSession();

    if (isPending) {
        return <DangerSkeleton />;
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <BackHeader
                title={tran("danger.title")}
                backUrl="/settings"
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto max-w-4xl mt-6 space-y-8 px-6"
            >
                <div className="p-8 rounded-[2.5rem] bg-card border border-rose-500/10 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-rose-500/10 transition-colors" />

                    <div className="flex items-start gap-4 mb-6">
                        <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                            <AlertTriangle size={24} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-lg text-rose-600">{tran("danger.irreversible_actions")}</h3>
                            <p className="text-[11px] font-black uppercase tracking-widest text-rose-500/60 italic">{tran("danger.permanent_deletion")}</p>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                        {tran("danger.delete_account_description")}
                    </p>

                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50/50 border border-rose-100 mb-8">
                        <Info size={16} className="text-rose-500 shrink-0" />
                        <p className="text-[11px] text-rose-700 font-bold uppercase tracking-wide leading-tight">
                            {tran("danger.msg.delete_confirmation_email")}
                        </p>
                    </div>

                    <BetterAuthActionButton
                        requireAreYouSure
                        variant="destructive"
                        className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:shadow-2xl hover:shadow-rose-500/30 transition-all active:scale-[0.98]"
                        successMessage={tran("danger.msg.delete_success_message")}
                        action={() =>
                            authClient.deleteUser({
                                callbackURL: '/',
                            })
                        }
                    >
                        <Trash2 className="size-5 mr-2" />
                        {tran("danger.terminate_account")}
                    </BetterAuthActionButton>
                </div>
            </motion.div>
        </div>
    );
}

function DangerSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <BackHeader title={tran("danger.title")} />
            <div className="mx-auto max-w-lg p-6 mt-6 space-y-8">
                <div className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-[2.5rem]" />
                </div>
            </div>
        </div>
    );
}
