import { Suspense } from "react";
import { isToday, isYesterday, format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, Lock, ArrowUpRight, ArrowDownLeft } from "lucide-react";

// Components
import { Card } from "@/components/ui/card";
import { BackHeader } from "@/components/back-header";
import StatementFilters from "./components/statement-filters";
import ExportPDFButton from "./components/export-pdf-button";
import StatementSkeleton from "./components/statement-skeleton";

// Lib
import { getPartyStatement } from "@/actions/transaction.actions";
import { TransactionDirection } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utility/party";
import { formatAmount } from "@/utility/transaction";
import { getUserConfig } from "@/lib/user-config";
import * as motion from "framer-motion/client";
import { FooterButtons } from "@/components/footer-buttons";

interface PageProps {
  params: Promise<{ partyId: string }>;
  searchParams: Promise<{
    mode?: string;
    direction?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const partyId = (await params).partyId;
  const filters = await searchParams;

  return (
    <Suspense fallback={<StatementSkeleton />}>
      <StatementContent partyId={partyId} filters={filters} />
    </Suspense>
  );
}

async function StatementContent({ partyId, filters }: { partyId: string, filters: any }) {
  const { currency } = await getUserConfig();
  const { party, transactions } = await getPartyStatement(partyId, filters);

  if (!party) return <div>Party not found</div>;

  const totalIn = transactions
    .filter(t => t.direction === TransactionDirection.IN)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = transactions
    .filter(t => t.direction === TransactionDirection.OUT)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIn - totalOut;

  const grouped = groupTransactions(transactions);

  return (
    <div className="min-h-screen bg-background pb-40">
      <BackHeader title="Public Statement" />

      <div className="mx-auto mt-6 max-w-4xl space-y-8 px-6">
        {/* Profile Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center px-6 pb-2 pt-4 text-center"
        >
          <div className="relative mb-4 group cursor-pointer">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Avatar className="h-28 w-28 shadow-xl ring-4 ring-background">
                <AvatarImage src={party.profileUrl ?? undefined} alt={party.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary text-4xl font-black uppercase text-primary-foreground">
                  {getInitials(party.name)}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="absolute bottom-1 right-1 rounded-full border-4 border-background bg-primary p-2 text-primary-foreground shadow-lg">
              <BadgeCheck size={18} />
            </div>
          </div>

          <h2 className="text-3xl font-black tracking-tight">{party.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Verified Public Statement
          </p>
        </motion.section>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <StatementFilters />
        </motion.div>

        {/* Transactions List */}
        <section className="space-y-8">
          {transactions.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center text-2xl">🌵</div>
              <p className="text-muted-foreground font-medium">No transactions found for the selected filters.</p>
            </div>
          ) : (
            Object.entries(grouped).map(([label, items], groupIndex) =>
              items.length ? (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * groupIndex }}
                >
                  <h4 className="px-2 mb-3 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">{label}</h4>
                  <div className="space-y-3">
                    {items.map((tx: any, i: number) => (
                      <TransactionCard
                        key={tx.id}
                        tx={tx}
                        currency={currency}
                        index={i}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : null
            )
          )}
        </section>
      </div>

      {/* Actions Bar */}
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-6 grid grid-cols-2 gap-4 h-24">
          <Metric
            label="Total Cash In"
            value={formatAmount(totalIn, currency, false, TransactionDirection.IN)}
            positive
          />
          <Metric
            label="Total Cash Out"
            value={formatAmount(totalOut, currency, false, TransactionDirection.OUT)}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
              NET BALANCE
            </p>
            <p className={cn(
              "text-3xl font-black tracking-tighter tabular-nums",
              balance >= 0 ? "text-emerald-600" : "text-rose-600"
            )}>
              {formatAmount(balance, currency, true)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-center border-t border-muted pt-4">
          <p className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest">
            <Lock size={10} /> Secure Encryption • Settlr Cloud
          </p>
        </div>
      </div>

      <FooterButtons>
        <ExportPDFButton
          party={party}
          transactions={transactions}
          totalIn={totalIn}
          totalOut={totalOut}
          balance={balance}
          currency={currency}
        />
      </FooterButtons>
    </div>
  );
}

function TransactionCard({ tx, currency, index }: { tx: any, currency: any, index: number }) {
  const isReceived = tx.direction === TransactionDirection.IN;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
    >
      <Card className="flex flex-row items-center justify-between p-4 bg-card/50 backdrop-blur-sm border-muted shadow-sm hover:shadow-md transition-all cursor-default">
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl transition-all",
            isReceived ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30" : "bg-rose-100 text-rose-600 dark:bg-rose-900/30"
          )}>
            {isReceived ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
          </div>
          <div>
            <p className="font-bold text-foreground">
              {tx.description || (isReceived ? "Payment Received" : "Payment Sent")}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground border">
                {tx.mode}
              </span>
              <span className="text-xs text-muted-foreground/80 font-medium">
                {format(tx.date, "dd MMM")} • {format(tx.date, "hh:mm a")}
              </span>
            </div>
          </div>
        </div>
        <p className={cn(
          "text-lg font-black tabular-nums tracking-tight",
          isReceived ? "text-emerald-600" : "text-rose-600"
        )}>
          {formatAmount(tx.amount, currency)}
        </p>
      </Card>
    </motion.div>
  );
}

function Metric({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <Card className={cn(
      "relative overflow-hidden rounded-2xl p-4 flex flex-col justify-center border-l-4 h-full shadow-sm hover:shadow-md transition-all",
      positive ? "border-emerald-500 bg-emerald-50/30" : "border-rose-500 bg-rose-50/30"
    )}>
      <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80 mb-1">
        {label}
      </span>
      <p className={cn(
        "text-xl font-black tracking-tight tabular-nums",
        positive ? "text-emerald-600" : "text-rose-600"
      )}>
        {value}
      </p>
    </Card>
  );
}

function groupTransactions(transactions: any[]) {
  const groups: Record<string, any[]> = {};

  transactions.forEach(tx => {
    let label = "";
    if (isToday(tx.date)) label = "Today";
    else if (isYesterday(tx.date)) label = "Yesterday";
    else label = format(tx.date, "dd MMM, yyyy");

    if (!groups[label]) groups[label] = [];
    groups[label].push(tx);
  });

  return groups;
}


