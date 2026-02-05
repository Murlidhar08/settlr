import { ReactNode } from "react";
import Link from "next/link";

interface TransactionItemProps {
  id: string,
  icon: ReactNode;
  title: string;
  meta: string;
  amount: string;
  positive: boolean;
}

export default function TransactionItem({
  id,
  icon,
  title,
  meta,
  amount,
  positive,
}: TransactionItemProps) {
  return (
    <Link
      href={`/transactions/${id}`}
      className="block focus:outline-none"
    >
      <div className="group flex cursor-pointer items-center justify-between rounded-2xl border bg-white p-4 shadow-sm transition-all + hover:-translate-y-0.5 hover:shadow-md + focus-visible:ring-2 focus-visible:ring-emerald-500 + dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl
          ${positive
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
              : "bg-rose-50 text-rose-500 dark:bg-rose-900/20"
            }`}
          >
            {icon}
          </div>

          <div>
            <p className="text-xs text-slate-500 group-hover:text-slate-600">
              {meta}
            </p>
            <p className="font-semibold">{title}</p>
          </div>
        </div>

        <p className={`font-bold ${positive ? "text-emerald-600" : "text-rose-500"}`}>
          {amount}
        </p>
      </div>
    </Link>
  );
}
