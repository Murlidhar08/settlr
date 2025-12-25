"use client";

// Packages
import { Header } from "@/components/header";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { PartyType } from "@/lib/generated/prisma/enums";

// Components
import { AddPartiesModal } from "./components/add-parties-modal";
import { CustomersTab } from "./components/customers-tab";
import { SuppliersTab } from "./components/suppliers-tab";

const VALID_TABS = ["customers", "suppliers"] as const;
type TabType = (typeof VALID_TABS)[number];

export default function Parties() {
  const [tab, setTab] = useState<TabType>("customers");

  // Read hash on initial load + on back/forward
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (VALID_TABS.includes(hash as TabType)) {
        setTab(hash as TabType);
      }
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);

    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  // Update hash when tab changes
  const handleTabChange = (val: string) => {
    const nextTab = val as TabType;
    setTab(nextTab);
    window.history.replaceState(null, "", `#${nextTab}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header title="Parties" />

      {/* Main content */}
      <div className="mx-auto max-w-4xl pb-32 mt-6 space-y-8 px-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="Search name, phone..."
            className="h-12 rounded-full pl-10"
          />
        </div>

        {/* Tabs */}
        <div className="flex justify-center md:justify-start">
          <Tabs
            value={tab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="h-28 rounded-full transition-all duration-300 w-86 md:w-96 lg:w-96">
              <TabsTrigger value="customers" className="flex-1 rounded-full p-3">
                Customers
              </TabsTrigger>

              <TabsTrigger value="suppliers" className="flex-1 rounded-full">
                Suppliers
              </TabsTrigger>
            </TabsList>

            {/* TAB CONTENT */}
            <div className="mt-4">
              <TabsContent value="customers">
                <CustomersTab />
                <AddPartiesModal
                  title="Add Customer"
                  type={PartyType.CUSTOMER}
                />
              </TabsContent>

              <TabsContent value="suppliers">
                <SuppliersTab />
                <AddPartiesModal
                  title="Add Supplier"
                  type={PartyType.SUPPLIER}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
