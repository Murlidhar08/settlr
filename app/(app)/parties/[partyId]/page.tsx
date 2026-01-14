// Packages
import { Search } from 'lucide-react'

// Components
import { Input } from '@/components/ui/input'
import { BackHeader } from '@/components/back-header';
import { QuickActions } from './components/quick-action';
import { BalanceCard } from './components/balance-card';

// Lib
import { prisma } from '@/lib/prisma'
import { getUserSession } from '@/lib/auth'
import { TransactionDirection } from '@/lib/generated/prisma/client'
import { TransactionList } from '@/components/transaction/transaction-list';
import { AddTransactionFooter } from './components/add-transaction-footer';

export default async function PartyDetailsPage({ params }: { params: Promise<{ partyId: string }> }) {
  const partyId = (await params).partyId;
  const session = await getUserSession();

  const rawPartyDetails = await prisma.party.findFirst({
    select: {
      id: true,
      name: true,
      type: true,
      contactNo: true,
      transactions: {
        select: {
          id: true,
          amount: true,
          date: true,
          mode: true,
          direction: true,
          description: true,
          createdAt: true
        },
        where: {
          businessId: session?.session.activeBusinessId || "",
          partyId: partyId,
        },
        orderBy: {
          date: "desc"
        }
      }
    },
    where: { id: partyId }
  });

  let partyDetails = null;
  if (rawPartyDetails) {
    partyDetails = {
      ...rawPartyDetails,
      transactions: rawPartyDetails?.transactions?.map(tra => ({
        ...tra,
        amount: tra.amount.toNumber()
      })) ?? []
    };
  }

  let totalIn = 0,
    totalOut = 0;

  partyDetails?.transactions?.forEach((tra) => {
    if (tra.direction == TransactionDirection.IN)
      totalIn += Number(tra.amount);
    else if (tra.direction == TransactionDirection.OUT) {
      totalOut += Number(tra.amount);
    }
  })

  return (
    <div className="relative mx-auto min-h-screen max-w-full bg-background pb-28 lg:pb-16">

      {/* Top App Bar */}
      <BackHeader
        title={partyDetails?.name}
        description={partyDetails?.type}
        backUrl='/parties'
      />

      {/* Main Content */}
      <div className="mx-auto max-w-4xl pb-32 mt-6 space-y-8 px-6">
        <main className="flex-1 overflow-y-auto pb-24">
          {/* Balance Card */}
          <BalanceCard
            totalIn={totalIn}
            totalOut={totalOut}
            currency='$'
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
              transactions={partyDetails?.transactions ?? []}
            />
          </section>

        </main>

        {/* Bottom Action Footer */}
        <AddTransactionFooter partyId={partyId} />
      </div>
    </div>
  )
}
