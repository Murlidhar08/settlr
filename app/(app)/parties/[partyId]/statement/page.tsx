// Package
import { Filter, ArrowUpRight, ArrowDownLeft, Download, Lock, BadgeCheck } from 'lucide-react'
import { isToday, isYesterday, format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Component
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BackHeader } from '@/components/back-header';

// Lib
import { prisma } from "@/lib/prisma";
import { TransactionDirection } from '@/lib/generated/prisma/enums';
import { cn } from "@/lib/utils";
import { getInitials } from '@/utility/party';
import { formatAmount } from '@/utility/transaction';
import { getUserConfig } from '@/lib/user-config';

export default async function Page({ params }: { params: Promise<{ partyId: string }> }) {
  const partyId = (await params).partyId;
  const { currency } = await getUserConfig();

  const party = await prisma.party.findUnique({
    where: { id: partyId },
    include: {
      transactions: {
        orderBy: { date: "desc" },
      },
    },
  });

  if (!party)
    return <h1>Loading ...</h1>;

  // ----------------
  // Helper functions
  function getTitle(description: string | null, direction: TransactionDirection) {
    if (description?.trim()) return description;
    return direction === "IN" ? "Payment Received" : "Payment Sent";
  }

  function groupTransactions(transactions: any[]) {
    const groups: Record<string, any[]> = {
      Today: [],
      Yesterday: [],
      Earlier: [],
    };

    transactions.forEach(tx => {
      if (isToday(tx.date)) groups.Today.push(tx);
      else if (isYesterday(tx.date)) groups.Yesterday.push(tx);
      else groups.Earlier.push(tx);
    });

    return groups;
  }

  const grouped = groupTransactions(party.transactions);

  const totalIn = party.transactions
    .filter(t => t.direction === TransactionDirection.IN)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalOut = party.transactions
    .filter(t => t.direction === TransactionDirection.OUT)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIn - totalOut;

  return (
    <div className="min-h-screen bg-background">
      <BackHeader title="Public Statement" />

      <div className="mx-auto mt-6 max-w-4xl space-y-8 px-6">

        {/* Profile */}
        <section className="flex flex-col items-center px-6 pb-8 pt-4 text-center">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 shadow-inner">
              <AvatarImage src={party.profileUrl ?? undefined} alt={party.name} />
              <AvatarFallback
                className="bg-muted text-3xl font-bold uppercase text-muted-foreground"
              >
                {getInitials(party.name)}
              </AvatarFallback>
            </Avatar>

            <div className="absolute bottom-0 right-0 rounded-full border-4 border-background bg-primary p-1.5 text-black">
              <BadgeCheck className="h-4 w-4" />
            </div>
          </div>

          <h2 className="text-2xl font-bold">{party.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Statement for <span className="font-semibold text-foreground">Public View</span>
          </p>
        </section>

        {/* Transactions */}
        <section className="p-6">
          <div className="mb-6 flex items-center justify-between px-2">
            <h3 className="text-xl font-bold">Transactions</h3>
            <Button variant="ghost" size="sm" className="gap-1 text-xs uppercase">
              Filter <Filter className="h-4 w-4" />
            </Button>
          </div>

          {Object.entries(grouped).map(([label, items]) =>
            items.length ? (
              <TransactionGroup key={label} label={label}>
                {items.map(tx => {
                  const negative = tx.direction === "OUT";

                  return (
                    <Transaction
                      key={tx.id}
                      icon={
                        negative ? (
                          <ArrowUpRight className="h-5 w-5 text-red-600" />
                        ) : (
                          <ArrowDownLeft className="h-5 w-5 text-green-600" />
                        )
                      }
                      title={getTitle(tx.description, tx.direction)}
                      meta={`${format(tx.date, "dd MMM")} • ${tx.mode}`}
                      amount={formatAmount(tx.amount, currency)}
                      negative={negative}
                    />
                  );
                })}
              </TransactionGroup>
            ) : null
          )}
        </section>

        {/* Footer */}
        <div className="w-full border-t bg-gray-100 dark:border-slate-800 dark:bg-[#1a190b]">
          <div className="p-6">
            <div className="mb-6 grid grid-cols-2 gap-4">
              <Metric label="Total In" value={formatAmount(totalIn, currency, false, TransactionDirection.IN)} positive />
              <Metric label="Total Out" value={formatAmount(totalOut, currency, false, TransactionDirection.OUT)} />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                  Closing Balance
                </p>
                <p className={`text-3xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatAmount(balance, currency, true)}
                </p>
              </div>

              <Button className="gap-2 rounded-full px-6 py-6 font-bold">
                <Download className="h-5 w-5" /> PDF
              </Button>
            </div>

            <div className="flex justify-center opacity-60">
              <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Lock className="h-3 w-3" /> Secure Public View • Powered by Settlr
              </p>
            </div>
          </div>
        </div>

      </div>
    </div >
  );
}

function TransactionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 mb-5">
      <span className="px-2 py-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  )
}

function Transaction({ icon, title, meta, amount, negative }: any) {
  return (
    <Card className="flex flex-row items-center justify-between rounded-2xl p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          {icon}
        </div>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">{meta}</p>
        </div>
      </div>
      <p className={`font-bold ${negative ? 'text-red-600' : 'text-green-600'}`}>
        {amount}
      </p>
    </Card>
  )
}

function Metric({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-2xl p-4 transition-all",
        "hover:-translate-y-0.5 hover:shadow-md",
        positive
          ? "border-emerald-200/60 dark:border-emerald-900/40"
          : "border-rose-200/60 dark:border-rose-900/40"
      )}
    >
      {/* Accent strip */}
      <span
        className={cn(
          "absolute inset-y-0 left-0 w-1 rounded-r-full",
          positive ? "bg-emerald-500" : "bg-rose-500"
        )}
      />

      <div className="space-y-1 pl-3">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>

        <p
          className={cn(
            "text-xl font-bold tabular-nums",
            positive ? "text-emerald-600" : "text-rose-600"
          )}
        >
          {value}
        </p>
      </div>
    </Card>
  );
}

