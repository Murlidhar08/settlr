'use client'

import { AlertTriangle, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button'
import { authClient } from '@/lib/auth-client'

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
};

export function DangerModalBody() {
    return (
        <motion.div
            variants={itemVariants}
            className="space-y-6"
        >
            <div className="rounded-[2.5rem] bg-rose-50/30 dark:bg-rose-950/10 border border-rose-500/20 shadow-xs p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-rose-500/10 transition-colors" />

                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-xl font-black tracking-tight text-rose-600">Irreversible Actions</h3>
                    </div>

                    <div className="space-y-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-500 opacity-80">Permanent Deletion</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Deleting your account will permanently remove all your data, including businesses, transactions, and linked accounts. This action <span className="text-rose-600 font-bold italic underline decoration-rose-500/30 underline-offset-4">cannot be undone</span>.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 mb-2">
                        <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wider text-center">
                            A confirmation link will be sent to your registered email.
                        </p>
                    </div>

                    <BetterAuthActionButton
                        requireAreYouSure
                        variant="destructive"
                        className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.1em] shadow-xl shadow-rose-500/20 hover:shadow-2xl hover:bg-rose-600 transition-all active:scale-[0.98]"
                        successMessage="Account deletion initiated. Check your email."
                        action={() =>
                            authClient.deleteUser({
                                callbackURL: '/',
                            })
                        }
                    >
                        <Trash2 className="size-5 mr-2" />
                        Terminate Account
                    </BetterAuthActionButton>
                </div>
            </div>

            <p className="text-[10px] text-center text-muted-foreground font-medium uppercase tracking-[0.2em] opacity-40">
                Settlr Security Protocol v1.4
            </p>
        </motion.div>
    )
}

