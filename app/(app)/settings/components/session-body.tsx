'use client'

import { Monitor, Smartphone, Trash2, Globe, ShieldQuestion } from 'lucide-react'
import { motion } from 'framer-motion'
import { Session } from 'better-auth'
import { UAParser } from 'ua-parser-js'
import { useRouter } from 'next/navigation'
import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { formatDate } from '@/utility/transaction'
import { useUserConfig } from '@/components/providers/user-config-provider'

interface SessionModalBodyProps {
    sessions: Session[]
    currentSessionToken?: string
    onUpdate?: () => void
}

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
};

export function SessionModalBody({
    sessions,
    currentSessionToken,
    onUpdate,
}: SessionModalBodyProps) {
    const router = useRouter()

    const currentSession = sessions?.find(s => s.token === currentSessionToken)
    const otherSessions = sessions?.filter(s => s.token !== currentSessionToken)

    function revokeOtherSessions() {
        return authClient.revokeOtherSessions(undefined, {
            onSuccess: () => {
                router.refresh()
                onUpdate?.()
            },
        })
    }

    return (
        <div className="space-y-10">
            {currentSession && (
                <div className="space-y-4">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Currently Active</h3>
                    <SessionCard session={currentSession} isCurrentSession />
                </div>
            )}

            <div className="space-y-4">
                <div className="flex items-center justify-between ml-2">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Other Devices</h3>

                    {otherSessions.length > 0 && (
                        <BetterAuthActionButton
                            size="sm"
                            variant="outline"
                            className="rounded-xl px-4 font-bold border-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-[11px] uppercase tracking-wider"
                            action={revokeOtherSessions}
                        >
                            Revoke All
                        </BetterAuthActionButton>
                    )}
                </div>

                {otherSessions.length === 0 ? (
                    <motion.div
                        variants={itemVariants}
                        className="p-8 text-center bg-card/50 rounded-[2rem] border border-dashed border-muted-foreground/20 text-muted-foreground"
                    >
                        <p className="text-sm font-medium">No other active sessions found</p>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        {otherSessions.map(session => (
                            <SessionCard key={session.id} session={session} onUpdate={onUpdate} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function SessionCard({
    session,
    onUpdate,
    isCurrentSession = false,
}: {
    session: Session
    onUpdate?: () => void
    isCurrentSession?: boolean
}) {
    const { dateFormat } = useUserConfig()
    const router = useRouter()
    const ua = session.userAgent ? UAParser(session.userAgent) : null

    function getBrowserIcon() {
        const type = ua?.device.type;
        if (type === 'mobile') return <Smartphone size={22} />;
        if (type === 'tablet') return <Smartphone size={22} />;
        return <Monitor size={22} />;
    }

    function deviceLabel() {
        if (!ua) return 'Unknown Browser'
        const browser = ua.browser.name || 'Web Browser';
        const os = ua.os.name || 'Unknown OS';
        return `${browser} on ${os}`;
    }

    function format(date: Date) {
        return formatDate(date, dateFormat)
    }

    function getTime(date: Date) {
        return new Intl.DateTimeFormat(undefined, {
            timeStyle: 'short',
        }).format(new Date(date))
    }

    function revokeSession() {
        return authClient.revokeSession(
            { token: session.token },
            {
                onSuccess: () => {
                    router.refresh()
                    onUpdate?.()
                }
            }
        )
    }

    return (
        <motion.div
            variants={itemVariants}
            className={cn(
                "group relative overflow-hidden p-6 rounded-[2.5rem] border transition-all duration-300",
                isCurrentSession ? "bg-card shadow-sm border-primary/10" : "bg-card/50 hover:bg-card hover:shadow-md border-transparent hover:border-primary/5"
            )}
        >
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-5">
                    <div className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-sm",
                        isCurrentSession ? "bg-primary/5 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                        {getBrowserIcon()}
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-lg leading-tight">{deviceLabel()}</p>
                            {isCurrentSession && (
                                <span className="bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border border-primary/20">
                                    Current
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium opacity-80">
                            <div className="flex items-center gap-1">
                                <Globe size={12} />
                                <span>Session started: {format(session.createdAt)}</span>
                            </div>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                            <span>{getTime(session.createdAt)}</span>
                        </div>
                    </div>
                </div>

                {!isCurrentSession && (
                    <BetterAuthActionButton
                        size="icon"
                        variant="ghost"
                        className="h-12 w-12 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                        action={revokeSession}
                        successMessage="Session Revoked"
                    >
                        <Trash2 className="size-5" />
                    </BetterAuthActionButton>
                )}
            </div>

            {isCurrentSession && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            )}
        </motion.div>
    )
}

