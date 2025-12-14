"use client"
import { useState } from "react";
import {
    Wallet,
    PiggyBank,
    MoveUpRight,
    MoveDownLeft,
    ArrowUpRight,
    Plus,
    Home,
    PieChart,
    Settings,
    Building2,
    Printer,
    User,
    Zap
} from "lucide-react";


import { AddTransactionSheet } from "./AddTransactionSheet";
import { Sheet } from "@/components/ui/sheet";

/* ========================================================= */
/* PAGE */
/* ========================================================= */

export default function Page() {
    const [isAddTranOpen, setIsAddTranOpen] = useState(false);

    // ---------------
    // Add Transaction
    const handlerAddTransaction = () => {
        setIsAddTranOpen(true);
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            <div className="mx-auto flex min-h-screen max-w-full sm:max-w-160 md:max-w-225 lg:max-w-300">

                {/* Sidebar (Desktop) */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex flex-1 flex-col">

                    {/* Header */}
                    <header className="sticky top-0 z-20 flex items-center justify-between bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2C3E50] text-white transition-transform hover:scale-105">
                                <Wallet className="h-5 w-5" />
                            </div>
                            <h1 className="text-2xl font-bold">Settlr</h1>
                        </div>

                        {/* Desktop Add Button */}
                        <button onClick={handlerAddTransaction} className="hidden lg:flex items-center gap-2 rounded-xl bg-[#2C3E50] px-4 py-2 text-white transition-all hover:scale-105 active:scale-95">
                            <Plus className="h-5 w-5" />
                            Add Transaction
                        </button>
                    </header>

                    {/* Summary Cards */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 pt-4">

                        {/* Net Cash */}
                        <div className="relative overflow-hidden rounded-3xl bg-[#2C3E50] p-6 text-white shadow-lg transition-transform hover:-translate-y-1">
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
                        </div>

                        {/* Receivables */}
                        <StatCard
                            title="Total Receivables"
                            amount="$4,200.00"
                            subtitle="Customers owe you"
                            icon={<MoveDownLeft />}
                            positive
                        />

                        {/* Payables */}
                        <StatCard
                            title="Total Payables"
                            amount="$1,150.00"
                            subtitle="You owe suppliers"
                            icon={<ArrowUpRight />}
                        />
                    </section>

                    {/* Transactions */}
                    <section className="flex-1 pt-6 px-4 md:px-6">
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
                            />
                        </div>

                        <div className="h-28" />
                    </section>
                </main>

                {/* Mobile FAB */}
                <button onClick={handlerAddTransaction} className="fixed bottom-24 right-6 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-[#2C3E50] text-white shadow-xl transition-all hover:scale-110 active:scale-95 lg:hidden">
                    <Plus className="h-7 w-7" />
                </button>

                {/* Bottom Navigation */}
                <BottomNav />

                {/* Drawer */}
                <Sheet open={isAddTranOpen} onOpenChange={setIsAddTranOpen}>
                    <AddTransactionSheet />
                </Sheet>
            </div>
        </div>
    );
}

/* ========================================================= */
/* COMPONENTS */
/* ========================================================= */

function Sidebar() {
    return (
        <aside className="hidden lg:flex lg:w-64 lg:flex-col border-r bg-white dark:bg-slate-900">
            <div className="px-6 py-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#2C3E50] text-white flex items-center justify-center">
                    <Wallet className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold">Settlr</span>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                <SideNavItem icon={<Home />} label="Dashboard" active />
                <SideNavItem icon={<PieChart />} label="Reports" />
                <SideNavItem icon={<Settings />} label="Settings" />
            </nav>
        </aside>
    );
}

function SideNavItem({ icon, label, active }: any) {
    return (
        <button
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium transition
            ${active
                    ? "bg-slate-100 text-[#2C3E50] dark:bg-slate-800"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
        >
            {icon}
            {label}
        </button>
    );
}

function BottomNav() {
    return (
        <nav className="fixed bottom-0 w-full max-w-full sm:max-w-160 md:max-w-225 border-t bg-white dark:bg-slate-900 pb-safe lg:hidden">
            <div className="flex h-20 items-center justify-around">
                <NavItem icon={<Home />} label="Home" active />
                <NavItem icon={<PieChart />} label="Reports" />
                <NavItem icon={<Settings />} label="Settings" />
            </div>
        </nav>
    );
}

function NavItem({ icon, label, active }: any) {
    return (
        <button
            className={`flex flex-col items-center gap-1 transition-transform active:scale-90
            ${active ? "text-[#2C3E50]" : "text-slate-400"}`}
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
}

function StatCard({ title, amount, subtitle, icon, positive }: any) {
    return (
        <div className={`flex items-center justify-between rounded-2xl border p-5 shadow-sm transition-transform hover:-translate-y-1
            ${positive
                ? "bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/30"
                : "bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-900/30"
            }`}>
            <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xl font-bold">{amount}</p>
                <p className="text-xs opacity-70">{subtitle}</p>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-white/80 dark:bg-black/20">
                {icon}
            </div>
        </div>
    );
}

function TransactionItem({ icon, title, meta, amount, positive }: any) {
    return (
        <div className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl
                    ${positive
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
                        : "bg-rose-50 text-rose-500 dark:bg-rose-900/20"
                    }`}>
                    {icon}
                </div>
                <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-xs text-slate-500">{meta}</p>
                </div>
            </div>
            <p className={`font-bold ${positive ? "text-emerald-600" : "text-rose-500"}`}>
                {amount}
            </p>
        </div>
    );
}
