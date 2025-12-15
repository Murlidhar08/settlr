export default function TransactionItem({ icon, title, meta, amount, positive }: any) {
    return (
        <div className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl
                    ${positive
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
                        : "bg-rose-50 text-rose-500 dark:bg-rose-900/20"
                    }`}>
                    {icon}
                </div>
                <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-xs text-slate-500">{meta}</p>
                </div>
            </div>
            <p className={`font-bold ${positive ? "text-emerald-600" : "text-rose-500"}`}>
                {amount}
            </p>
        </div>
    );
}