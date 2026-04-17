import { Plus } from "lucide-react";
import { Suspense } from "react";

import { FooterButtons } from "@/components/footer-buttons";
import { Button } from "@/components/ui/button";
import { PartyType } from "@/lib/generated/prisma/enums";
import { getUserConfig } from "@/lib/user-config";
import { AddPartiesModal } from "./add-parties-modal";
import BalanceCard from "./balance-card";
import { PartyList } from "./party-list";

interface PartyListProp {
  partyType: PartyType;
  search?: string;
  includeInactive?: boolean;
}

export default async function CustomersTab({ partyType, search, includeInactive = false }: PartyListProp) {
  const { currency } = await getUserConfig();

  return (
    <main className="flex-1 w-full space-y-4">
      <Suspense fallback={<div className="h-28 w-full animate-pulse rounded-2xl bg-muted/20 border border-muted/30" />}>
        <BalanceCard
          partyType={partyType}
          search={search}
          includeInactive={includeInactive}
          currency={currency}
        />
      </Suspense>

      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Recently Active
      </p>

      <Suspense fallback={
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-muted/20 border border-muted/30" />
          ))}
        </div>
      }>
        <PartyList
          partyType={partyType}
          search={search}
          includeInactive={includeInactive}
        />
      </Suspense>

      <FooterButtons>
        <AddPartiesModal type={partyType}>
          <Button className="h-14 w-14 md:w-auto md:px-12 rounded-full md:gap-3 font-semibold uppercase bg-primary text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 p-0 md:py-2">
            <Plus className="size-6 sm:size-5" />
            <span className="hidden md:block">
              {partyType === PartyType.CUSTOMER ? "Add Customer" :
                partyType === PartyType.SUPPLIER ? "Add Supplier" :
                  partyType === PartyType.EMPLOYEE ? "Add Employee" :
                    "Add Other"}
            </span>
          </Button>
        </AddPartiesModal>
      </FooterButtons>
    </main>
  );
}

