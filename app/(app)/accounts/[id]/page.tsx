import { getAccountDetails } from "@/actions/account.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils"; // Assuming utils exists

export default async function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let accountData;
    try {
        accountData = await getAccountDetails(id);
    } catch (e) {
        notFound();
    }

    const { account, balance, totalIncoming, totalOutgoing, transactions } = accountData;

    return (
        <div className="container mx-auto p-6 space-y-8 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/accounts">
                        <Button variant="ghost" size="icon" className="group-hover:bg-accent">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{account.name}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                {account.type.replace('_', ' ')}
                            </Badge>
                            <span className="text-sm">•</span>
                            <span className="text-sm">Created {format(new Date(account.createdAt), "PPP")}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Add Action Buttons here like Edit/Delete if needed */}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-green-500/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Incoming</CardTitle>
                        <ArrowDownLeft className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-mono font-bold text-green-600">
                            {totalIncoming.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-red-500/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Outgoing</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-mono font-bold text-red-600">
                            {totalOutgoing.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>
                <Card className={cn("border-none shadow-sm", balance >= 0 ? "bg-primary/5" : "bg-destructive/5")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                        <div className={cn("h-2 w-2 rounded-full", balance >= 0 ? "bg-green-500" : "bg-red-500")} />
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-mono font-bold", balance >= 0 ? "text-primary" : "text-destructive")}>
                            {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Transaction Ledger</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border overflow-hidden">
                        <div className="grid grid-cols-[120px_1fr_120px_120px] bg-muted/50 p-4 font-semibold text-sm border-b">
                            <div>Date</div>
                            <div>Particulars</div>
                            <div className="text-right text-green-600">Credit (In)</div>
                            <div className="text-right text-red-600">Debit (Out)</div>
                        </div>
                        {transactions.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
                                <div className="p-4 bg-muted rounded-full">
                                    <Search className="h-8 w-8 opacity-20" />
                                </div>
                                <p>No transactions found for this account.</p>
                            </div>
                        ) : (
                            transactions.map((tx: any) => (
                                <div key={tx.id} className="grid grid-cols-[120px_1fr_120px_120px] p-4 text-sm border-b last:border-0 hover:bg-accent/30 transition-colors items-center">
                                    <div className="text-muted-foreground">{format(new Date(tx.date), "dd MMM yyyy")}</div>
                                    <div>
                                        <div className="font-medium">{tx.otherAccountName}</div>
                                        {tx.description && <div className="text-xs text-muted-foreground mt-0.5">{tx.description}</div>}
                                    </div>
                                    <div className="text-right tabular-nums font-mono text-green-600 font-medium">
                                        {tx.type === 'IN' ? tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "-"}
                                    </div>
                                    <div className="text-right tabular-nums font-mono text-red-600 font-medium">
                                        {tx.type === 'OUT' ? tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "-"}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
