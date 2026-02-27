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

  const isReceive = amount > 0
  const isSettled = amount === 0

  const status = isSettled ? "Settled" : isReceive ? "To Receive" : "To Pay"

  return (
    <>
      <div
        onClick={() => router.push(`/parties/${id}`)}
        className="group relative flex items-center gap-4 rounded-[2rem] border-2 border-primary/10 bg-background p-4 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] dark:shadow-none dark:bg-muted/10 transition-all hover:border-primary/30 hover:bg-muted/5 hover:-translate-y-1 active:scale-[0.98] cursor-pointer"
      >
        <div className="relative">
          <Avatar className="h-14 w-14 ring-2 ring-background shadow-sm transition-transform duration-500 group-hover:scale-105">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
            ) : (
              <AvatarFallback
                className="font-black text-white text-lg transition-colors group-hover:brightness-110"
                style={{ backgroundColor: avatarColor }}
              >
                {getInitials(name)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-background p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="h-full w-full rounded-full bg-primary" />
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="truncate font-black text-lg tracking-tight group-hover:text-primary transition-colors">
            {name}
          </p>
          {subtitle && (
            <div className="flex items-center gap-2">
              <span className="truncate text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.15em]">
                {subtitle}
              </span>
            </div>
          )}
        </div>

        <div className="text-right flex flex-col items-end gap-1.5">
          <p
            className={`font-black text-xl tracking-tighter tabular-nums ${isSettled
              ? "text-muted-foreground/40"
              : isReceive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
              }`}
          >
            {formatAmount(amount, currency)}
          </p>

          <span
            className={`inline-flex items-center rounded-xl px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${isSettled
              ? "bg-muted text-muted-foreground/60"
              : isReceive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              }`}
          >
            {status}
          </span>
        </div>
      </div>
    </>
  )
}


export { PartyItem }
