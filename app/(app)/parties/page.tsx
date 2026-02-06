// Packages
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { PartyType } from "@/lib/generated/prisma/enums";

// Components
import CustomersTab from "./components/customers-tab";
import { LoadingSuspense } from "@/components/loading-suspense";

export default function Parties() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Parties" />

      <div className="mx-auto max-w-4xl pb-32 mt-6 space-y-8 px-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="Search name, phone..."
            className="h-12 rounded-full pl-10"
          />
        </div>

        <div className="flex justify-center md:justify-start">
          <Tabs defaultValue="customers" className="w-full">
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
                <CustomersTab partyType={PartyType.CUSTOMER} />
              </TabsContent>

              <TabsContent value="suppliers">
                <LoadingSuspense>
                  <CustomersTab partyType={PartyType.SUPPLIER} />
                </LoadingSuspense>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
