// Packages
import { ArrowUp, ChevronRight } from "lucide-react";

// Components
import { SupplierList } from "./supplier-list";

const SuppliersTab = () => {
  return (
    <main className="space-y-4 px-4">

      {/* Total Receivables */}
      <section className="px-2">
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Total Payables
        </p>

        <div className="flex items-center justify-between rounded-2xl border bg-rose-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-rose-100 p-2 text-red-600">
              <ArrowUp className="size-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                To Pay
              </p>
              <p className="text-xl font-bold text-rose-700">
                +$7,653.50
              </p>
            </div>
          </div>
          <ChevronRight className="text-rose-400" />
        </div>
      </section>

      {/* Recently Active */}
      <p className="px-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Recently Active
      </p>

      <SupplierList />
      <div className="h-24" />
    </main>
  );
}

export { SuppliersTab }
