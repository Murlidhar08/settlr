"use client";

// Packages
import Header from "@/components/Header";
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ArrowDown, ChevronRight, ArrowUp } from "lucide-react"
import { PartyType } from "@/lib/generated/prisma/enums";

// Components
import AddPartiesModal from "./components/AddPartiesModal";
import PartyItem from "./components/PartyItem";
import CustomerList from "./components/CustomerList";
import SupplierList from "./components/SupplierList";

export default function Parties() {
    const [tab, setTab] = useState("customers");

    return (
        <div className="w-full bg-background pb-28">
            {/* Header */}
            <Header title="Parties" />

            {/* Search */}
            <div className="px-6 pb-3">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                    <Input
                        placeholder="Search name, phone..."
                        className="h-12 rounded-full pl-10"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="px-6 pb-4 flex justify-center md:justify-start">
                <Tabs value={tab} onValueChange={setTab} className="w-full">
                    <TabsList
                        className="h-28 rounded-full transition-all duration-300 w-86 md:w-96 lg:w-96"
                    >
                        <TabsTrigger
                            value="customers"
                            className="flex-1 rounded-full p-3"
                        >
                            Customers
                        </TabsTrigger>

                        <TabsTrigger
                            value="suppliers"
                            className="flex-1 rounded-full"
                        >
                            Suppliers
                        </TabsTrigger>
                    </TabsList>

                    {/* TAB CONTENT */}
                    <div className="mt-4">
                        <TabsContent value="customers">
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

                                {/* <PartyItem
                                    name="Alice Hue"
                                    subtitle="Last payment: Today, 10:30 AM"
                                    amount="+$500.00"
                                    status="Due"
                                    avatarUrl="https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk"
                                />

                                <PartyItem
                                    name="John Doe"
                                    subtitle="Settled up • 2 days ago"
                                    amount="$0.00"
                                    status="Settled"
                                    neutral
                                    avatarUrl="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
                                />

                                <PartyItem
                                    name="Robo cop"
                                    subtitle="Refund pending"
                                    amount="-$120.50"
                                    status="Return"
                                    negative
                                    avatarUrl="https://robohash.org/mail@ashallendesign.co.uk"
                                /> */}

                                <div className="h-24" />
                            </main>

                            <AddPartiesModal title="Add Customer" type={PartyType.CUSTOMER} />
                        </TabsContent>

                        <TabsContent value="suppliers">
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

                                {/* <PartyItem
                                    name="Alice's Bakery"
                                    subtitle="Last payment: Today, 10:30 AM"
                                    amount="+$500.00"
                                    status="Due"
                                    avatarUrl=""
                                />

                                <PartyItem
                                    name="Urban Coffee Roasters"
                                    subtitle="Invoice #1024 Pending"
                                    amount="+$1,250.00"
                                    status="Due"
                                />

                                <PartyItem
                                    name="Design Co."
                                    subtitle="Refund pending"
                                    amount="-$120.50"
                                    status="Return"
                                    negative
                                /> */}

                                <div className="h-24" />
                            </main>

                            <AddPartiesModal title="Add Supplier" type={PartyType.SUPPLIER} />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div >
    );
}