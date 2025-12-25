// Packages
import { ArrowDown, ChevronRight } from "lucide-react";

// Components
import CustomerList from "./CustomerList";

export default function CustomersTab() {
    return (
        <main className="space-y-4 px-4">

            {/* Total Receivables */}
            <section className="px-2">
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Total Receivables
                </p>

                <div className="flex items-center justify-between rounded-2xl border bg-emerald-50 p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
                            <ArrowDown className="size-4" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">
                                To Collect
                            </p>
                            <p className="text-xl font-bold text-emerald-700">
                                +$3,450.50
                            </p>
                        </div>
                    </div>
                    <ChevronRight className="text-emerald-400" />
                </div>
            </section>

            {/* Recently Active */}
            <p className="px-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Recently Active
            </p>

            <CustomerList />
            <div className="h-24" />
        </main>
    );
}