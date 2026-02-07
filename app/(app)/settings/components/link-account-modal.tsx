'use client'

import { ChevronRight, Link2Icon, LockKeyhole, Plus, Shield, Trash2, X } from 'lucide-react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
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

interface LinkAccountModalProps {
  currentAccounts?: Account[]
}

/* ========================================================= */
/* COMPONENT */
/* ========================================================= */

const LinkAccountModal = ({ currentAccounts }: LinkAccountModalProps) => {
  return (
    <Sheet>
      <SheetTrigger className="w-full">
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-4 px-4 h-16 text-left"
        >
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Link2Icon size={16} />
          </div>
          <div className="flex-1">
            <p className="font-semibold">Link Account</p>
          </div>
          <ChevronRight className="text-muted-foreground" />
        </motion.button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-screen! max-w-none! h-screen sm:w-full! sm:max-w-md! sm:h-full flex flex-col p-0 pb-[env(safe-area-inset-bottom)]"
      >
        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}
        <SheetHeader className="sticky top-0 z-10 border-b bg-background px-6 py-4">
          <div className="flex items-center gap-2">
            <LockKeyhole className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Linked Accounts</h2>
          </div>
        </SheetHeader>

        {/* ================================================== */}
        {/* BODY */}
        {/* ================================================== */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Linked Accounts */}
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

          {/* Link New Accounts */}
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

        {/* ================================================== */}
        {/* FOOTER */}
        {/* ================================================== */}
        <SheetFooter className="sticky bottom-0 border-t bg-background px-6 py-4">
          <SheetClose>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export { LinkAccountModal }

/* ========================================================= */
/* ACCOUNT CARD */
/* ========================================================= */

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
      <CardContent>
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
              <Trash2 />
              Unlink
            </BetterAuthActionButton>
          ) : (
            <BetterAuthActionButton
              variant="outline"
              size="sm"
              action={linkAccount}
            >
              <Plus />
              Link
            </BetterAuthActionButton>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
