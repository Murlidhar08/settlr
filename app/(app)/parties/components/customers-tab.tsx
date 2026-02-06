import { Plus } from "lucide-react";
import { Suspense } from "react";

import { PartyList } from "./party-list";
import { PartyType } from "@/lib/generated/prisma/enums";
import { getPartyList } from "@/actions/parties.actions";
import { AddPartiesModal } from "./add-parties-modal";
import { FooterButtons } from "@/components/footer-buttons";
import { Button } from "@/components/ui/button";
import { getUserConfig } from "@/lib/user-config";
import BalanceCard from "./balance-card";

interface PartyListProp {
  partyType: PartyType;
}

export default async function CustomersTab({ partyType }: PartyListProp) {
  const partiesPromise = getPartyList(partyType);
  const { currency } = await getUserConfig();

  return (
    <main className="space-y-4">
      <Suspense fallback={<div className="h-28 w-full animate-pulse rounded-2xl bg-muted" />}>
        <BalanceCard promise={partiesPromise} currency={currency} />
      </Suspense>

      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Recently Active
      </p>

      <Suspense fallback={
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-muted/50" />
          ))}
        </div>
      }>
        <PartyList partyType={partyType} promise={partiesPromise} />
      </Suspense>

      <FooterButtons>
        <AddPartiesModal type={partyType}>
          <Button size="lg" className="px-12 flex-1 h-14 rounded-full font-semibold uppercase bg-primary text-white shadow-lg shadow-rose-600/30 transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
            <Plus className="size-7" />
            <span className="hidden md:block">
              {partyType == PartyType.CUSTOMER ? "Add Customer" : PartyType.SUPPLIER ? "Add Supplier" : "NONE"}
            </span>
          </Button>
        </AddPartiesModal>
      </FooterButtons>

      {/* Bottom Spacing */}
      <div className="h-24" />
    </main>
  );
}

