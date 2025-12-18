import { Card } from "@/components/ui/card"
import { TransactionDirection } from "@/lib/generated/prisma/enums"
import { ArrowDown, ArrowUpRight } from "lucide-react"

interface TransactionProp {
    title: string,
    subtitle: string,
    amount: string,
    type: TransactionDirection
}

export default function TransactionItem({ title, subtitle, amount, type, }: TransactionProp) {
    const isIn = type === TransactionDirection.IN;

    return (
        <div className="p-1"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
        >
            <Card className="flex flex-row items-center p-3 hover:scale-[1.01] transition">
                <div
                    className={`mr-4 flex h-12 w-12 items-center justify-center rounded-full ${isIn
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-rose-100 text-rose-600'
                        }`}
                >
                    {isIn ? <ArrowDown className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-bold lg:text-base">{title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground lg:text-sm">{subtitle}</p>
                </div>

                <div className="shrink-0 text-right">
                    <p className={`text-base font-bold lg:text-lg ${isIn ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {`${isIn ? "+" : "-"}$${amount}`}
                    </p>
                </div>
            </Card>
        </div>
    )
}
