"use client"

import { Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetFooter, SheetHeader } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect, ReactNode } from "react"
import { PaymentMode, TransactionDirection } from "@/lib/generated/prisma/enums"
import { addTransaction } from "@/actions/transaction.actions"
import { Transaction } from "@/lib/generated/prisma/client"

interface TransactionProps {
  title: string
  partyId: string
  children: ReactNode
  transactionData?: Transaction
  direction?: TransactionDirection
}

const AddTransactionModal = ({ title, partyId, transactionData, direction, children }: TransactionProps) => {
  const [popOpen, setPopOpen] = useState(false);

  const [data, setData] = useState({
    businessId: "",
    amount: "",
    date: new Date().toISOString().substring(0, 10),
    description: "",
    mode: PaymentMode.CASH,
    direction: direction,
    partyId: partyId,
    userId: "",
  });

  // Prefill when editing
  useEffect(() => {
    if (transactionData) {
      setData({
        businessId: transactionData.businessId,
        amount: transactionData.amount.toString(),
        date: transactionData.date.toISOString().substring(0, 10),
        description: transactionData.description ?? "",
        mode: transactionData.mode,
        direction: transactionData.direction,
        partyId: transactionData.partyId,
        userId: transactionData.userId,
        id: transactionData.id,
      });
    }
  }, [transactionData]);

  const handleAddTransaction = async () => {
    await addTransaction({
      ...data,
      amount: Number(data.amount),
      date: new Date(data.date)
    });

    setPopOpen(false);
    resetForm()
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setData({
      businessId: "",
      amount: "",
      date: new Date().toISOString().substring(0, 10),
      description: "",
      mode: PaymentMode.CASH,
      direction: direction,
      partyId: partyId,
      userId: "",
    });
  }

  return (
    <>
      {/* Trigger Button */}
      <div onClick={() => setPopOpen(true)} className="inline-block cursor-pointer">
        {children}
      </div>

      {/* Sheet */}
      <Sheet open={popOpen} onOpenChange={setPopOpen}>
        <SheetContent side="right" className="flex h-full w-full max-w-full flex-col p-0 sm:max-w-xl">

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
              <Button variant="outline" className="flex-1" onClick={() => setPopOpen(false)}>Cancel</Button>

              <Button className="flex-1" onClick={handleAddTransaction}>
                {data.id ? "Update" : "Add"} Transaction
              </Button>
            </div>
          </SheetFooter>

        </SheetContent>
      </Sheet>
    </>
  );
}

export { AddTransactionModal }
