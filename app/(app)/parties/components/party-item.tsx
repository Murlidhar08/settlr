"use client";

import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { getInitials } from "@/utility/party";

const getRandomAvatarColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 45%)`;
};

interface PartyItemProps {
  id: string;
  name: string;
  amount: number;
  subtitle?: string;
  avatarUrl?: string;
}

const PartyItem = ({
  id,
  name,
  amount,
  subtitle,
  avatarUrl,
}: PartyItemProps) => {
  const router = useRouter();

  const avatarColor = useMemo(() => getRandomAvatarColor(), []);

  const isAdvance = amount > 0;
  const isSettled = amount === 0;

  const status = isSettled
    ? "Settled"
    : isAdvance
      ? "Advance"
      : "Due";

  return (
    <div
      onClick={() => router.push(`/parties/${id}`)}
      className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
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
          ₹{Math.abs(amount)}
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
  );
};

export { PartyItem };
