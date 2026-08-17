import { ReactNode } from "react";

export function InfoItem({ icon, label, value, highlight }: { icon: ReactNode, label: string, value: ReactNode, highlight?: boolean }) {
    return (
        <div className="group flex items-start gap-4">
            <div className="mt-1 p-2.5 rounded-2xl bg-muted/50 text-muted-foreground group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 shadow-sm border border-border/20">
                {icon}
            </div>
            <div className="space-y-1.5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">{label}</p>
                <p className={`text-sm font-black tracking-tight ${highlight ? 'text-primary' : 'text-foreground/90'} line-clamp-2`}>
                    {value}
                </p>
            </div>
        </div>
    )
}