export default function StatusCard({ title, amount, subtitle, icon, positive }: any) {
  return (
    <div className={`group flex items-center justify-between rounded-[2rem] border p-6 shadow-xs transition-all hover:shadow-lg hover:-translate-y-1 ${positive
      ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/10"
      : "bg-rose-50/50 border-rose-100 dark:bg-rose-500/5 dark:border-rose-500/10"
      }`}>
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-70">{title}</p>
        <p className="text-2xl font-black tracking-tight">{amount}</p>
        <p className="text-[11px] font-bold text-muted-foreground/60">{subtitle}</p>
      </div>
      <div className={`h-14 w-14 flex items-center justify-center rounded-2xl shadow-sm border transition-transform duration-500 group-hover:rotate-12 ${positive
        ? "bg-white dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20"
        : "bg-white dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20"
        }`}>
        {icon}
      </div>
    </div>
  );
}
