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
import SummaryCard from "./components/summary-card";
import { Header } from "@/components/header";
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
        <SummaryCard />

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
