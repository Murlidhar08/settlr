'use client'

import { ChevronRight, KeyRoundIcon, LockKeyhole, Monitor, Smartphone, Trash2 } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { Session } from 'better-auth'
import { UAParser } from 'ua-parser-js'
import { useRouter } from 'next/navigation'
import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button'
import { authClient } from '@/lib/auth-client'

interface SessionModalProps {
  sessions: Session[]
  currentSessionToken?: string
}

/* ========================================================= */
/* COMPONENT */
/* ========================================================= */

const SessionModal = ({
  sessions,
  currentSessionToken,
}: SessionModalProps) => {
  const router = useRouter()

  const currentSession = sessions?.find(s => s.token === currentSessionToken)
  const otherSessions = sessions?.filter(s => s.token !== currentSessionToken)

  function revokeOtherSessions() {
    return authClient.revokeOtherSessions(undefined, {
      onSuccess: () => router.refresh(),
    })
  }

  return (
    <Sheet>
      <SheetTrigger className="w-full">
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-4 px-4 h-16 text-left"
        >
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <KeyRoundIcon size={16} />
          </div>
          <div className="flex-1">
            <p className="font-semibold">Session Management</p>
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
            <h2 className="text-lg font-semibold">Session Management</h2>
          </div>
        </SheetHeader>

        {/* ================================================== */}
        {/* BODY */}
        {/* ================================================== */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {currentSession && (
            <SessionCard session={currentSession} isCurrentSession />
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Other Active Sessions</h3>

              {otherSessions.length > 0 && (
                <BetterAuthActionButton
                  size="sm"
                  variant="destructive"
                  action={revokeOtherSessions}
                >
                  Revoke All
                </BetterAuthActionButton>
              )}
            </div>

            {otherSessions.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No other active sessions
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {otherSessions.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </div>
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

export { SessionModal }

/* ========================================================= */
/* SESSION CARD */
/* ========================================================= */

function SessionCard({
  session,
  isCurrentSession = false,
}: {
  session: Session
  isCurrentSession?: boolean
}) {
  const router = useRouter()
  const ua = session.userAgent ? UAParser(session.userAgent) : null

  function deviceLabel() {
    if (!ua) return 'Unknown Device'
    if (!ua.browser.name && !ua.os.name) return 'Unknown Device'
    if (!ua.browser.name) return ua.os.name
    if (!ua.os.name) return ua.browser.name
    return `${ua.browser.name}, ${ua.os.name}`
  }

  function format(date: Date) {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date))
  }

  function revokeSession() {
    return authClient.revokeSession(
      { token: session.token },
      { onSuccess: () => router.refresh() }
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{deviceLabel()}</CardTitle>
        {isCurrentSession && <Badge>Current</Badge>}
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {ua?.device.type === 'mobile' ? (
            <Smartphone className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Monitor className="h-5 w-5 text-muted-foreground" />
          )}

          <div className="text-sm text-muted-foreground">
            <p>Created: {format(session.createdAt)}</p>
            <p>Expires: {format(session.expiresAt)}</p>
          </div>
        </div>

        {!isCurrentSession && (
          <BetterAuthActionButton
            size="icon"
            variant="destructive"
            action={revokeSession}
            successMessage="Session revoked"
          >
            <Trash2 className="h-4 w-4" />
          </BetterAuthActionButton>
        )}
      </CardContent>
    </Card>
  )
}
