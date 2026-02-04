"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

  const handleEdit = () => {
    // open edit modal OR navigate
    console.log("Edit party", id)
  }

  const handleDelete = () => {
    // open confirmation dialog
    console.log("Delete party", id)
  }

  return (
    <>
      <div className="flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button
              onClick={(e) => e.stopPropagation()}
              className="rounded-md p-1 text-muted-foreground hover:bg-muted"
            >
              <EllipsisVertical className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuItem onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Party
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Party
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Main Content */}
        <div
          onClick={() => router.push(`/parties/${id}`)}
          className="flex flex-1 cursor-pointer items-center gap-4"
        >
          <Avatar className="h-12 w-12">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={name} />
            ) : (
              <AvatarFallback
                className="font-medium text-white"
                style={{ backgroundColor: avatarColor }}
              >
                {getInitials(name)}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{name}</p>
            {subtitle && (
              <p className="truncate text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          <div className="text-right">
            <p
              className={`font-mono font-bold ${isSettled
                ? "text-muted-foreground"
                : isAdvance
                  ? "text-emerald-600"
                  : "text-rose-500"
                }`}
            >
              {formatAmount(amount, currency)}
            </p>

            <span
              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${isSettled
                ? "bg-gray-100 text-gray-500"
                : isAdvance
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-rose-100 text-rose-500"
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
