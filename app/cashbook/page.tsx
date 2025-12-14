"use client";

import {
    Bell,
    Search,
    Plus,
    Wallet,
    BarChart3,
    LayoutGrid,
    Settings,
    ArrowUpRight,
    ArrowDownLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CashbookScreen() {
    return (
        <div className="min-h-screen bg-background pb-28 text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b">
                <div className="flex items-center justify-between px-4 py-3">
                    <h1 className="text-lg font-semibold">Cashbook</h1>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Bell className="h-5 w-5" />
                    </Button>
                </div>

                {/* Balance */}
                <div className="px-4 pb-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Total Cash Balance
                    </p>
                    <p className="mt-1 text-3xl font-extrabold tracking-tight">
                        ₹4,250.00
                    </p>
                </div>

                {/* Stats */}
                <div className="flex gap-3 px-4 pb-4">
                    <Card className="flex-1 rounded-2xl bg-emerald-50 border-emerald-200">
                        <div className="p-3 text-center">
                            <p className="text-emerald-600 text-lg font-bold">+₹1,500.00</p>
                            <p className="text-xs text-muted-foreground">Total In</p>
                        </div>
                    </Card>
                    <Card className="flex-1 rounded-2xl bg-rose-50 border-rose-200">
                        <div className="p-3 text-center">
                            <p className="text-rose-600 text-lg font-bold">-₹820.00</p>
                            <p className="text-xs text-muted-foreground">Total Out</p>
                        </div>
                    </Card>
                </div>

                {/* Search */}
                <div className="px-4 pb-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by party, amount, or tag"
                            className="h-11 rounded-xl pl-9"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
                    <Badge className="rounded-full px-4 py-1">All</Badge>
                    <Badge variant="secondary" className="rounded-full px-4 py-1">
                        Cash
                    </Badge>
                    <Badge variant="secondary" className="rounded-full px-4 py-1">
                        Online
                    </Badge>
                    <Badge variant="secondary" className="rounded-full px-4 py-1">
                        Date
                    </Badge>
                </div>
            </header>

            {/* Transactions */}
            <main className="px-4 pt-4 space-y-6">
                {/* Today */}
                <section>
                    <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase text-muted-foreground">
                        <span>Today · 12 Oct</span>
                        <span className="font-mono text-rose-500">-₹330.00</span>
                    </div>

                    <TransactionItem
                        name="Sarah Mitchell"
                        time="10:42 AM"
                        tag="Online"
                        amount="+₹120.00"
                        type="in"
                        note="Sale #204"
                    />

                    <TransactionItem
                        name="Fast Logistics"
                        time="02:15 PM"
                        tag="Cash"
                        amount="-₹450.00"
                        type="out"
                        note="Delivery"
                    />
                </section>

                {/* Yesterday */}
                <section>
                    <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase text-muted-foreground">
                        <span>Yesterday · 11 Oct</span>
                        <span className="font-mono text-emerald-600">+₹200.00</span>
                    </div>

                    <TransactionItem
                        name="General Sales"
                        time="05:30 PM"
                        tag="Cash"
                        amount="+₹200.00"
                        type="in"
                        note="Store"
                    />

                    <TransactionItem
                        name="Electricity Bill"
                        time="09:00 AM"
                        tag="Online"
                        amount="-₹120.00"
                        type="out"
                        note="Utilities"
                    />
                </section>
            </main>

            {/* FAB */}
            <Button
                size="icon"
                className="fixed bottom-24 right-5 h-14 w-14 rounded-full shadow-lg transition-transform active:scale-90"
            >
                <Plus className="h-6 w-6" />
            </Button>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/90 backdrop-blur">
                <ul className="flex justify-around px-6 py-3">
                    <NavItem icon={<Wallet />} label="Cashbook" active />
                    <NavItem icon={<BarChart3 />} label="Reports" />
                    <NavItem icon={<LayoutGrid />} label="Tools" />
                    <NavItem icon={<Settings />} label="Settings" />
                </ul>
            </nav>
        </div>
    );
}

function TransactionItem({ name, time, tag, amount, type, note }: any) {
    const isIn = type === "in";

    return (
        <Card className="mb-3 rounded-2xl transition-transform active:scale-[0.98]">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${isIn ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                            }`}
                    >
                        {isIn ? <ArrowDownLeft /> : <ArrowUpRight />}
                    </div>
                    <div>
                        <p className="text-sm font-semibold">{name}</p>
                        <div className="mt-1 flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px]">
                                {tag}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">{time}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p
                        className={`font-mono font-semibold ${isIn ? "text-emerald-600" : "text-rose-600"
                            }`}
                    >
                        {amount}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{note}</p>
                </div>
            </div>
        </Card>
    );
}

function NavItem({ icon, label, active }: any) {
    return (
        <li
            className={`flex flex-col items-center gap-1 text-xs ${active ? "text-primary" : "text-muted-foreground"
                }`}
        >
            {icon}
            <span className={active ? "font-semibold" : "font-medium"}>{label}</span>
        </li>
    );
}
