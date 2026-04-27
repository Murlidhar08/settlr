"use client"

import { useUserConfig } from "@/components/providers/user-config-provider"
import { formatDate, formatTime } from "@/utility/transaction"
import { cn } from "@/lib/utils"

interface DateTimeProps {
  date: Date | string | number
  className?: string
}

/**
 * Formats a date according to the user's preferred date format.
 * Uses suppressHydrationWarning to prevent mismatch between server and client.
 */
export function FormattedDate({ date, className }: DateTimeProps) {
  const { dateFormat } = useUserConfig()
  
  return (
    <span className={cn("tabular-nums", className)} suppressHydrationWarning>
      {formatDate(date, dateFormat)}
    </span>
  )
}

/**
 * Formats a time according to the user's preferred time format.
 * Uses suppressHydrationWarning to prevent mismatch between server and client.
 */
export function FormattedTime({ date, className }: DateTimeProps) {
  const { timeFormat } = useUserConfig()
  
  return (
    <span className={cn("tabular-nums", className)} suppressHydrationWarning>
      {formatTime(date, timeFormat)}
    </span>
  )
}

/**
 * Displays both date and time in a consistent format.
 */
export function FormattedDateTime({ date, className, separator = " • " }: DateTimeProps & { separator?: string }) {
  const { dateFormat, timeFormat } = useUserConfig()
  
  return (
    <span className={cn("tabular-nums", className)} suppressHydrationWarning>
      {formatDate(date, dateFormat)}{separator}{formatTime(date, timeFormat)}
    </span>
  )
}
