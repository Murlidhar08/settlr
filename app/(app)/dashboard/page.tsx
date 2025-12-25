import {
  PiggyBank,
  MoveUpRight,
  MoveDownLeft,
  Building2,
  Printer,
  User,
  Zap,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Component
import TransactionItem from "./components/transaction-item";
import StatCard from "./components/stat-card";
import Header from "@/components/Header";
import SwitchBusiness from "./components/business-switch";

// Actions
import { switchBusiness } from "@/actions/business.actions";

/* ========================================================= */
/* PAGE */
/* ========================================================= */
export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user)
    redirect("/login");

  const businessList: any = await prisma.business?.findMany({
    select: {
      id: true,
      name: true
    },
    where: { ownerId: session?.user.id }
  });

  const selectedBusinessId = session.session.activeBusinessId || businessList?.[0]?.id;
  await switchBusiness(selectedBusinessId);

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
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" >

          {/* Net Cash */}
          < div className="relative overflow-hidden rounded-3xl bg-[#2C3E50] p-6 text-white shadow-lg transition-transform hover:-translate-y-1" >
            <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <div className="relative z-10 flex justify-between">
              <div>
                <p className="text-sm text-slate-300">Net Cash on Hand</p>
                <p className="mt-1 text-3xl font-bold">₹12,450.00</p>
              </div>
              <PiggyBank className="h-6 w-6 opacity-80" />
            </div>
            <div className="relative z-10 mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-300">
              <MoveUpRight className="h-3 w-3" /> 12% this month
            </div>
          </div >

          {/* Receivables */}
          < StatCard
            title="Total Receivables"
            amount="$4,200.00"
            subtitle="Customers owe you"
            icon={< MoveDownLeft />}
            positive
          />

          {/* Payables */}
          < StatCard
            title="Total Payables"
            amount="$1,150.00"
            subtitle="You owe suppliers"
            icon={< MoveUpRight />}
            positive={undefined}
          />
        </section>

        {/* Transactions */}
        <section className="flex-1 pt-6 md:px-6" >
          <div className="flex items-center justify-between pb-3">
            <h2 className="text-lg font-bold">Recent Transactions</h2>
            <button className="text-sm text-slate-500 hover:text-[#2C3E50] transition">
              View All
            </button>
          </div>

          <div className="space-y-3">
            <TransactionItem
              icon={<Building2 />}
              title="Acme Corp Payment"
              meta="Oct 24 • Invoice #1024"
              amount="+$1,200.00"
              positive
            />
            <TransactionItem
              icon={<Printer />}
              title="Office Supplies"
              meta="Oct 23 • Printer"
              amount="-$150.00"
              positive={undefined}
            />
            <TransactionItem
              icon={<User />}
              title="Consulting Fee"
              meta="Oct 22 • Client B"
              amount="+$500.00"
              positive
            />
            <TransactionItem
              icon={<Zap />}
              title="Electricity Bill"
              meta="Oct 20 • Utilities"
              amount="-$230.00"
              positive={undefined}
            />
            <TransactionItem
              icon={<Zap />}
              title="Electricity Bill"
              meta="Oct 20 • Utilities"
              amount="-$230.00"
              positive={undefined}
            />
            <TransactionItem
              icon={<Zap />}
              title="Electricity Bill"
              meta="Oct 20 • Utilities"
              amount="-$230.00"
              positive={undefined}
            />
            <TransactionItem
              icon={<Zap />}
              title="Electricity Bill"
              meta="Oct 20 • Utilities"
              amount="-$230.00"
              positive={undefined}
            />
            <TransactionItem
              icon={<Zap />}
              title="Electricity Bill"
              meta="Oct 20 • Utilities"
              amount="-$230.00"
              positive={undefined}
            />
            <TransactionItem
              icon={<Zap />}
              title="Electricity Bill"
              meta="Oct 20 • Utilities"
              amount="-$230.00"
              positive={undefined}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
