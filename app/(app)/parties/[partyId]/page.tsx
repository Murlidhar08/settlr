// Packages
import { ArrowDownLeft, ArrowUpRight, Search } from 'lucide-react'

// Components
import { Input } from '@/components/ui/input'
import { QuickActions } from './components/quick-action';
import { BalanceCard } from './components/balance-card';

// Lib
import { prisma } from '@/lib/prisma'
import { getUserSession } from '@/lib/auth'
import { TransactionList } from '@/components/transaction/transaction-list';
import { FooterButtons } from '@/components/footer-buttons';
import { AddTransactionModal } from '@/components/transaction/add-transaction-modal';
import { Button } from '@/components/ui/button';
import { getUserConfig } from '@/lib/user-config';
import { getCurrencySymbol } from '@/utility/transaction';
import BackHeaderClient from './components/back-header-client';

export default async function PartyDetailsPage({ params }: { params: Promise<{ partyId: string }> }) {
  const partyId = (await params).partyId;
  const session = await getUserSession();
  const userConfig = await getUserConfig()

  const [party, transactions, stats] = await Promise.all([
    // 1. Fetch Party Details
    prisma.party.findFirst({
      where: { id: partyId },
      select: {
        id: true,
        name: true,
        contactNo: true,
        financialAccounts: {
          select: { id: true, partyType: true },
          take: 1
        }
      }
    }),
    // 2. Fetch Transactions (List)
    prisma.transaction.findMany({
      where: {
        businessId: session?.user.activeBusinessId || "",
        partyId: partyId,
      },
      orderBy: [
        { date: "desc" },
        { createdAt: "desc" }
      ]
    }),
    // 3. Fetch transactions for aggregation (since direction column is gone)
    prisma.transaction.findMany({
      where: {
        businessId: session?.user.activeBusinessId || "",
        partyId: partyId,
      },
      select: {
        amount: true,
        fromAccountId: true,
        toAccountId: true,
      }
    })
  ]);

  if (!party) return <div>Party not found</div>;

  const partyDetails = {
    ...party,
    type: (party as any).financialAccounts[0]?.partyType,
    transactions: transactions.map(tra => ({
      ...tra,
      amount: tra.amount.toNumber()
    }))
  };

  const partyAccountId = (party as any).financialAccounts[0]?.id;

  let totalIn = 0; // Money coming to the party (we owe them more)
  let totalOut = 0; // Money going from the party (they owe us more)

  stats.forEach((tra) => {
    const amount = tra.amount.toNumber();
    if (tra.toAccountId === partyAccountId) totalIn += amount;
    if (tra.fromAccountId === partyAccountId) totalOut += amount;
  });

  return (
    <div className="relative mx-auto min-h-screen max-w-full bg-background pb-28 lg:pb-16">

      {/* Top App Bar */}
      <BackHeaderClient
        party={partyDetails}
      />

      {/* Main Content */}
      <div className="mx-auto max-w-4xl pb-32 mt-6 space-y-8 px-6">
        <main className="flex-1 overflow-y-auto pb-24">
          {/* Balance Card */}
          <BalanceCard
            totalIn={totalIn}
            totalOut={totalOut}
            currency={getCurrencySymbol(userConfig.currency)}
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

          {/* Transactions */}
          <section className="px-4 pb-4 p-1 lg:px-0">
            {/* Tasaction List */}
            <TransactionList
              partyId={partyDetails?.id}
              accountId={partyAccountId}
              transactions={partyDetails?.transactions as any}
            />
          </section>

        </main>

        {/* Bottom Action Footer */}
        <FooterButtons>
          {/* YOU GAVE -> Money goes TO Party (from MONEY to PARTY) */}
          <AddTransactionModal
            title="You Gave"
            direction="OUT"
            partyId={partyId}
            accountId={partyAccountId}
            path={`/parties/${partyId}`}
          >
            <Button size="lg" className="px-12 flex-1 h-14 rounded-full gap-3 font-semibold uppercase bg-rose-600 text-white shadow-lg shadow-rose-600/30 transition-all hover:bg-rose-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
              <ArrowUpRight className="h-5 w-5" />
              You Gave
            </Button>
          </AddTransactionModal>

          {/* YOU GET -> Money comes FROM Party (from PARTY to MONEY) */}
          <AddTransactionModal
            title="You Get"
            direction="IN"
            partyId={partyId}
            accountId={partyAccountId}
            path={`/parties/${partyId}`}
          >
            <Button
              size="lg"
              className="px-12 flex-1 h-14 rounded-full gap-3 font-semibold uppercase bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              <ArrowDownLeft className="h-5 w-5" />
              You Get
            </Button>
          </AddTransactionModal>
        </FooterButtons>
      </div>
    </div>
  )
}
