export default function StatusCard({ title, amount, subtitle, icon, positive }: any) {
  return (
    <div className={`flex items-center justify-between rounded-2xl border p-5 shadow-sm transition-transform hover:-translate-y-1
            ${positive
        ? "bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/30"
        : "bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-900/30"
      }`}>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xl font-bold">{amount}</p>
        <p className="text-xs opacity-70">{subtitle}</p>
      </div>
      <div className={`h-12 w-12 flex items-center justify-center rounded-full bg-white/80 dark:bg-black/20 border-2 ${positive ? "border-green-200" : "border-red-200"}`}>
        {icon}
      </div>
    </div>
  );
}
