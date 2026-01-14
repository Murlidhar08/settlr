import {
  Building2,
  Printer,
  User,
  Zap,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";
import { redirect } from "next/navigation";

// Component
import TransactionItem from "./components/transaction-item";
import SummaryCard from "./components/summary-card";
import { Header } from "@/components/header";
import SwitchBusiness from "./components/business-switch";

// Actions
import { switchBusiness } from "@/actions/business.actions";
import { getRecentTransactions } from "@/actions/transaction.actions";
import { format } from "date-fns";
import { formatAmount } from "@/utility/transaction";
import { TransactionDirection } from "@/lib/generated/prisma/enums";

/* ========================================================= */
/* PAGE */
/* ========================================================= */
export default async function Page() {
  const session = await getUserSession()

  if (!session?.user)
    redirect("/login");

  const businessList: any = await prisma.business?.findMany({
    select: {
      id: true,
      name: true
    },
    where: { ownerId: session?.user.id }
  });

  const recentTransactions = await getRecentTransactions();

  const selectedBusinessId = session.session?.activeBusinessId || businessList?.[0]?.id;
  await switchBusiness(selectedBusinessId);

  const getTransactionTitle = (
    description: string | null,
    direction: TransactionDirection,
    partyName?: string,
  ) => {
    if (description && description.trim().length > 0) {
      return description;
    }

    if (!partyName) {
      return "Cashbook"
    }

    return direction === TransactionDirection.IN
      ? "Payment Received"
      : "Payment Sent";
  };

  return (
    <div className="w-full">
      {/* Header */}
      <Header title="Dashboard" />

      {/* Store */}
      <div className="px-4">
        <div className="mb-4">
          <SwitchBusiness
            businesses={businessList}
            activeBusinessId={selectedBusinessId}
          />
        </div>

        {/* Summary Cards */}
        <SummaryCard />

        {/* Transactions */}
        <section className="flex-1 pt-6 md:px-6">
          <div className="flex items-center justify-between pb-3">
            <h2 className="text-lg font-bold">Recent Transactions</h2>
            <button className="text-sm text-slate-500 hover:text-[#2C3E50] transition">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentTransactions.length === 0 && (
              <p className="text-sm text-slate-500">
                No transactions yet
              </p>
            )}

            {recentTransactions.map((tx) => {
              const positive = tx.direction === "IN";

              return (
                <TransactionItem
                  key={tx.id}
                  id={tx.id}
                  icon={positive ? <Building2 /> : <Zap />}
                  title={getTransactionTitle(tx.description, tx.direction, tx.party?.name)}
                  meta={`${format(tx.date, "dd MMM")} • ${tx.mode}${tx.party?.name ? ` • ${tx.party.name}` : ""
                    }`}
                  amount={formatAmount(Number(tx.amount), tx.direction == TransactionDirection.IN)}
                  positive={positive}
                />
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
