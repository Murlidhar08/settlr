'use client'

import { Shield, Trash2, Plus, Link2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button'
import {
    SUPPORTED_OAUTH_PROVIDER_DETAILS,
    SUPPORTED_OAUTH_PROVIDERS,
    SupportedOAuthProvider,
} from '@/lib/o-auth-providers'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number]

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};

export function LinkAccountModalBody({ currentAccounts }: { currentAccounts?: Account[] }) {
    return (
        <div className="space-y-10">
            <section className="space-y-4">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Active Connections</h3>

                {currentAccounts?.length === 0 ? (
                    <motion.div
                        variants={itemVariants}
                        className="p-8 text-center bg-card/50 rounded-3xl border border-dashed border-muted-foreground/20 text-muted-foreground"
                    >
                        <p className="text-sm font-medium">No accounts linked yet</p>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        {currentAccounts?.map(account => (
                            <AccountCard
                                key={account.id}
                                provider={account.providerId}
                                account={account}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className="space-y-4">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Available Providers</h3>

                <div className="grid gap-3">
                    {SUPPORTED_OAUTH_PROVIDERS.filter(
                        provider =>
                            !currentAccounts?.find(
                                acc => acc.providerId === provider
                            )
                    ).map(provider => (
                        <AccountCard key={provider} provider={provider} />
                    ))}
                </div>
            </section>
        </div>
    )
}

function AccountCard({
    provider,
    account,
}: {
    provider: string
    account?: Account
}) {
    const router = useRouter()

    const providerDetails =
        SUPPORTED_OAUTH_PROVIDER_DETAILS[
        provider as SupportedOAuthProvider
        ] ?? {
            name: provider,
            Icon: Shield,
        }

    function linkAccount() {
        return authClient.linkSocial({
            provider,
            callbackURL: '/profile',
        })
    }

    function unlinkAccount() {
        if (!account) {
            return Promise.resolve({
                error: { message: 'Account not found' },
            })
        }

        return authClient.unlinkAccount(
            {
                accountId: account.accountId,
                providerId: provider,
            },
            {
                onSuccess: () => router.refresh(),
            }
        )
    }

    return (
        <motion.div
            variants={itemVariants}
            className="group relative overflow-hidden p-5 rounded-3xl bg-card border shadow-xs transition-all duration-300 hover:shadow-md hover:border-primary/20"
        >
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-6 shadow-sm",
                        account ? "bg-primary/5 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                        <providerDetails.Icon className="size-6" />
                    </div>
                    <div>
                        <p className="font-bold text-base leading-tight">{providerDetails.name}</p>
                        {account ? (
                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mt-0.5">
                                Verified
                            </p>
                        ) : (
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 mt-0.5">
                                Not Connected
                            </p>
                        )}
                    </div>
                </div>

                {account ? (
                    <BetterAuthActionButton
                        variant="outline"
                        size="sm"
                        className="rounded-xl h-10 px-4 font-bold border-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 active:scale-95"
                        action={unlinkAccount}
                    >
                        <Trash2 className="size-4 mr-2" />
                        Unlink
                    </BetterAuthActionButton>
                ) : (
                    <BetterAuthActionButton
                        variant="secondary"
                        size="sm"
                        className="rounded-xl h-10 px-4 font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all duration-300 active:scale-95 shadow-sm"
                        action={linkAccount}
                    >
                        <Plus className="size-4 mr-2" />
                        Connect
                    </BetterAuthActionButton>
                )}
            </div>
            {account && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
            )}
        </motion.div>
    )
}

