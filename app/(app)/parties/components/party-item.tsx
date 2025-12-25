"use client";

import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const getInitials = function (userName: string): string {
  const names = userName.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

const getRandomAvatarColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 45%)`;
};


interface partyItemProp {
  id: string,
  name: string,
  amount: string,
  subtitle?: string,
  status?: string,
  avatarUrl?: string,
  neutral?: boolean,
  negative?: boolean,
}

const PartyItem = ({
  id,
  name,
  subtitle,
  amount,
  status,
  avatarUrl,
  neutral,
  negative,
}: partyItemProp) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/parties/${id}`)}
      className="flex items-center justify-between rounded-2xl border bg-white p-4 gap-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >

      <Avatar className="h-12 w-12">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} />
        ) : (
          <AvatarFallback
            className="text-white font-medium"
            style={{
              // eslint-disable-next-line react-hooks/use-memo, react-hooks/rules-of-hooks
              backgroundColor: useMemo(getRandomAvatarColor, [])
            }}
          >
            {getInitials(name)}
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="truncate font-bold">{name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {subtitle}
        </p>
      </div>

      <div className="text-right">
        <p
          className={
            neutral
              ? "font-mono font-bold text-muted-foreground"
              : negative
                ? "font-mono font-bold text-rose-500"
                : "font-mono font-bold text-emerald-600"
          }
        >
          {amount}
        </p>
        {status && (
          <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${neutral
            ? "bg-gray-100"
            : negative
              ? "bg-red-100 text-rose-500"
              : "bg-emerald-100 text-emerald-600"}`} >
            {status}
          </span>
        )}
      </div>
    </div >
  )
}

export { PartyItem }
