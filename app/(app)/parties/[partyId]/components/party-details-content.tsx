"use client"

import { FooterButtons } from '@/components/footer-buttons';
import { AddTransactionModal } from '@/components/transaction/add-transaction-modal';
import { TransactionList } from '@/components/transaction/transaction-list';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PartyType, Currency, FinancialAccountType } from '@/lib/generated/prisma/enums';
import { calculateAccountStats } from '@/lib/transaction-logic';
import { cn } from "@/lib/utils";
import { usePartyDetails, usePartyTransactions } from '@/tanstacks/parties';
import { TransactionDirection } from '@/types/transaction/TransactionDirection';
import { getCurrencySymbol } from '@/utility/transaction';
import { Plus, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import BackHeaderClient from './back-header-client';
import { BalanceCard } from './balance-card';
import { PartyDetailsSkeleton } from './party-details-skeleton';
import { QuickActions } from './quick-action';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PartyDetailsContentProps {
    partyId: string;
    currency: Currency;
}

export function PartyDetailsContent({ partyId, currency }: PartyDetailsContentProps) {
    const { data: party, isLoading: partyLoading } = usePartyDetails(partyId);
    const partyType = party?.financialAccounts[0]?.partyType;
    const [period, setPeriod] = useState<'month' | 'year' | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (partyType === PartyType.EMPLOYEE) {
            setPeriod('month');
        }
    }, [partyType]);

    const { data: transactions, isLoading: transactionsLoading } = usePartyTransactions(partyId, period);

    if (partyLoading || transactionsLoading) {
        return <PartyDetailsSkeleton />;
    }

    if (!party) {
        return <div className="p-8 text-center text-muted-foreground uppercase tracking-widest font-black">Party not found</div>;
    }

    const partyAccountId = party.financialAccounts[0]?.id;
    const stats = calculateAccountStats(transactions || [], partyAccountId, FinancialAccountType.PARTY);

    const totalReceived = stats.totalIn; // Money flows FROM the party (We Received)
    const totalPaid = stats.totalOut; // Money flows TO the party (We Paid)

    const formattedTransactions = (transactions || [])
        .filter(tra =>
            tra.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tra.amount.toString().includes(searchQuery) ||
            tra.fromAccount?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tra.toAccount?.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(tra => ({
            ...tra,
            amount: Number(tra.amount)
        }));

    const partyDetails = {
        ...party,
        type: partyType,
        transactions: formattedTransactions
    };

    return (
        <div className="relative w-full bg-background">
            {/* Top App Bar */}
            <BackHeaderClient
                party={partyDetails as any}
            />

            {/* Main Content */}
            <div className="mx-auto max-w-4xl mt-2 space-y-8 px-6 pb-34">
                <main>
                    {/* Balance Card */}
                    <BalanceCard
                        totalReceived={totalReceived}
                        totalPaid={totalPaid}
                        currency={getCurrencySymbol(currency)}
                        isInactive={party.isActive === false}
                    />

                    <div className={cn(party.isActive === false && "grayscale-50 pointer-events-none opacity-80")}>
                        {/* Quick Actions */}
                        <div className='w-full mt-2'>
                            <QuickActions partyId={partyId} contact={partyDetails?.contactNo} />
                        </div>

                        {/* Search and Filter */}
                        <section className="sticky top-16 z-10 bg-background px-4 py-2 lg:static lg:px-0">
                            <div className="flex items-center gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search transactions..."
                                        className="h-11 rounded-full pl-11 lg:h-12 lg:text-base"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                {partyType === PartyType.EMPLOYEE && (
                                    <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
                                        <SelectTrigger className="w-[140px] h-11 lg:h-12 rounded-full px-5 bg-muted/30 border-none shadow-none focus:ring-0">
                                            <SelectValue placeholder="Period" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-muted/20 shadow-xl">
                                            <SelectItem value="month" className="rounded-xl">Current month</SelectItem>
                                            <SelectItem value="year" className="rounded-xl">Year</SelectItem>
                                            <SelectItem value="all" className="rounded-xl">All</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </section>

                        {/* Transactions List */}
                        <section className="px-4 pb-4 p-1 lg:px-0">
                            <TransactionList
                                partyId={partyDetails?.id}
                                accountId={partyAccountId}
                                accountType={FinancialAccountType.PARTY}
                                transactions={partyDetails?.transactions as any}
                            />
                        </section>
                    </div>
                </main>

                {/* Bottom Action Footer */}
                {party.isActive && (
                    <FooterButtons>
                        <AddTransactionModal
                            title="New Entry"
                            direction={TransactionDirection.OUT}
                            partyId={partyId}
                            accountId={partyAccountId}
                            path={`/parties/${partyId}`}
                        >
                            <Button className="h-14 w-14 md:w-auto md:px-12 rounded-full md:gap-3 font-semibold uppercase bg-primary text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 p-0 md:py-2">
                                <Plus className="size-6 sm:size-5" />
                                <span className="hidden md:block text-center font-black tracking-[0.2em] text-sm">
                                    Add Entry
                                </span>
                            </Button>
                        </AddTransactionModal>
                    </FooterButtons>
                )}
            </div>
        </div>
    );
}
