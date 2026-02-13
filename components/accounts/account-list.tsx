"use client";

import { useState } from "react";
import { FinancialAccount } from "@/lib/generated/prisma/client"; // Check if this type includes the extended fields
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, ChevronDown, ChevronRight, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AddAccountDialog } from "./add-account-dialog";

// Define the type with the extra fields we added in the action
type AccountWithStats = FinancialAccount & {
    balance: number;
    totalIncoming: number;
    totalOutgoing: number;
};

const GROUPS = [
    { id: "assets", title: "Cash & Bank", types: ["CASH", "BANK"] },
    { id: "party", title: "Parties", types: ["PARTY"] },
    { id: "income", title: "Income", types: ["INCOME"] },
    { id: "expense", title: "Expenses", types: ["EXPENSE"] },
    { id: "capital", title: "Capital & Drawings", types: ["CAPITAL", "DRAWINGS"] }, // DRAWINGS might be separate or sub-type
    { id: "loan", title: "Loan Accounts", types: ["LOAN"] },
    { id: "fund", title: "Funds", types: ["FUND"] },
    { id: "other", title: "Other", types: ["OTHER", "OPENING_BALANCE", "SUSPENSE"] },
];

export function AccountList({ accounts }: { accounts: AccountWithStats[] }) {
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState<Record<string, boolean>>({
        assets: true,
        party: true,
        income: true,
        expense: true,
        capital: true,
        loan: true,
        fund: true,
        other: true,
    });
    const router = useRouter();

    const toggleGroup = (id: string) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const filteredAccounts = accounts.filter((acc) => {
        return acc.name.toLowerCase().includes(search.toLowerCase());
    });

    const getAccountsForGroup = (types: string[]) => {
        return filteredAccounts.filter((acc) => types.includes(acc.type));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search accounts..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <AddAccountDialog />
            </div>

            <div className="space-y-4">
                {GROUPS.map((group) => {
                    const groupAccounts = getAccountsForGroup(group.types);
                    if (groupAccounts.length === 0) return null;

                    const totalBalance = groupAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

                    return (
                        <Card key={group.id} className="overflow-hidden border-none shadow-sm bg-background/50 backdrop-blur-sm">
                            <div
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                                onClick={() => toggleGroup(group.id)}
                            >
                                <div className="flex items-center gap-2">
                                    {expanded[group.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    <h3 className="font-semibold text-lg">{group.title}</h3>
                                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{groupAccounts.length}</Badge>
                                </div>
                                <div className="text-right">
                                    <span className={cn("font-bold font-mono", totalBalance < 0 ? "text-red-500" : "text-green-500")}>
                                        {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            {expanded[group.id] && (
                                <CardContent className="p-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 pt-0">
                                        {groupAccounts.map((account) => (
                                            <div
                                                key={account.id}
                                                className="group flex flex-col justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 hover:shadow-md transition-all cursor-pointer"
                                                onClick={() => router.push(`/accounts/${account.id}`)}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-semibold truncate pr-2">{account.name}</h4>
                                                        <p className="text-xs text-muted-foreground capitalize">{account.type.toLowerCase()}</p>
                                                    </div>
                                                    <Badge variant={account.balance >= 0 ? "default" : "destructive"} className={cn("ml-auto tabular-nums", account.balance >= 0 ? "bg-green-500 hover:bg-green-600" : "")}>
                                                        {account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <div className="bg-green-500/10 p-1 rounded-full text-green-500">
                                                            <ArrowDownLeft className="h-3 w-3" />
                                                        </div>
                                                        <span>In: {account.totalIncoming?.toLocaleString() || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 justify-end">
                                                        <span>Out: {account.totalOutgoing?.toLocaleString() || 0}</span>
                                                        <div className="bg-red-500/10 p-1 rounded-full text-red-500">
                                                            <ArrowUpRight className="h-3 w-3" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
