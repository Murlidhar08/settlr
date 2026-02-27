"use client";

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { LockKeyhole, ShieldCheck, Mail } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button"

import { authClient } from "@/lib/auth-client"
import { getListUserAccounts } from "@/actions/user-settings.actions"
import { TwoFactorAuth } from "./two-factor-auth"
import { cn } from "@/lib/utils"

interface SecurityModalBodyProps {
    email: string
    isTwoFactorEnabled: boolean
}

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
};

export function SecurityModalBody({ email, isTwoFactorEnabled }: SecurityModalBodyProps) {
    const [hasPasswordAccount, setHasPasswordAccount] = useState<boolean>();

    useEffect(() => {
        getListUserAccounts()
            .then(accounts => {
                const hasPassAcc = accounts.some(a => a.providerId === "credential")
                setHasPasswordAccount(hasPassAcc);
            })
    }, [])

    return (
        <div className="space-y-10">
            {/* Password Management */}
            <motion.section variants={itemVariants} className="space-y-4">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Secure Your Access</h3>
                <div className="rounded-[2.5rem] bg-card border shadow-xs p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />

                    {hasPasswordAccount === undefined ? (
                        <div className="space-y-4">
                            <div className="h-4 w-32 animate-pulse bg-muted rounded" />
                            <div className="h-12 w-full animate-pulse bg-muted rounded-2xl" />
                            <div className="h-12 w-full animate-pulse bg-muted rounded-2xl" />
                        </div>
                    ) : hasPasswordAccount ? (
                        <ChangePasswordForm />
                    ) : (
                        <SetPasswordForm email={email} />
                    )}
                </div>
            </motion.section>

            {/* Two Factor Authentication */}
            <motion.section
                variants={itemVariants}
                className="space-y-4"
            >
                <div className="flex items-center justify-between ml-2">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Two-Factor Authentication</h3>
                    <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        isTwoFactorEnabled ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-muted text-muted-foreground border-transparent"
                    )}>
                        {isTwoFactorEnabled ? "Enabled" : "Disabled"}
                    </div>
                </div>

                <div className="rounded-[2.5rem] bg-card border shadow-xs p-8 space-y-6 relative overflow-hidden">
                    <div className="flex items-start gap-4 mb-2">
                        <div className="h-12 w-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="space-y-1">
                            <p className="font-bold text-base">Authenticator App</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">Protect your account with an extra layer of security using a time-based code.</p>
                        </div>
                    </div>

                    <div className="rounded-3xl bg-muted/30 p-2 border border-muted-foreground/5 shadow-inner">
                        {hasPasswordAccount === false ? (
                            <div className="p-6 text-center">
                                <p className="text-sm text-muted-foreground italic">Please set a password above to enable two-factor authentication.</p>
                            </div>
                        ) : (
                            <TwoFactorAuth isEnabled={isTwoFactorEnabled} />
                        )}
                    </div>

                    {!isTwoFactorEnabled && (
                        <div className="flex items-center gap-2 p-4 rounded-2xl bg-amber-50/50 border border-amber-100/50">
                            <p className="text-[11px] text-amber-700 font-bold uppercase tracking-wide">
                                Highly recommended for business safety.
                            </p>
                        </div>
                    )}

                    <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/10 to-transparent" />
                </div>
            </motion.section>

        </div>
    )
}

/* --- Internal components --- */

type ChangePasswordFormValues = {
    currentPassword: string
    newPassword: string
    revokeOtherSessions: boolean
}

function ChangePasswordForm() {
    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting }, setValue } = useForm<ChangePasswordFormValues>({
        defaultValues: { currentPassword: "", newPassword: "", revokeOtherSessions: false },
    })

    async function onSubmit(values: ChangePasswordFormValues) {
        await authClient.changePassword(values, {
            onSuccess: () => {
                toast.success("Password updated successfully")
                reset()
            },
            onError: (error) => {
                toast.error(error?.error?.message ?? "Failed to update password")
            },
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            <div className="grid gap-6">
                <div className="space-y-2">
                    <label className="ml-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground italic">Current Password</label>
                    <Input
                        {...register("currentPassword", { required: "Required" })}
                        type="password"
                        className="h-14 rounded-2xl bg-muted/10 border-muted-foreground/10 focus:bg-background transition-all"
                    />
                    {errors.currentPassword && <p className="ml-1 text-xs font-bold text-rose-500 italic">Please enter your current password</p>}
                </div>

                <div className="space-y-2">
                    <label className="ml-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground italic">New Password</label>
                    <Input
                        {...register("newPassword", { required: "Required", minLength: 8 })}
                        type="password"
                        className="h-14 rounded-2xl bg-muted/10 border-muted-foreground/10 focus:bg-background transition-all"
                    />
                    {errors.newPassword && <p className="ml-1 text-xs font-bold text-rose-500 italic">Must be at least 8 characters long</p>}
                </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/20 border border-muted-foreground/5 cursor-pointer hover:bg-muted/30 transition-colors group">
                <Checkbox
                    checked={watch("revokeOtherSessions")}
                    onCheckedChange={(checked) => setValue("revokeOtherSessions", Boolean(checked))}
                    id="revoke-sessions"
                    className="size-5 rounded-lg border-2"
                />
                <label htmlFor="revoke-sessions" className="text-sm font-bold text-muted-foreground group-hover:text-foreground cursor-pointer transition-colors">
                    End all other active sessions for security
                </label>
            </div>

            <Button
                type="submit"
                className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.1em] shadow-xl shadow-primary/20 hover:shadow-2xl transition-all active:scale-[0.98]"
                disabled={isSubmitting}
            >
                <LoadingSwap isLoading={isSubmitting}>Update Access Password</LoadingSwap>
            </Button>
        </form>
    )
}

function SetPasswordForm({ email }: { email: string }) {
    return (
        <div className="space-y-6 relative z-10 text-center sm:text-left">
            <div className="space-y-2">
                <p className="font-bold text-lg text-foreground">Password Not Set</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    You currently sign in using a connected social account. Setting a master password provides an alternative way to access your dashboard.
                </p>
            </div>

            <BetterAuthActionButton
                variant="outline"
                className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.1em] border-primary/20 hover:bg-primary/5 transition-all text-primary"
                successMessage="Recovery link dispatched to your email"
                action={() => authClient.requestPasswordReset({ email, redirectTo: "/reset-password" })}
            >
                <Mail className="size-4 mr-2" />
                Initialize Password Setup
            </BetterAuthActionButton>
        </div>
    )
}

