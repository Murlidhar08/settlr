"use client";

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { LockKeyhole } from "lucide-react"

import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { PasswordInput } from "@/components/ui/password-input"
import { Checkbox } from "@/components/ui/checkbox"
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button"

import { authClient } from "@/lib/auth-client"
import { getListUserAccounts } from "@/actions/user-settings.actions"
import { TwoFactorAuth } from "./two-factor-auth"

interface SecurityModalBodyProps {
    email: string
    isTwoFactorEnabled: boolean
}

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
        <div className="space-y-8">
            {/* Password Management */}
            <section className="space-y-4">
                <h3 className="text-lg font-medium">Password Management</h3>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    {hasPasswordAccount === undefined ? (
                        <div className="h-40 w-full animate-pulse bg-muted rounded-lg" />
                    ) : hasPasswordAccount ? (
                        <ChangePasswordForm />
                    ) : (
                        <SetPasswordForm email={email} />
                    )}
                </div>
            </section>

            {/* Two Factor Authentication */}
            {hasPasswordAccount && (
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                            <p className="text-sm text-muted-foreground">Extra protection for sensitive actions</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${isTwoFactorEnabled ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                            }`}>
                            {isTwoFactorEnabled ? "Enabled" : "Disabled"}
                        </span>
                    </div>

                    <div className="rounded-xl border bg-muted/30 p-6 space-y-4">
                        <TwoFactorAuth isEnabled={isTwoFactorEnabled} />
                        {!isTwoFactorEnabled && (
                            <p className="text-xs text-muted-foreground">
                                We recommend enabling 2FA to secure your account and business data.
                            </p>
                        )}
                    </div>
                </section>
            )}
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
                toast.success("Password changed successfully")
                reset()
            },
            onError: (error) => {
                toast.error(error?.error?.message ?? "Failed to change password")
            },
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
                <label className="text-sm font-medium">Current Password</label>
                <PasswordInput {...register("currentPassword", { required: true })} />
                {errors.currentPassword && <p className="text-xs text-destructive">Current password is required</p>}
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium">New Password</label>
                <PasswordInput {...register("newPassword", { required: true, minLength: 8 })} />
                {errors.newPassword && <p className="text-xs text-destructive">Password must be at least 8 characters</p>}
            </div>

            <div className="flex items-center gap-3 py-2">
                <Checkbox
                    checked={watch("revokeOtherSessions")}
                    onCheckedChange={(checked) => setValue("revokeOtherSessions", Boolean(checked))}
                    id="revoke-sessions"
                />
                <label htmlFor="revoke-sessions" className="text-sm font-medium cursor-pointer">
                    Log out other sessions
                </label>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                <LoadingSwap isLoading={isSubmitting}>Change Password</LoadingSwap>
            </Button>
        </form>
    )
}

function SetPasswordForm({ email }: { email: string }) {
    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                You are currently using a social login. To set a password, we'll send you a reset link.
            </p>
            <BetterAuthActionButton
                variant="outline"
                className="w-full"
                successMessage="Password reset email sent"
                action={() => authClient.requestPasswordReset({ email, redirectTo: "/reset-password" })}
            >
                Send Password Reset Email
            </BetterAuthActionButton>
        </div>
    )
}
