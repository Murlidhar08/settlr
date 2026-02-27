"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function StatusCard({ title, amount, subtitle, icon, positive }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.01 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] border p-6 sm:p-8 shadow-xs transition-all hover:shadow-2xl",
        positive
          ? "bg-emerald-50/30 border-emerald-100/50 dark:bg-emerald-500/5 dark:border-emerald-500/10 hover:shadow-emerald-500/10"
          : "bg-rose-50/30 border-rose-100/50 dark:bg-rose-500/5 dark:border-rose-500/10 hover:shadow-rose-500/10"
      )}
    >
      <div className="flex items-center justify-between relative z-10">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{title}</p>
          <p className={cn(
            "text-2xl sm:text-3xl font-black tracking-tighter tabular-nums",
            positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
          )}>
            {amount}
          </p>
          <p className="text-[11px] font-bold text-muted-foreground/40 italic">{subtitle}</p>
        </div>

        <div className={cn(
          "h-10 w-10 sm:h-14 sm:w-14 flex items-center justify-center rounded-2xl shadow-inner border transition-all duration-700 group-hover:rotate-12 group-hover:scale-110",
          positive
            ? "bg-white dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20"
            : "bg-white dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20"
        )}>
          {icon}
        </div>
      </div>

      {/* Background Decor */}
      <div className={cn(
        "absolute -bottom-10 -left-10 h-32 w-32 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40",
        positive ? "bg-emerald-400" : "bg-rose-400"
      )} />
    </motion.div>
  );
}
