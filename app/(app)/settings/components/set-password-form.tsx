import { ActionButton } from "@/components/ui/action-button"
import { authClient } from "@/lib/auth-client"

export default function SetPasswordForm({ email }: { email?: string }) {
  if (!email)
    return console.error("Session ended");

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

import { ComponentProps } from "react"

function BetterAuthActionButton({
  action,
  successMessage,
  ...props
}: Omit<ComponentProps<typeof ActionButton>, "action"> & {
  action: () => Promise<{ error: null | { message?: string } }>
  successMessage?: string
}) {
  return (
    <ActionButton
      {...props}
      action={async () => {
        const res = await action()

        if (res.error) {
          return { error: true, message: res.error.message || "Action failed" }
        } else {
          return { error: false, message: successMessage }
        }
      }}
    />
  )
}
