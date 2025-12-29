import { Card } from "@/components/ui/card"
import { PaymentMode, TransactionDirection } from "@/lib/generated/prisma/enums"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

interface TransactionProp {
  title: string,
  subtitle: string,
  amount: string,
  mode: PaymentMode
  type: TransactionDirection
}

const TransactionItem = ({ title, subtitle, amount, type, mode }: TransactionProp) => {
  const isIn = type === TransactionDirection.IN;

  return (
    <div className="p-1">
      <Card className="flex flex-row items-center p-3 hover:scale-[1.01] transition">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          {isIn ? <ArrowDownLeft className="text-emerald-600 h-5 w-5" /> : <ArrowUpRight className="text-rose-600 h-5 w-5" />}
        </div>

        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold lg:text-base">
            {title ? title : isIn ? "Payment Recived" : "Payment Sended"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground lg:text-sm">
            {mode} • {subtitle}
          </p>
        </div>

        <div className="shrink-0 text-right mr-3">
          <p className={`text-base font-bold lg:text-lg ${isIn ? 'text-emerald-600' : 'text-rose-600'}`}>
            {`${isIn ? "+" : "-"}$${amount}`}
          </p>
        </div>
      </Card>
    </div>
  )
}

export { TransactionItem }
