import { ArrowDown, ArrowUp, ChevronRight } from "lucide-react";

import { PartyList } from "./party-list";
import { PartyType } from "@/lib/generated/prisma/enums";
import { getPartyList } from "@/actions/parties.actions";
import { AddPartiesModal } from "./add-parties-modal";

interface PartyListProp {
  partyType: PartyType;
}

export default async function CustomersTab({ partyType }: PartyListProp) {
  const res = await getPartyList(partyType)

  // Calculated
  let totalAmount = res.reduce((sum, party) => { return sum + party.amount; }, 0);
  totalAmount = Number(totalAmount.toFixed(3));
  const isCollect = totalAmount > 0;
  const isPay = totalAmount < 0;
  const isSettled = totalAmount === 0;

  const label = isSettled ? "Settled"
    : isCollect
      ? "To Collect"
      : "To Pay";

  const ArrowIcon = isCollect ? ArrowDown : ArrowUp;

  return (
    <main className="space-y-4">
      {/* Total Balance */}
      <section>
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Total Balance
        </p>

        <div
          className={`flex items-center justify-between rounded-2xl border p-4 transition-colors ${isCollect
            ? "bg-emerald-50"
            : isPay ? "bg-rose-50" : "bg-muted"
            }`}
        >
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${isCollect
              ? "bg-emerald-100 text-emerald-600"
              : isPay
                ? "bg-rose-100 text-rose-600"
                : "bg-gray-100 text-gray-500"
              }`}
            >
              {!isSettled && <ArrowIcon className="size-4" />}
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {label}
              </p>

              <p
                className={`text-xl font-bold ${isCollect
                  ? "text-emerald-700"
                  : isPay
                    ? "text-rose-600"
                    : "text-muted-foreground"
                  }`}
              >
                {`₹${Math.abs(totalAmount)}`}
              </p>
            </div>
          </div>

          <ChevronRight
            className={
              isCollect
                ? "text-emerald-400"
                : isPay
                  ? "text-rose-400"
                  : "text-muted-foreground"
            }
          />
        </div>
      </section>

      {/* Recently Active */}
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Recently Active
      </p>

      {/* List of party Items */}
      <PartyList partyType={partyType} />

      {/* Add Party */}
      <AddPartiesModal type={partyType} />

      {/* Bottom Spacing */}
      <div className="h-24" />
    </main>
  );
}
