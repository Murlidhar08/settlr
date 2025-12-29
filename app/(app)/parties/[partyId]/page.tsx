// Packages
import { Search, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { format, isToday, isYesterday } from "date-fns";

// Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BackHeader } from '@/components/back-header';
import { TransactionItem } from '@/components/transaction-item'
import { AddTransactionModal } from './components/add-transaction-modal'
import { QuickActions } from './components/quick-action';
import { BalanceCard } from './components/balance-card';

// Lib
import { prisma } from '@/lib/prisma'
import { getUserSession } from '@/lib/auth'
import { Transaction, TransactionDirection } from '@/lib/generated/prisma/client'

function groupTransactionsByDate(transactions: Transaction[]) {
  const groups: Record<string, Transaction[]> = {};

  for (const tx of transactions) {
    let label = "";

    if (isToday(tx.date)) {
      label = "TODAY";
    } else if (isYesterday(tx.date)) {
      label = "YESTERDAY";
    } else {
      label = format(tx.date, "dd MMM, yyyy");
    }

    if (!groups[label]) {
      groups[label] = [];
    }

    groups[label].push(tx);
  }

  return groups;
}

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
      transactions: rawPartyDetails.transactions?.map(tra => ({
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
            <div className="flex flex-col gap-4 px-1">

              {partyDetails?.transactions &&
                Object.entries(groupTransactionsByDate(partyDetails.transactions))
                  .map(([label, transactions]) => (
                    <TransactionGroup key={label} label={label}>
                      {transactions.map((transaction) => (
                        <AddTransactionModal
                          key={transaction.id}
                          title="Add Transaction"
                          partyId={partyId}
                          transactionData={transaction}
                        >
                          <TransactionItem
                            title={transaction.description || ""}
                            subtitle={format(transaction.date, "hh:mm a")}
                            amount={String(transaction.amount)}
                            type={transaction.direction}
                            mode={transaction.mode}
                          />
                        </AddTransactionModal>
                      ))}
                    </TransactionGroup>
                  ))}

            </div>
          </section>

        </main>

        {/* Bottom Action Footer */}
        <div className="fixed bottom-23 right-5 lg:bottom-3 z-50">
          <div className="pointer-events-auto mx-auto flex justify-end gap-4">
            {/* YOU GAVE */}
            <AddTransactionModal
              title="Add Transaction"
              partyId={partyId}
              direction={TransactionDirection.OUT}
            >
              <Button size="lg" className="px-12 flex-1 h-14 rounded-full gap-3 font-semibold uppercase bg-rose-600 text-white shadow-lg shadow-rose-600/30 transition-all hover:bg-rose-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
                <ArrowUpRight className="h-5 w-5" />
                You Gave
              </Button>
            </AddTransactionModal>

            {/* YOU GET */}
            <AddTransactionModal
              title="Add Transaction"
              partyId={partyId}
              direction={TransactionDirection.IN}
            >
              <Button
                size="lg"
                className="px-12 flex-1 h-14 rounded-full gap-3 font-semibold uppercase bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                <ArrowDownLeft className="h-5 w-5" />
                You Get
              </Button>
            </AddTransactionModal>
          </div>
        </div>
      </div>
    </div>
  )
}

function TransactionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  )
}
