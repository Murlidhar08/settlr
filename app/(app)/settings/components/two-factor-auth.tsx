"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/ui/password-input"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { Input } from "@/components/ui/input"

import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

import QRCode from "react-qr-code"

/* ========================================================= */
/* SCHEMA */
/* ========================================================= */

const passwordSchema = z.object({
  password: z.string().min(1, "Password is required"),
})

const tokenSchema = z.object({
  token: z.string().length(6, "Enter a 6-digit code"),
})

type PasswordForm = z.infer<typeof passwordSchema>
type TokenForm = z.infer<typeof tokenSchema>

type TwoFactorData = {
  totpURI: string
  backupCodes: string[]
}

/* ========================================================= */
/* MAIN COMPONENT */
/* ========================================================= */

export function TwoFactorAuth({ isEnabled }: { isEnabled: boolean }) {
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  async function enable2FA(values: PasswordForm) {
    const result = await authClient.twoFactor.enable({
      password: values.password,
    })

    if (result.error) {
      toast.error(result.error.message ?? "Failed to enable 2FA")
      return
    }

    setTwoFactorData(result.data)
    reset()
  }

  async function disable2FA(values: PasswordForm) {
    await authClient.twoFactor.disable(
      { password: values.password },
      {
        onSuccess: () => {
          toast.success("Two-factor authentication disabled")
          reset()
          router.refresh()
        },
        onError: (error) => {
          toast.error(error?.error?.message ?? "Failed to disable 2FA")
        },
      }
    )
  }

  if (twoFactorData) {
    return (
      <QRCodeVerify
        {...twoFactorData}
        onDone={() => setTwoFactorData(null)}
      />
    )
  }

  return (
    <form
      onSubmit={handleSubmit(isEnabled ? disable2FA : enable2FA)}
      className="space-y-4"
    >
      <div className="space-y-1">
        <label className="text-sm font-medium">
          Confirm your password
        </label>
        <PasswordInput {...register("password")} />
        {errors.password && (
          <p className="text-xs text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        variant={isEnabled ? "destructive" : "default"}
        disabled={isSubmitting}
      >
        <LoadingSwap isLoading={isSubmitting}>
          {isEnabled ? "Disable 2FA" : "Enable 2FA"}
        </LoadingSwap>
      </Button>
    </form>
  )
}

/* ========================================================= */
/* QR VERIFY STEP */
/* ========================================================= */

function QRCodeVerify({
  totpURI,
  backupCodes,
  onDone,
}: TwoFactorData & { onDone: () => void }) {
  const [completed, setCompleted] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TokenForm>({
    resolver: zodResolver(tokenSchema),
  })

  async function verifyCode(values: TokenForm) {
    await authClient.twoFactor.verifyTotp(
      { code: values.token },
      {
        onSuccess: () => {
          toast.success("Two-factor authentication enabled")
          setCompleted(true)
          router.refresh()
        },
        onError: (error) => {
          toast.error(error?.error?.message ?? "Invalid verification code")
        },
      }
    )
  }

  if (completed) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Save these recovery codes. Each code can be used once.
        </p>

        <div className="grid grid-cols-2 gap-2 rounded-lg border bg-muted/40 p-3">
          {backupCodes.map(code => (
            <span
              key={code}
              className="font-mono text-sm tracking-wider"
            >
              {code}
            </span>
          ))}
        </div>

        <Button onClick={onDone} variant="outline" className="w-full">
          Done
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(verifyCode)} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Scan the QR code using your authenticator app and enter the 6-digit code.
      </p>

      <div className="flex justify-center rounded-xl border bg-background p-4">
        <QRCode size={180} value={totpURI} />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">
          Verification code
        </label>
        <Input
          {...register("token")}
          inputMode="numeric"
          autoComplete="one-time-code"
        />
        {errors.token && (
          <p className="text-xs text-destructive">
            {errors.token.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        <LoadingSwap isLoading={isSubmitting}>
          Verify & Enable
        </LoadingSwap>
      </Button>
    </form>
  )
}
