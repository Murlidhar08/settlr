import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { TotpForm } from "./components/totp-form"
import { BackupCodeTab } from "./components/backup-code-tab"
import { ShieldCheck, Wallet } from "lucide-react"

export default async function TwoFactorPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // If already authenticated, no need for 2FA
  if (session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background select-none overflow-hidden">

      {/* LEFT PANEL */}
      <div className="flex flex-col justify-between w-full lg:w-1/2 px-6 sm:px-12 lg:px-20 py-8 relative z-10">

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-6 group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
            <Wallet className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">Settlr</h1>
        </div>

        {/* CENTER CARD */}
        <div className="flex flex-col justify-center max-w-md mx-auto w-full flex-1">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                Security Check
              </h2>
              <p className="text-muted-foreground text-lg">
                Your account is protected with two-factor authentication.
              </p>
            </div>

            <div className="space-y-8 bg-muted/30 p-8 rounded-[2rem] border border-muted-foreground/10 shadow-sm backdrop-blur-sm">
              <TotpForm />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted-foreground/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background/80 px-4 py-1 rounded-full text-muted-foreground font-medium border border-muted-foreground/10">
                    Or use backup code
                  </span>
                </div>
              </div>

              <BackupCodeTab />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Need help? <a href="#" className="font-bold text-primary hover:text-primary/80 transition-colors">Contact Support</a>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="hidden lg:flex w-1/2 p-12 items-center justify-center bg-linear-to-br from-primary to-primary-foreground/10 relative overflow-hidden rounded-l-[4rem] shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-foreground/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-foreground/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 text-center px-12 text-primary-foreground">
          <div className="w-48 h-56 bg-white/10 backdrop-blur-2xl rounded-[3rem] flex flex-col items-center justify-center border border-white/20 shadow-2xl mx-auto mb-10">
            <ShieldCheck className="w-20 h-20 text-white animate-pulse" />
          </div>
          <h2 className="text-4xl font-bold mb-6 tracking-tight">
            Extra Layer of Security
          </h2>
          <p className="text-white/80 leading-relaxed text-lg max-w-md mx-auto font-medium">
            By enabling 2FA, you ensure that only you can access your account, even if someone else knows your password.
          </p>
        </div>
      </div>
    </div>
  )
}

