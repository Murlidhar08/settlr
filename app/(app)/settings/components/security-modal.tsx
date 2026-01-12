import { ChevronRight, LockKeyhole } from "lucide-react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { getListUserAccounts } from "@/actions/user-settings.actions"
import { ActionButton } from "@/components/ui/action-button"

import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { PasswordInput } from "@/components/ui/password-input"
import { Checkbox } from "@/components/ui/checkbox"

import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button"


// import { headers } from "next/headers"

interface PopupSheetProps {
  email: string
  isTwoFactorEnabled: boolean
}

/* ========================================================= */
/* COMPONENT */
/* ========================================================= */

const SecurityModal = ({ email, isTwoFactorEnabled }: PopupSheetProps) => {
  const [hasPasswordAccount, setHasPasswordAccount] = useState<boolean>();

  useEffect(() => {
    getListUserAccounts()
      .then(accounts => {
        const hasPassAcc = accounts.some(a => a.providerId === "credential")
        setHasPasswordAccount(hasPassAcc);
      })

  }, [])

  return (
    <Sheet>
      <SheetTrigger className="w-full">
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-4 px-4 h-16 text-left"
        >
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <LockKeyhole size={16} />
          </div>
          <div className="flex-1">
            <p className="font-semibold">
              Security
            </p>
          </div>
          <ChevronRight className="text-muted-foreground" />
        </motion.button>
      </SheetTrigger>

      <SheetContent
        side={"right"}
        className="flex h-full w-full max-w-full flex-col p-0 sm:max-w-xl"
      >
        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}
        <SheetHeader className="sticky top-0 z-10 border-b bg-background px-6 py-4">
          <div className="flex items-center gap-2">
            <LockKeyhole className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Security Tab</h2>
          </div>
        </SheetHeader>

        {/* ================================================== */}
        {/* BODY */}
        {/* ================================================== */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {hasPasswordAccount ? (
            // Update user password
            <>
              <h1>User Has password account</h1>
              <ChangePasswordForm />
            </>
          ) : (
            // Set user Password
            <>
              <h1>User Do not have password account</h1>
              <SetPasswordForm email={email} />
            </>
          )}
        </div>

        <hr />

        {/* TODO: PENDING */}
        <div className="flex-1 overflow-y-auto px-6 py-6 hidden">
          {/* ADD 2FA SETTINGS HERE */}
        </div>

        {/* ================================================== */}
        {/* FOOTER */}
        {/* ================================================== */}
        <SheetFooter className="sticky bottom-0 border-t bg-background px-6 py-4">
          <div className="flex w-full gap-3">
            {/* Close button */}
            <SheetClose >
              <Button
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent >
    </Sheet >
  )
}

type ChangePasswordFormValues = {
  currentPassword: string
  newPassword: string
  revokeOtherSessions: boolean
}

// CHANGE PASSWORD CONTROL
function ChangePasswordForm() {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting }, setValue } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      revokeOtherSessions: false,
    },
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
      {/* Current Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Current Password</label>
        <PasswordInput {...register("currentPassword", { required: true })} />
        {errors.currentPassword && (
          <p className="text-sm text-destructive">
            Current password is required
          </p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium">New Password</label>
        <PasswordInput
          {...register("newPassword", {
            required: true,
            minLength: 8,
          })}
        />
        {errors.newPassword && (
          <p className="text-sm text-destructive">
            Password must be at least 8 characters
          </p>
        )}
      </div>

      {/* Revoke Sessions */}
      <div className="flex items-center gap-3">
        <Checkbox
          checked={watch("revokeOtherSessions")}
          onCheckedChange={(checked) =>
            setValue("revokeOtherSessions", Boolean(checked))
          }
        />
        <label className="text-sm font-medium cursor-pointer">
          Log out other sessions
        </label>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        <LoadingSwap isLoading={isSubmitting}>
          Change Password
        </LoadingSwap>
      </Button>
    </form>
  )
}

// SET PASSWORD CONTROL
function SetPasswordForm({ email }: { email: string }) {
  return (
    <BetterAuthActionButton
      variant="outline"
      successMessage="Password reset email sent"
      action={() => {
        return authClient.requestPasswordReset({
          email,
          redirectTo: "/reset-password",
        })
      }}
    >
      Send Password Reset Email
    </BetterAuthActionButton>
  )
}


export { SecurityModal }
