"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

type BackupCodeFormValues = {
  code: string
}

export function BackupCodeTab() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BackupCodeFormValues>()

  async function onSubmit(values: BackupCodeFormValues) {
    await authClient.twoFactor.verifyBackupCode(
      { code: values.code },
      {
        onSuccess: () => {
          router.push("/")
        },
        onError: (error) => {
          toast.error(error?.error?.message ?? "Invalid backup code")
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium">
          Backup code
        </label>
        <Input
          {...register("code", {
            required: "Backup code is required",
          })}
          placeholder="XXXX-XXXX"
        />
        {errors.code && (
          <p className="text-xs text-destructive">
            {errors.code.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="outline"
        className="w-full"
        disabled={isSubmitting}
      >
        <LoadingSwap isLoading={isSubmitting}>
          Verify Backup Code
        </LoadingSwap>
      </Button>
    </form>
  )
}
