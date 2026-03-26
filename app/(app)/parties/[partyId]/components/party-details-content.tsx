"use client"

import { getPartyDetails, getPartyTransactions } from '@/actions/parties.actions';
import { FooterButtons } from '@/components/footer-buttons';
import { AddTransactionModal } from '@/components/transaction/add-transaction-modal';
import { TransactionList } from '@/components/transaction/transaction-list';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Currency, FinancialAccountType } from '@/lib/generated/prisma/enums';
import { calculateAccountStats } from '@/lib/transaction-logic';
import { TransactionDirection } from '@/types/transaction/TransactionDirection';
import { getCurrencySymbol } from '@/utility/transaction';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import BackHeaderClient from './back-header-client';
import { BalanceCard } from './balance-card';
import { QuickActions } from './quick-action';

interface PartyDetailsContentProps {
    partyId: string;
    currency: Currency;
}

export function PartyDetailsContent({ partyId, currency }: PartyDetailsContentProps) {
    const { data: party, isLoading: partyLoading } = useQuery({
        queryKey: ["party-detail", partyId],
        queryFn: () => getPartyDetails(partyId),
    });

    const { data: transactions, isLoading: transactionsLoading } = useQuery({
        queryKey: ["party-transactions", partyId],
        queryFn: () => getPartyTransactions(partyId),
    });

    if (partyLoading || transactionsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-muted-foreground animate-pulse">Loading party details...</div>
            </div>
        );
    }

    if (!party) {
        return <div>Party not found</div>;
    }

    const partyAccountId = party.financialAccounts[0]?.id;
    const stats = calculateAccountStats(transactions || [], partyAccountId, FinancialAccountType.PARTY);

    const totalReceived = stats.totalIn; // Money flows FROM the party (We Received)
    const totalPaid = stats.totalOut; // Money flows TO the party (We Paid)

    const formattedTransactions = (transactions || []).map(tra => ({
        ...tra,
        amount: Number(tra.amount)
    }));

    const partyDetails = {
        ...party,
        type: party.financialAccounts[0]?.partyType,
        transactions: formattedTransactions
    };

    return (
        <div className="relative w-full bg-background">
            {/* Top App Bar */}
            <BackHeaderClient
                party={partyDetails as any}
            />

            {/* Main Content */}
            <div className="mx-auto max-w-4xl mt-6 space-y-8 px-6">
                <main className="pb-24">
                    {/* Balance Card */}
                    <BalanceCard
                        totalReceived={totalReceived}
                        totalPaid={totalPaid}
                        currency={getCurrencySymbol(currency)}
                    />

                    {/* Quick Actions */}
                    <div className='w-full mt-4'>
                        <QuickActions partyId={partyId} contact={partyDetails?.contactNo} />
                    </div>

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

                    {/* Transactions List */}
                    <section className="px-4 pb-4 p-1 lg:px-0">
                        <TransactionList
                            partyId={partyDetails?.id}
                            accountId={partyAccountId}
                            accountType={FinancialAccountType.PARTY}
                            transactions={partyDetails?.transactions as any}
                        />
                    </section>
                </main>

                {/* Bottom Action Footer */}
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
            </div>
        </div>
    );
}
