"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

type TotpFormValues = {
  code: string
}

export function TotpForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TotpFormValues>()

  async function onSubmit(values: TotpFormValues) {
    await authClient.twoFactor.verifyTotp(
      { code: values.code },
      {
        onSuccess: () => {
          router.push("/")
        },
        onError: (error) => {
          toast.error(error?.error?.message ?? "Invalid code")
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium">
          Authenticator code
        </label>
        <Input
          {...register("code", {
            required: "Code is required",
            minLength: { value: 6, message: "Enter 6-digit code" },
            maxLength: { value: 6, message: "Enter 6-digit code" },
          })}
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
        />
        {errors.code && (
          <p className="text-xs text-destructive">
            {errors.code.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        <LoadingSwap isLoading={isSubmitting}>
          Verify & Continue
        </LoadingSwap>
      </Button>
    </form>
  )
}
