import { ArrowLeft, Search, Phone, Share2, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import TransactionItem from './components/TransactionItem'
import AddTransactionModal from './components/AddTransactionModal'
import { prisma } from '@/lib/prisma'
import { TransactionDirection } from '@/lib/generated/prisma/client'
import { TransactionData } from '../../../../types/transaction/TransactionData'

export default async function PartyDetailsPage({ params }: { params: Promise<{ partyId: number }> }) {
    const partyId = (await params).partyId;

    const rawPartyDetails = await prisma.party.findFirst({
        select: {
            id: true,
            name: true,
            type: true,
            transactions: {
                where: { businessId: 1 }
            }
        },
        where: { id: Number(partyId) }
    });

    let partyDetails = null;
    if (rawPartyDetails) {
        partyDetails = {
            ...rawPartyDetails,
            transactions: rawPartyDetails.transactions?.map(tra => ({
                ...tra,
                amount: tra.amount.toNumber(),
            })) ?? []
        };
    }

    // const transactionList = await prisma.transaction.findMany({
    //     where: {
    //         partyId: Number(partyId),
    //         businessId: 1,
    //     },
    //     orderBy: {
    //         createdAt: "desc",
    //     },
    // });

    let totalIn = 0,
        totalOut = 0;

    partyDetails?.transactions?.forEach((tra: TransactionData) => {
        if (tra.direction == TransactionDirection.IN)
            totalIn += Number(tra.amount);
        else if (tra.direction == TransactionDirection.OUT) {
            totalOut += Number(tra.amount);
        }
    })


    return (
        <div className="relative mx-auto min-h-screen max-w-full bg-background pb-28 lg:pb-16">
            <div className="mx-auto w-full max-w-4xl lg:px-6">

                {/* Top App Bar */}
                <header className="sticky top-0 z-20 flex items-center justify-between bg-secondary/90 backdrop-blur px-4 py-3 border-b lg:border-none">
                    <Button size="icon" variant="ghost" className="hover:scale-110 transition-transform">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <div className="flex flex-1 flex-col items-center">
                        <h2 className="text-lg font-bold tracking-tight lg:text-2xl">
                            {partyDetails?.id} - {partyDetails?.name}
                        </h2>
                        <Badge
                            variant="secondary"
                            className="mt-0.5 text-[10px] uppercase tracking-wider lg:text-xs"
                        >
                            {partyDetails?.type}
                        </Badge>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto pb-24 lg:py-8">
                    {/* Balance Card */}
                    <section className="px-4 py-2 lg:px-0">
                        <div>
                            <Card className="relative rounded-2xl p-6 lg:p-8 lg:grid lg:grid-cols-3 lg:gap-8">
                                <div className="absolute left-0 top-0 h-full w-1.5 bg-primary rounded-l-2xl" />

                                <div className="flex flex-col gap-4 lg:col-span-2">
                                    <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                                        Net Balance to Pay
                                    </p>
                                    <h1 className="mt-1 text-4xl font-bold lg:text-5xl">${totalIn - totalOut}</h1>

                                    <Separator className="lg:hidden" />

                                    <div className="flex gap-6 pt-2">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground">Total In</span>
                                            <span className="font-semibold text-emerald-600">+${totalIn}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground">Total Out</span>
                                            <span className="font-semibold text-rose-500">-${totalOut}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section className="px-4 py-4 lg:px-0 lg:py-6">
                        <div className="grid grid-cols-2 gap-3 lg:flex lg:gap-6">
                            <Button variant="outline" className="h-12 rounded-full gap-2 lg:h-14 hover:scale-[1.02] transition">
                                <Share2 className="h-4 w-4" />
                                Statement
                            </Button>
                            <Button variant="outline" className="h-12 rounded-full gap-2 lg:h-14 hover:scale-[1.02] transition">
                                <Phone className="h-4 w-4" />
                                Call Party
                            </Button>
                        </div>
                    </section>

                    {/* Search */}
                    <section className="sticky top-16 z-10 bg-background px-4 py-4 lg:static lg:px-0">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search transactions..."
                                className="h-11 rounded-full pl-11 lg:h-12 lg:text-base"
                            />
                        </div>
                    </section>

                    {/* Transactions */}
                    <section className="px-4 pb-4 p-1 lg:px-0">
                        <h3 className="mb-3 text-sm font-bold lg:text-base">Recent Transactions</h3>

                        <div className="flex flex-col gap-3">
                            {/* Transaction List */}
                            {
                                partyDetails?.transactions?.map((transaction: TransactionData) => {
                                    return (
                                        <AddTransactionModal
                                            key={transaction.id}
                                            title="Add Transaction"
                                            partyId={partyId}
                                            transactionData={transaction}
                                        >
                                            <TransactionItem
                                                title={transaction.description ?? ""}
                                                subtitle={transaction.date.toString()}
                                                amount={String(transaction.amount)}
                                                type={transaction.direction}
                                            />
                                        </AddTransactionModal>
                                    )
                                })
                            }

                            {/* <TransactionItem
                                title="Invoice #1023"
                                subtitle="Oct 24, 2023 • Payment Sent"
                                amount="-$500.00"
                                type={TransactionDirection.IN}
                            />
                            <TransactionItem
                                title="Refund Processed"
                                subtitle="Oct 22, 2023 • Credit Note"
                                amount="+$120.00"
                                type={TransactionDirection.IN}
                            />
                            <TransactionItem
                                title="Material Purchase"
                                subtitle="Oct 18, 2023 • Bulk Order"
                                amount="-$2,100.00"
                                type={TransactionDirection.OUT}
                            />
                            <TransactionItem
                                title="Advance Payment"
                                subtitle="Oct 15, 2023 • Project A"
                                amount="+$1,500.00"
                                type={TransactionDirection.IN}
                            />
                            <TransactionItem
                                title="Consulting Fee"
                                subtitle="Oct 10, 2023 • Hourly"
                                amount="+$450.00"
                                type={TransactionDirection.OUT}
                            /> */}
                        </div>
                    </section>
                </main>
            </div>

            {/* Bottom Gradient */}
            <footer className='fixed bottom-0 w-full'>
                <div className="flex flex-row w-full justify-center mx-auto">
                    <AddTransactionModal title="Add Transaction" partyId={partyId}>
                        <Button className="pointer-events-auto h-14 w-full max-w-sm rounded-md gap-3 shadow-xl hover:scale-[1.03] transition-transform bg-rose-800" size="lg">
                            <Plus className="h-5 w-5" />
                            YOU GAVE
                        </Button>
                    </AddTransactionModal>

                    <AddTransactionModal title="Add Transaction" partyId={partyId}>
                        <Button className="pointer-events-auto h-14 w-full max-w-sm rounded-md gap-3 shadow-xl hover:scale-[1.03] transition-transform bg-green-900" size="lg">
                            <Plus className="h-5 w-5" />
                            YOU GOT
                        </Button>
                    </AddTransactionModal>
                </div>

                {/* <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-linear-to-t from-background to-transparent" /> */}
            </footer>
        </div>
    )
}