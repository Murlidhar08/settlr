"use client"

import { authClient } from "@/lib/auth-client"
import { ShieldAlert, UserX } from "lucide-react"
import { BetterAuthActionButton } from "./better-auth-action-button"
import { useRouter } from "next/navigation"

export function ImpersonationIndicator() {
    const router = useRouter()
    const { data: session, refetch } = authClient.useSession()

    if (session?.session.impersonatedBy == null) return null

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center gap-4 px-6 py-3 rounded-[2.5rem] bg-amber-500/10 backdrop-blur-3xl border border-amber-500/20 shadow-2xl shadow-amber-500/10">
                <div className="p-3 bg-amber-500/20 rounded-2xl">
                    <ShieldAlert className="text-amber-600 size-5" />
                </div>
                <div className="flex flex-col">
                    <span className="font-extrabold text-amber-900 text-sm tracking-tight leading-none mb-1">
                        Impersonation Mode
                    </span>
                    <span className="text-[10px] font-bold text-amber-800/60 uppercase tracking-widest leading-none">
                        Viewing as {session?.user.name}
                    </span>
                </div>
                <div className="pl-4 border-l border-amber-500/10 ml-2">
                    <BetterAuthActionButton
                        action={async () =>
                            await authClient.admin.stopImpersonating(undefined, {
                                onSuccess: () => {
                                    router.push("/admin")
                                    refetch()
                                },
                            })
                        }
                        variant="destructive"
                        className="rounded-2xl h-11 px-6 font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-500/10 active:scale-95 transition-all"
                        successMessage="Stopped impersonation"
                    >
                        <UserX className="size-4 mr-2" />
                        Stop
                    </BetterAuthActionButton>
                </div>
            </div>
        </div>
    )
}
