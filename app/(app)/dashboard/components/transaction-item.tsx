import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface TransactionItemProps {
  id: string,
  icon: ReactNode;
  title: string;
  meta: string;
  amount: string;
  positive: boolean;
  fromAccount?: string;
  toAccount?: string;
}

export default function TransactionItem({
  id,
  icon,
  title,
  meta,
  amount,
  positive,
  fromAccount,
  toAccount,
}: TransactionItemProps) {
  return (
    <Link
      href={`/transactions/${id}`}
      className="block focus:outline-none"
    >
      <div className="group flex cursor-pointer items-center justify-between rounded-[2rem] border bg-card p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/20 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary/20">
        <div className="flex items-center gap-5">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110 shadow-sm
          ${positive
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400"
            }`}
          >
            {icon}
          </div>

          <div className="space-y-1">
            <p className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{title}</p>
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider opacity-70 group-hover:opacity-100 transition-opacity">
                {meta}
              </p>
              {(fromAccount || toAccount) && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/50 text-[9px] font-black uppercase tracking-tighter text-muted-foreground/60">
                  <span className="truncate max-w-[60px]">{fromAccount}</span>
                  <ArrowRight size={8} />
                  <span className="truncate max-w-[60px] text-foreground/50">{toAccount}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className={`font-black text-lg ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
            {amount}
          </p>
        </div>
      </div>
    </Link>
  );
}
