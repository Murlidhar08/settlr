import { TransactionDirection } from "@/lib/generated/prisma/enums"
import { AddTransactionModal } from "./add-transaction-modal"
import { Button } from "@/components/ui/button"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

interface AddTransactionFooterProp {
  partyId?: string | null
}

const AddTransactionFooter = ({ partyId }: AddTransactionFooterProp) => {

  return (
    <div className="fixed bottom-23 right-5 lg:bottom-3 z-50">
      <div className="pointer-events-auto mx-auto flex justify-end gap-4">
        {/* YOU GAVE */}
        <AddTransactionModal
          title="Add Transaction"
          partyId={partyId}
          direction={TransactionDirection.OUT}
        >
          <Button size="lg" className="px-12 flex-1 h-14 rounded-full gap-3 font-semibold uppercase bg-rose-600 text-white shadow-lg shadow-rose-600/30 transition-all hover:bg-rose-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
            <ArrowUpRight className="h-5 w-5" />
            You Gave
          </Button>
        </AddTransactionModal>

        {/* YOU GET */}
        <AddTransactionModal
          title="Add Transaction"
          partyId={partyId}
          direction={TransactionDirection.IN}
        >
          <Button
            size="lg"
            className="px-12 flex-1 h-14 rounded-full gap-3 font-semibold uppercase bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            <ArrowDownLeft className="h-5 w-5" />
            You Get
          </Button>
        </AddTransactionModal>
      </div>
    </div>
  )
}

export { AddTransactionFooter }
