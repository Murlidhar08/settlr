'use client'

import { KeyRoundIcon, LockKeyhole, Monitor, Smartphone, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Session } from 'better-auth'
import { UAParser } from 'ua-parser-js'
import { useRouter } from 'next/navigation'
import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button'
import { authClient } from '@/lib/auth-client'

interface SessionModalBodyProps {
    sessions: Session[]
    currentSessionToken?: string
}

export function SessionModalBody({
    sessions,
    currentSessionToken,
}: SessionModalBodyProps) {
    const router = useRouter()

    const currentSession = sessions?.find(s => s.token === currentSessionToken)
    const otherSessions = sessions?.filter(s => s.token !== currentSessionToken)

    function revokeOtherSessions() {
        return authClient.revokeOtherSessions(undefined, {
            onSuccess: () => router.refresh(),
        })
    }

    return (
        <div className="space-y-6">
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
    )
}

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
            <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="text-base">{deviceLabel()}</CardTitle>
                {isCurrentSession && <Badge>Current</Badge>}
            </CardHeader>

            <CardContent className="flex items-center justify-between pb-4">
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
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10"
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
