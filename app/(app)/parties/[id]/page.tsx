'use client'

import * as React from 'react'
import {
    ArrowLeft,
    MoreVertical,
    ArrowUpRight,
    ArrowDown,
    Plus,
    Search,
    Phone,
    Share2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function PartyDetailsPage() {
    return (
        <div className="relative mx-auto min-h-screen max-w-md bg-background pb-28">
            {/* Top App Bar */}
            <header className="sticky top-0 z-20 flex items-center justify-between bg-background/90 backdrop-blur px-4 py-3">
                <Button size="icon" variant="ghost">
                    <ArrowLeft className="h-5 w-5" />
                </Button>

                <div className="flex flex-1 flex-col items-center">
                    <h2 className="text-lg font-bold tracking-tight">Acme Corp</h2>
                    <Badge variant="secondary" className="mt-0.5 text-[10px] uppercase tracking-wider">
                        Supplier
                    </Badge>
                </div>

                <Button size="icon" variant="ghost">
                    <MoreVertical className="h-5 w-5" />
                </Button>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto pb-24">
                {/* Balance Card */}
                <section className="px-4 py-2">
                    <Card className="relative rounded-2xl p-6">
                        <div className="absolute left-0 top-0 h-full w-1.5 bg-primary rounded-l-2xl" />

                        <div className="flex flex-col gap-4">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                                    Net Balance to Pay
                                </p>
                                <h1 className="mt-1 text-4xl font-bold">$1,250.00</h1>
                            </div>

                            <Separator />

                            <div className="flex gap-6">
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Total In</span>
                                    <span className="font-semibold text-emerald-600">+$4,500.00</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Total Out</span>
                                    <span className="font-semibold text-rose-500">-$3,250.00</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Quick Actions */}
                <section className="px-4 py-2">
                    <div className="flex gap-3">
                        <Button variant="outline" className="h-12 flex-1 rounded-full gap-2">
                            <Share2 className="h-4 w-4" />
                            Statement
                        </Button>
                        <Button variant="outline" className="h-12 flex-1 rounded-full gap-2">
                            <Phone className="h-4 w-4" />
                            Call Party
                        </Button>
                    </div>
                </section>

                {/* Search */}
                <section className="sticky top-[64px] z-10 bg-background px-4 py-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search transactions..."
                            className="h-11 rounded-full pl-11"
                        />
                    </div>
                </section>

                {/* Transactions */}
                <section className="px-4 pb-4">
                    <h3 className="mb-3 ml-1 text-sm font-bold">Recent Transactions</h3>

                    <div className="flex flex-col gap-3">
                        <TransactionItem
                            title="Invoice #1023"
                            subtitle="Oct 24, 2023 • Payment Sent"
                            amount="-$500.00"
                            type="out"
                        />
                        <TransactionItem
                            title="Refund Processed"
                            subtitle="Oct 22, 2023 • Credit Note"
                            amount="+$120.00"
                            type="in"
                        />
                        <TransactionItem
                            title="Material Purchase"
                            subtitle="Oct 18, 2023 • Bulk Order"
                            amount="-$2,100.00"
                            type="out"
                        />
                        <TransactionItem
                            title="Advance Payment"
                            subtitle="Oct 15, 2023 • Project A"
                            amount="+$1,500.00"
                            type="in"
                        />
                        <TransactionItem
                            title="Consulting Fee"
                            subtitle="Oct 10, 2023 • Hourly"
                            amount="+$450.00"
                            type="in"
                        />
                    </div>
                </section>
            </main>

            {/* Floating Action Button */}
            <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-20 flex justify-center px-4">
                <Button className="pointer-events-auto h-14 w-full max-w-sm rounded-full gap-3 shadow-xl" size="lg">
                    <Plus className="h-5 w-5" />
                    Add Transaction
                </Button>
            </div>

            {/* Bottom Gradient */}
            <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-background to-transparent" />
        </div>
    )
}

function TransactionItem({
    title,
    subtitle,
    amount,
    type,
}: {
    title: string
    subtitle: string
    amount: string
    type: 'in' | 'out'
}) {
    const isIn = type === 'in'

    return (
        <Card className="flex flex-row items-center p-3">
            <div
                className={`mr-4 flex h-12 w-12 items-center justify-center rounded-full ${isIn
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-rose-100 text-rose-600'
                    }`}
            >
                {isIn ? <ArrowDown className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
            </div>

            <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-bold">{title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
            </div>

            <div className="shrink-0 text-right">
                <p
                    className={`text-base font-bold ${isIn ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                >
                    {amount}
                </p>
            </div>
        </Card>
    )
}
