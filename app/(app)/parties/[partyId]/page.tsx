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
import { TransactionDirection } from '@/types/transaction/TransactionDirection';
import { FinancialAccountType } from '@/lib/generated/prisma/enums';
import { calculateAccountStats } from '@/lib/transaction-logic';

export default async function PartyDetailsPage({ params }: { params: Promise<{ partyId: string }> }) {
  const partyId = (await params).partyId;
  const session = await getUserSession();
  const userConfig = await getUserConfig()

  const [party, transactions] = await Promise.all([
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
      include: {
        fromAccount: { select: { id: true, name: true, type: true } },
        toAccount: { select: { id: true, name: true, type: true } },
      },
      orderBy: [
        { date: "desc" },
        { createdAt: "desc" }
      ]
    }),
  ]);

  if (!party)
    return <div>Party not found</div>;

  const partyAccountId = (party as any).financialAccounts[0]?.id;
  const stats = calculateAccountStats(transactions, partyAccountId, FinancialAccountType.PARTY);

  const totalReceived = stats.totalIn; // Money flows FROM the party (We Received)
  const totalPaid = stats.totalOut; // Money flows TO the party (We Paid)

  const formattedTransactions = transactions.map(tra => ({
    ...tra,
    amount: tra.amount.toNumber()
  }));

  const partyDetails = {
    ...party,
    type: (party as any).financialAccounts[0]?.partyType,
    transactions: formattedTransactions
  };

  return (
    <div className="relative w-full bg-background">

      {/* Top App Bar */}
      <BackHeaderClient
        party={partyDetails}
      />

      {/* Main Content */}
      <div className="mx-auto max-w-4xl mt-6 space-y-8 px-6">
        <main className="pb-24">
          {/* Balance Card */}
          <BalanceCard
            totalReceived={totalReceived}
            totalPaid={totalPaid}
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
              accountType={FinancialAccountType.PARTY}
              transactions={partyDetails?.transactions as any}
            />
          </section>

        </main>

        {/* Bottom Action Footer */}
        <FooterButtons>
          {/* YOU PAY -> Money goes TO Party (from MONEY to PARTY) */}
          <AddTransactionModal
            title="You Pay"
            direction={TransactionDirection.OUT}
            partyId={partyId}
            accountId={partyAccountId}
            path={`/parties/${partyId}`}
          >
            <Button className="h-14 w-14 md:h-14 md:w-auto md:px-12 rounded-full md:gap-3 font-semibold uppercase bg-rose-600 text-white shadow-lg shadow-rose-600/30 transition-all hover:bg-rose-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 p-0 md:py-2">
              <ArrowUpRight className="h-6 w-6 sm:h-5 sm:w-5" />
              <span className="hidden md:inline">You Pay</span>
            </Button>
          </AddTransactionModal>

          {/* YOU RECEIVE -> Money comes FROM Party (from PARTY to MONEY) */}
          <AddTransactionModal
            title="You Receive"
            direction={TransactionDirection.IN}
            partyId={partyId}
            accountId={partyAccountId}
            path={`/parties/${partyId}`}
          >
            <Button
              className="h-14 w-14 md:h-14 md:w-auto md:px-12 rounded-full md:gap-3 font-semibold uppercase bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 p-0 md:py-2"
            >
              <ArrowDownLeft className="h-6 w-6 sm:h-5 sm:w-5" />
              <span className="hidden md:inline">You Receive</span>
            </Button>
          </AddTransactionModal>
        </FooterButtons>
      </div>
    </div>
  )
}

