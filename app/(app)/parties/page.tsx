// Packages
import { PartyType } from "@/lib/generated/prisma/enums";
import { Suspense } from "react";

// Components
import CustomersTab from "./components/customers-tab";
import { PartyFilters } from "./components/party-filters";
import * as motion from "framer-motion/client";
import { getUserConfig } from "@/lib/user-config";
import { t } from "@/lib/languages/i18n";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Parties({ searchParams }: PageProps) {
  const params = await searchParams;
  const { language } = await getUserConfig();
  const currentTab = typeof params.tab === 'string' ? params.tab : "customers";
  const searchQuery = typeof params.search === 'string' ? params.search : "";

  const partyType =
    currentTab === "suppliers" ? PartyType.SUPPLIER :
      currentTab === "employees" ? PartyType.EMPLOYEE :
        currentTab === "other" ? PartyType.OTHER :
          PartyType.CUSTOMER;

  return (
    <div className="w-full bg-background mx-auto max-w-4xl mt-6 space-y-8 px-6">
      <PartyFilters />

      <motion.div
        key={`${currentTab}-${searchQuery}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Suspense fallback={
          <div className="space-y-4">
            <div className="h-28 w-full animate-pulse rounded-2xl bg-muted/50" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-muted/30" />
              ))}
            </div>
          </div>
        }>
          <CustomersTab
            partyType={partyType}
            search={searchQuery}
          />
        </Suspense>
      </motion.div>
    </div>
  );
}

