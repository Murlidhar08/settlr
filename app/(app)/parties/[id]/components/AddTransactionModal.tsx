"use client"

import { Building2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Sheet, SheetContent, SheetFooter, SheetHeader } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { PaymentMode, TransactionDirection } from "@/lib/generated/prisma/enums"
import { addTransaction } from "@/actions/transaction.actions"

interface TransactionProps {
    title: string
}

export default function AddTransactionModal({ title }: TransactionProps) {

    const [popOpen, setPopOpen] = useState(false);

    const [data, setData] = useState({
        businessId: 1,
        amount: "",
        date: new Date().toISOString().substring(0, 10), // YYYY-MM-DD for date input
        description: "",
        mode: PaymentMode.CASH,
        direction: TransactionDirection.IN,
        partyId: 1,
        userId: 1,
        id: 0,
        createdAt: undefined,
        updatedAt: undefined
    });

    const handleAddTransaction = async () => {
        await addTransaction({
            ...data,
            amount: data.amount,
            date: new Date(),
        });

        setPopOpen(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target;

        setData(prev => ({
            ...prev,
            [target.name]: target.value
        }))
    }

    return (
        <>
            <Sheet open={popOpen} onOpenChange={setPopOpen}>
                <SheetContent
                    side="right"
                    className="flex h-full w-full max-w-full flex-col p-0 sm:max-w-xl"
                >
                    <SheetHeader className="sticky top-0 z-10 flex-row items-center justify-between border-b bg-background px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">{title}</h2>
                        </div>
                    </SheetHeader>

                    <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">

                        {/* Amount */}
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                name="amount"
                                placeholder="Amount"
                                value={data.amount}
                                onChange={handleChange}
                                // onChange={e => {
                                //     setData(prev => ({
                                //         ...prev,
                                //         amount: e.target.value // keep as string
                                //     }))
                                // }}
                                autoFocus
                            />
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                name="date"
                                type="date"
                                value={data.date}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                name="description"
                                placeholder="Description"
                                value={data.description}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <SheetFooter className="sticky bottom-0 border-t bg-background px-6 py-4">
                        <div className="flex w-full gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setPopOpen(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                onClick={handleAddTransaction}
                                className="flex-1"
                            >
                                Add Transaction
                            </Button>
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <Button
                onClick={() => { setPopOpen(true) }}
                className="pointer-events-auto h-14 w-full max-w-sm rounded-full gap-3 shadow-xl hover:scale-[1.03] transition-transform"
                size="lg"
            >
                <Plus className="h-5 w-5" />
                Add Transaction
            </Button>
        </>
    )
}
