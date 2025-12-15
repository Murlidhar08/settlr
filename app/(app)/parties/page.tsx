"use client";
import Header from "@/components/Header";
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Search,
    ArrowDown,
    ChevronRight,
    Plus,
    ArrowUp,
} from "lucide-react"

export default function Parties() {
    const [tab, setTab] = useState("customers")

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

                                <PartyItem
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
                                    initials="JD"
                                    neutral
                                    avatarUrl="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
                                />

                                <PartyItem
                                    name="Robo cop"
                                    subtitle="Refund pending"
                                    amount="-$120.50"
                                    status="Return"
                                    negative
                                    initials="DC"
                                    avatarUrl="https://robohash.org/mail@ashallendesign.co.uk"
                                />

                                <div className="h-24" />
                            </main>
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

                                <PartyItem
                                    name="Alice's Bakery"
                                    subtitle="Last payment: Today, 10:30 AM"
                                    amount="+$500.00"
                                    status="Due"
                                    avatarUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuD4DdMKqJjqYb5PNJidzuzlmiZnOVFTARfADzGlbcqhk2nEWVxHupN5AXvKdv_p_txKVdoqMn8WM1p3neHoubGpTqhEUU5uSTU_s1un4GFTUSPQ_BHLuqxk0qITI7DkWiXJzUnDW4L5XJ5nF2m5kax7WBdSGlRvT1HMetXGAGHh-AMoDYCKamlqaA4gxpbR2ldF-lYeRgkGgM1X0RhClevdNBDc97q2hDjwOQgADuDKLT6k64nbJxw1_HRr5fSsArUxSKu9gjlMpV-Q"
                                />

                                <PartyItem
                                    name="Urban Coffee Roasters"
                                    subtitle="Invoice #1024 Pending"
                                    amount="+$1,250.00"
                                    status="Due"
                                    initials="UC"
                                />

                                <PartyItem
                                    name="Design Co."
                                    subtitle="Refund pending"
                                    amount="-$120.50"
                                    status="Return"
                                    negative
                                    initials="DC"
                                />

                                <div className="h-24" />
                            </main>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>

            {/* FAB */}
            <Button
                size="icon"
                className="fixed bottom-24 right-6 z-30 h-16 w-16 rounded-full"
            >
                <Plus className="size-7" />
            </Button>
        </div >
    );
}

/* ---------------- Party Item ---------------- */

function PartyItem({
    name,
    subtitle,
    amount,
    status,
    avatarUrl,
    initials,
    neutral,
    negative,
}: any) {
    return (
        <div className="flex items-center gap-4 rounded-2xl border bg-card p-4 active:scale-[0.98] transition">

            <Avatar className="h-12 w-12">
                {avatarUrl ? (
                    <AvatarImage src={avatarUrl} />
                ) : (
                    <AvatarFallback>{initials}</AvatarFallback>
                )}
            </Avatar>

            <div className="flex-1 min-w-0">
                <p className="truncate font-bold">{name}</p>
                <p className="truncate text-xs text-muted-foreground">
                    {subtitle}
                </p>
            </div>

            <div className="text-right">
                <p
                    className={
                        neutral
                            ? "font-mono font-bold text-muted-foreground"
                            : negative
                                ? "font-mono font-bold text-rose-500"
                                : "font-mono font-bold text-emerald-600"
                    }
                >
                    {amount}
                </p>
                {status && (
                    <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                        {status}
                    </span>
                )}
            </div>
        </div>
    )
}
