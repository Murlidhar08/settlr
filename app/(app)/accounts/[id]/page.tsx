import { getAccountDetails } from "@/actions/account.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ArrowLeft, ArrowDownLeft, ArrowUpRight } from "lucide-react";
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
            <div className="flex items-center gap-4">
                <Link href="/accounts">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{account.name}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Badge variant="outline">{account.type}</Badge>
                        <span className="text-sm">Created {format(new Date(account.createdAt), "PPP")}</span>
                    </div>
                </div>
                <div className="ml-auto text-right">
                    <div className="text-sm text-muted-foreground">Current Balance</div>
                    <div className={cn("text-4xl font-mono font-bold", balance < 0 ? "text-red-500" : "text-green-500")}>
                        {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1 md:col-span-3">
                    <CardHeader>
                        <CardTitle>Transaction Ledger</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <div className="grid grid-cols-[120px_1fr_120px_120px] bg-muted/50 p-3 font-medium text-sm">
                                <div>Date</div>
                                <div>Particulars</div>
                                <div className="text-right text-green-600">Credit (In)</div>
                                <div className="text-right text-red-600">Debit (Out)</div>
                            </div>
                            {transactions.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">No transactions found.</div>
                            ) : (
                                transactions.map((tx: any) => (
                                    <div key={tx.id} className="grid grid-cols-[120px_1fr_120px_120px] p-3 text-sm border-t hover:bg-muted/30 items-center">
                                        <div className="text-muted-foreground">{format(new Date(tx.date), "dd MMM yyyy")}</div>
                                        <div>
                                            <div className="font-medium">{tx.otherAccountName}</div>
                                            {tx.description && <div className="text-xs text-muted-foreground">{tx.description}</div>}
                                        </div>
                                        <div className="text-right tabular-nums font-mono text-green-600">
                                            {tx.type === 'IN' ? tx.amount.toLocaleString() : "-"}
                                        </div>
                                        <div className="text-right tabular-nums font-mono text-red-600">
                                            {tx.type === 'OUT' ? tx.amount.toLocaleString() : "-"}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
