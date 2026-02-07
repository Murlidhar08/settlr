"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserConfig } from "@/components/providers/user-config-provider";

import { getInitials } from "@/utility/party"
import { formatAmount } from "@/utility/transaction"

const getRandomAvatarColor = () => {
  const hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, 70%, 45%)`
}

interface PartyItemProps {
  id: string
  name: string
  amount: number
  subtitle?: string
  avatarUrl?: string
}

const PartyItem = ({
  id,
  name,
  amount,
  subtitle,
  avatarUrl,
}: PartyItemProps) => {
  const router = useRouter()
  const { currency } = useUserConfig();
  const avatarColor = useMemo(() => getRandomAvatarColor(), [])

  const isAdvance = amount > 0
  const isSettled = amount === 0

  const status = isSettled ? "Settled" : isAdvance ? "Advance" : "Due"

  return (
    <>
      <div className="flex items-center gap-3 rounded-[2rem] border bg-card p-5 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/20 active:scale-[0.99]">
        {/* Main Content */}
        <div
          onClick={() => router.push(`/parties/${id}`)}
          className="flex flex-1 cursor-pointer items-center gap-5"
        >
          <div className="relative group">
            <Avatar className="h-14 w-14 ring-2 ring-background shadow-sm transition-transform duration-500 group-hover:scale-110">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={name} />
              ) : (
                <AvatarFallback
                  className="font-black text-white text-lg"
                  style={{ backgroundColor: avatarColor }}
                >
                  {getInitials(name)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate font-black text-lg tracking-tight group-hover:text-primary transition-colors">{name}</p>
            {subtitle && (
              <p className="truncate text-[11px] font-medium text-muted-foreground uppercase tracking-widest opacity-70">
                {subtitle}
              </p>
            )}
          </div>

          <div className="text-right flex flex-col items-end gap-1.5">
            <p
              className={`font-black text-lg tracking-tighter ${isSettled
                ? "text-muted-foreground/60"
                : isAdvance
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
                }`}
            >
              {formatAmount(amount, currency)}
            </p>

            <span
              className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] border ${isSettled
                ? "bg-muted text-muted-foreground border-transparent"
                : isAdvance
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                  : "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                }`}
            >
              {status}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export { PartyItem }
