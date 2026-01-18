import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { TotpForm } from "./components/totp-form"
import { BackupCodeTab } from "./components/backup-code-tab"

export default async function TwoFactorPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // If already authenticated, no need for 2FA
  if (session) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border bg-background p-6 shadow-sm">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold">
            Two-Factor Authentication
          </h1>
          <p className="text-sm text-muted-foreground">
            Verify your identity to continue
          </p>
        </div>

        {/* Tabs replacement */}
        <div className="space-y-6">
          <TotpForm />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or use backup code
              </span>
            </div>
          </div>

          <BackupCodeTab />
        </div>
      </div>
    </div>
  )
}
