'use client'

import { Link2Icon, LockKeyhole, Shield, Trash2, Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button'
import {
    SUPPORTED_OAUTH_PROVIDER_DETAILS,
    SUPPORTED_OAUTH_PROVIDERS,
    SupportedOAuthProvider,
} from '@/lib/o-auth-providers'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'
import { authClient } from '@/lib/auth-client'

type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number]

export function LinkAccountModalBody({ currentAccounts }: { currentAccounts?: Account[] }) {
    return (
        <div className="space-y-8">
            <section className="space-y-3">
                <h3 className="text-lg font-medium">Linked Accounts</h3>

                {currentAccounts?.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            No linked accounts found
                        </CardContent>
                    </Card>
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

            <section className="space-y-3">
                <h3 className="text-lg font-medium">Link Other Accounts</h3>

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
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <providerDetails.Icon className="size-5" />
                        <div>
                            <p className="font-medium">{providerDetails.name}</p>
                            {account ? (
                                <p className="text-sm text-muted-foreground">
                                    Linked on{" "}
                                    {new Date(account.createdAt).toLocaleDateString()}
                                </p>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Connect your {providerDetails.name} account
                                </p>
                            )}
                        </div>
                    </div>

                    {account ? (
                        <BetterAuthActionButton
                            variant="destructive"
                            size="sm"
                            action={unlinkAccount}
                        >
                            <Trash2 className="size-4" />
                            Unlink
                        </BetterAuthActionButton>
                    ) : (
                        <BetterAuthActionButton
                            variant="outline"
                            size="sm"
                            action={linkAccount}
                        >
                            <Plus className="size-4" />
                            Link
                        </BetterAuthActionButton>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
