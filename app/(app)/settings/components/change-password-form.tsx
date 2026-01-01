"use client"

import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { PasswordInput } from "@/components/ui/password-input"
import { Checkbox } from "@/components/ui/checkbox"

import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

type ChangePasswordFormValues = {
  currentPassword: string
  newPassword: string
  revokeOtherSessions: boolean
}

export default function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ChangePasswordFormValues>({
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
