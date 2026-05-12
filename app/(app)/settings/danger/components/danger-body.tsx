'use client'

import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button'
import { useUserConfig } from '@/components/providers/user-config-provider'
import { authClient } from '@/lib/auth/auth-client'
import { t } from '@/lib/languages/i18n'
import { motion } from 'framer-motion'
import { AlertTriangle, Info, Trash2 } from 'lucide-react'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

export function DangerModalBody() {
    const { language } = useUserConfig()

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-lg p-6 mt-4 space-y-6"
        >
            <div className="p-8 rounded-[2.5rem] bg-card border border-rose-500/10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-rose-500/10 transition-colors" />

                <div className="flex items-start gap-4 mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-lg text-rose-600">{t("danger.irreversible_actions", language)}</h3>
                        <p className="text-[11px] font-black uppercase tracking-widest text-rose-500/60 italic">{t("danger.permanent_deletion", language)}</p>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                    {t("danger.delete_account_description", language)}
                </p>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50/50 border border-rose-100 mb-8">
                    <Info size={16} className="text-rose-500 shrink-0" />
                    <p className="text-[11px] text-rose-700 font-bold uppercase tracking-wide leading-tight">
                        {t("danger.msg.delete_confirmation_email", language)}
                    </p>
                </div>

                <BetterAuthActionButton
                    requireAreYouSure
                    variant="destructive"
                    className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:shadow-2xl hover:shadow-rose-500/30 transition-all active:scale-[0.98]"
                    successMessage={t("danger.msg.delete_success_message", language)}
                    action={() =>
                        authClient.deleteUser({
                            callbackURL: '/',
                        })
                    }
                >
                    <Trash2 className="size-5 mr-2" />
                    {t("danger.terminate_account", language)}
                </BetterAuthActionButton>
            </div>
        </motion.div>
    )
}

