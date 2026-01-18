interface CashSummaryProp {
  totalIn: number
  totalOut: number
}

export default function CashSummary({
  totalIn,
  totalOut,
}: CashSummaryProp) {
  const cashBalance = totalIn - totalOut
  const isPositive = cashBalance >= 0

  const formatAmount = (value: number) =>
    value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  return (
    <div className="mt-6 rounded-3xl bg-background p-6 shadow-sm">
      <p className="text-center text-xs uppercase text-muted-foreground">
        Total Cash Balance
      </p>

      <h2
        className={`mt-2 text-center text-4xl font-extrabold ${isPositive ? "text-emerald-600" : "text-rose-600"
          }`}
      >
        ₹{formatAmount(Math.abs(cashBalance))}
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {/* Total In */}
        <div className="rounded-2xl bg-emerald-50 p-4 text-center">
          <p className="text-lg font-bold text-emerald-600">
            +₹{formatAmount(totalIn)}
          </p>
          <span className="text-xs text-muted-foreground">Total In</span>
        </div>

        {/* Total Out */}
        <div className="rounded-2xl bg-rose-50 p-4 text-center">
          <p className="text-lg font-bold text-rose-600">
            -₹{formatAmount(totalOut)}
          </p>
          <span className="text-xs text-muted-foreground">Total Out</span>
        </div>
      </div>
    </div>
  )
}
