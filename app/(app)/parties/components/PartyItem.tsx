import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PartyItem({
    name,
    subtitle,
    amount,
    status,
    avatarUrl,
    initials,
    neutral,
    negative,
}: any) {
    return (
        <div className="flex items-center gap-4 rounded-2xl border bg-card p-4 active:scale-[0.98] transition">

            <Avatar className="h-12 w-12">
                {avatarUrl ? (
                    <AvatarImage src={avatarUrl} />
                ) : (
                    <AvatarFallback>{initials}</AvatarFallback>
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
                    <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                        {status}
                    </span>
                )}
            </div>
        </div>
    )
}
