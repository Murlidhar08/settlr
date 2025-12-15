"use client";

import { Bell, Search, Users, Home, BarChart3, Settings, Plus, ChevronRight, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";

export default function PartiesScreen() {
    return (
        <div className="w-full">
            {/* Header */}
            <Header title="Parties" />

            {/* Header */}
            <header className="sticky top-0 z-20 bg-background backdrop-blur supports-backdrop-filter:bg-background/70 pt-3">
                <div className="px-6 pb-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search name, phone…"
                            className="h-12 rounded-full pl-12"
                        />
                    </div>
                </div>

                <div className="px-6 pb-4">
                    <div className="grid grid-cols-2 rounded-full bg-muted p-1">
                        <Button className="rounded-full">Customers</Button>
                        <Button variant="ghost" className="rounded-full text-muted-foreground">
                            Suppliers
                        </Button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="space-y-4 px-4">
                {/* Summary */}
                <Card className="rounded-2xl border-emerald-200 bg-emerald-50">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
                                <ArrowDown className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">To Collect</p>
                                <p className="text-xl font-bold text-emerald-700">+₹3,450.50</p>
                            </div>
                        </div>
                        <ChevronRight className="text-emerald-400" />
                    </div>
                </Card>

                <p className="px-2 text-xs font-semibold uppercase text-muted-foreground">
                    Recently Active
                </p>

                {/* Party Item */}
                <Card className="rounded-2xl transition-transform active:scale-[0.98]">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 font-semibold">
                            AB
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">Alice&apos;s Bakery</p>
                            <p className="text-xs text-muted-foreground">Last payment today</p>
                        </div>
                        <div className="text-right">
                            <p className="font-mono font-semibold text-emerald-600">+₹500.00</p>
                            <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                                Due
                            </span>
                        </div>
                    </div>
                </Card>

                <Card className="rounded-2xl transition-transform active:scale-[0.98]">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 font-semibold">
                            AB
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">Chavda Mahesh</p>
                            <p className="text-xs text-muted-foreground">Last payment today</p>
                        </div>
                        <div className="text-right">
                            <p className="font-mono font-semibold text-red-600">-₹500.00</p>
                            <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                                Return
                            </span>
                        </div>
                    </div>
                </Card>

                <Card className="rounded-2xl transition-transform active:scale-[0.98]">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 font-semibold">
                            JD
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">John Doe</p>
                            <p className="text-xs text-muted-foreground">Last payment today</p>
                        </div>
                        <div className="text-right">
                            <p className="font-mono font-semibold text-gray-600">₹0.00</p>
                        </div>
                    </div>
                </Card>
                <Card className="rounded-2xl transition-transform active:scale-[0.98]">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 font-semibold">
                            JD
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">John Doe</p>
                            <p className="text-xs text-muted-foreground">Last payment today</p>
                        </div>
                        <div className="text-right">
                            <p className="font-mono font-semibold text-gray-600">₹0.00</p>
                        </div>
                    </div>
                </Card>
                <Card className="rounded-2xl transition-transform active:scale-[0.98]">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 font-semibold">
                            JD
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">John Doe</p>
                            <p className="text-xs text-muted-foreground">Last payment today</p>
                        </div>
                        <div className="text-right">
                            <p className="font-mono font-semibold text-gray-600">₹0.00</p>
                        </div>
                    </div>
                </Card>
                <Card className="rounded-2xl transition-transform active:scale-[0.98]">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 font-semibold">
                            JD
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">John Doe</p>
                            <p className="text-xs text-muted-foreground">Last payment today</p>
                        </div>
                        <div className="text-right">
                            <p className="font-mono font-semibold text-gray-600">₹0.00</p>
                        </div>
                    </div>
                </Card>
                <Card className="rounded-2xl transition-transform active:scale-[0.98]">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 font-semibold">
                            JD
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">John Doe</p>
                            <p className="text-xs text-muted-foreground">Last payment today</p>
                        </div>
                        <div className="text-right">
                            <p className="font-mono font-semibold text-gray-600">₹0.00</p>
                        </div>
                    </div>
                </Card>
                <Card className="rounded-2xl transition-transform active:scale-[0.98]">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 font-semibold">
                            JD
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">John Doe</p>
                            <p className="text-xs text-muted-foreground">Last payment today</p>
                        </div>
                        <div className="text-right">
                            <p className="font-mono font-semibold text-gray-600">₹0.00</p>
                        </div>
                    </div>
                </Card>
                <Card className="rounded-2xl transition-transform active:scale-[0.98]">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 font-semibold">
                            JD
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">John Doe</p>
                            <p className="text-xs text-muted-foreground">Last payment today</p>
                        </div>
                        <div className="text-right">
                            <p className="font-mono font-semibold text-gray-600">₹0.00</p>
                        </div>
                    </div>
                </Card>
                <Card className="rounded-2xl transition-transform active:scale-[0.98]">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 font-semibold">
                            JD
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">John Doe</p>
                            <p className="text-xs text-muted-foreground">Last payment today</p>
                        </div>
                        <div className="text-right">
                            <p className="font-mono font-semibold text-gray-600">₹0.00</p>
                        </div>
                    </div>
                </Card>
            </main>

            {/* FAB */}
            <Button
                size="icon"
                className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg transition-transform active:scale-90"
            >
                <Plus className="h-6 w-6" />
            </Button>
        </div>
    );
}