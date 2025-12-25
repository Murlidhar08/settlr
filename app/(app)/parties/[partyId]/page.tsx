import { Search, Phone, Share2, ArrowDown, ArrowUpRight } from 'lucide-react'
import { format } from "date-fns";
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { TransactionItem } from './components/transaction-item'
import { AddTransactionModal } from './components/add-transaction-modal'
import { prisma } from '@/lib/prisma'
import { TransactionDirection } from '@/lib/generated/prisma/client'
import { getUserSession } from '@/lib/auth'
import { BackHeader } from '@/components/back-header';
import { QuickActions } from './components/quick-action';

export default async function PartyDetailsPage({ params }: { params: Promise<{ partyId: string }> }) {
  const partyId = (await params).partyId;
  const session = await getUserSession();

  const rawPartyDetails = await prisma.party.findFirst({
    select: {
      id: true,
      name: true,
      type: true,
      transactions: {
        where: {
          businessId: session?.session.activeBusinessId || "",
          partyId: partyId,
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
        amount: tra.amount.toNumber(),
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

  const formatAmount = (amount: number) =>
    amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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
          <Card className="relative overflow-hidden rounded-2xl border bg-white m-1 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="absolute inset-y-0 left-0 w-1.5 bg-primary" />

            <div className="grid gap-6 px-5 lg:grid-cols-3 lg:gap-8 lg:px-5">
              <div className="space-y-4 lg:col-span-2">
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Net Balance to Pay
                </p>

                <h1 className="text-4xl font-bold lg:text-5xl">
                  ${formatAmount(totalIn - totalOut)}
                </h1>

                <Separator className="lg:hidden" />

                <div className="flex gap-8 pt-2">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Total In</span>
                    <span className="text-lg font-semibold text-emerald-600">
                      +${formatAmount(totalIn)}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Total Out</span>
                    <span className="text-lg font-semibold text-rose-500">
                      -${formatAmount(totalOut)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <QuickActions partyId={partyId} />

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
            {/* <h3 className="mb-3 text-sm font-bold lg:text-base">Transactions</h3> */}

            <div className="flex flex-col gap-3 px-1">
              {/* Transaction List */}
              <TransactionGroup label='TODAY'>
                {
                  partyDetails?.transactions?.map((transaction) => {
                    return (
                      <AddTransactionModal
                        key={transaction.id}
                        title="Add Transaction"
                        partyId={partyId}
                        transactionData={transaction}
                      >
                        <TransactionItem
                          title={transaction.description ?? ""}
                          subtitle={format(transaction.date, "dd, MMM, yyyy")}
                          amount={String(transaction.amount)}
                          type={transaction.direction}
                        />
                      </AddTransactionModal>
                    )
                  })
                }
              </TransactionGroup>

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
                <ArrowDown className="h-5 w-5" />
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
    <div className="flex flex-col gap-1">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  )
}
