'use client'

import { ChevronRight, LockKeyhole, Trash2Icon } from 'lucide-react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button'
import { authClient } from '@/lib/auth-client'


/* ========================================================= */
/* COMPONENT */
/* ========================================================= */

const DangerModal = () => {
  return (
    <Sheet>
      <SheetTrigger className="w-full">
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-4 px-4 h-16 text-left"
        >
          <div className="h-8 w-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <Trash2Icon size={16} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-destructive">Danger Zone</p>
          </div>
          <ChevronRight className="text-muted-foreground" />
        </motion.button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex h-full w-full max-w-full flex-col p-0 sm:max-w-xl"
      >
        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}
        <SheetHeader className="sticky top-0 z-10 border-b bg-background px-6 py-4">
          <div className="flex items-center gap-2">
            <LockKeyhole className="h-5 w-5 text-destructive" />
            <h2 className="text-lg font-semibold text-destructive">
              Danger Zone
            </h2>
          </div>
        </SheetHeader>

        {/* ================================================== */}
        {/* BODY */}
        {/* ================================================== */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-destructive">
                Delete Account Permanently
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This action is irreversible. Deleting your account will
                permanently remove all your data, businesses, transactions, and
                access. You will need to confirm this action via email.
              </p>

              <BetterAuthActionButton
                requireAreYouSure
                variant="destructive"
                className="w-full"
                successMessage="Account deletion initiated. Please check your email to confirm."
                action={() =>
                  authClient.deleteUser({
                    callbackURL: '/',
                  })
                }
              >
                Delete Account Permanently
              </BetterAuthActionButton>
            </CardContent>
          </Card>
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

export { DangerModal }
