"use client"

import { CalendarIcon, Wallet, Paperclip, ChevronDownIcon, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect, ReactNode } from "react"
import { PaymentMode, TransactionDirection } from "@/lib/generated/prisma/enums"
import { addTransaction } from "@/actions/transaction.actions"
import { Transaction } from "@/lib/generated/prisma/client"
import { format } from "date-fns"

import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


interface TransactionProps {
  title: string
  children: ReactNode
  partyId?: string | null
  transactionData?: Transaction
  direction?: TransactionDirection,
  path?: string
}

export const AddTransactionModal = ({
  title,
  partyId,
  transactionData,
  direction,
  path,
  children,
}: TransactionProps) => {
  const [open, setOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const router = useRouter()
  const isOut = direction === TransactionDirection.OUT;

  const [data, setData] = useState<any>({
    businessId: "",
    amount: "",
    date: format(transactionData?.date || new Date(), "yyyy-MM-dd"),
    description: "",
    mode: PaymentMode.CASH,
    direction,
    partyId: partyId || null,
    userId: "",
  })

  useEffect(() => {
    if (transactionData) {
      setData((pre: any) => {
        return {
          ...pre,
          amount: Number(transactionData.amount),
          date: format(transactionData?.date || new Date(), "yyyy-MM-dd"),
        }
      })
    }
  }, [transactionData])

  const handleAddTransaction = async () => {
    // validation
    if (!data.amount)
      return toast.error("Amount is required!!")

    await addTransaction({
      ...data,
      amount: Number(data.amount),
      date: new Date(data.date),
      description: data.description || null
    }, path)

    router.refresh()
    setOpen(false)

    // Clear data
    setData({
      businessId: "",
      amount: "",
      date: format(transactionData?.date || new Date(), "yyyy-MM-dd"),
      description: "",
      mode: PaymentMode.CASH,
      direction,
      partyId: partyId || null,
      userId: "",
    })
  }

  return (
    <>
      <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
        {children}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-screen! max-w-none! h-screen sm:w-full! sm:max-w-md! sm:h-full flex flex-col p-0 pb-[env(safe-area-inset-bottom)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="text-base font-semibold">{title}</h2>
          </div>

          {/* Body */}
          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6">
            {/* Amount */}
            <div className="text-center space-y-1">
              <div
                className={`flex items-center justify-center gap-1 text-4xl font-semibold ${isOut ? "text-rose-500" : "text-emerald-500"
                  }`}
              >
                <span>₹</span>
                <input
                  value={data.amount}
                  onChange={(e) => setData({ ...data, amount: e.target.value })}
                  inputMode="numeric"
                  placeholder="0.00"
                  className={`w-32 bg-transparent text-center outline-none ${isOut
                    ? "placeholder:text-rose-200"
                    : "placeholder:text-emerald-200"
                    }`}
                />
              </div>
              <p className="text-xs text-muted-foreground">ENTER AMOUNT</p>
            </div>

            {/* Date & Mode */}
            <div className="grid grid-cols-2 gap-3">
              {/* Date */}
              <div>
                <Label className="text-xs text-muted-foreground">DATE</Label>

                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger>
                    <Button
                      variant="outline"
                      className="mt-1 flex w-full justify-between px-3 text-sm font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        {data.date
                          ? data.date
                          : "Select date"}
                      </div>
                      <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={new Date(data.date)}
                      onSelect={(selectedDate) => {
                        if (!selectedDate) return

                        setData((pre: any) => {
                          return {
                            ...pre,
                            date: format(selectedDate, "yyyy-MM-dd"),
                          }
                        })

                        setDateOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Mode */}
              <div>
                <Label className="text-xs text-muted-foreground">MODE</Label>

                <Select
                  value={data.mode}
                  onValueChange={(value) => setData({ ...data, mode: value as PaymentMode })}
                >
                  <SelectTrigger className="mt-1 h-10 rounded-lg border px-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={PaymentMode.CASH}>Cash</SelectItem>
                    <SelectItem value={PaymentMode.ONLINE}>Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">NOTE</Label>
              <Textarea
                placeholder="What is this for?"
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                className="min-h-20 rounded-xl"
              />
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                ATTACHMENTS
              </Label>
              <div className="flex gap-3">
                <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl border border-dashed text-xs text-muted-foreground hover:bg-muted/40 cursor-pointer">
                  <Paperclip className="h-4 w-4 mb-1" />
                  ADD
                </div>
              </div>
            </div>
          </div>


          {/* Footer CTA */}
          <div className="sticky bottom-0 border-t bg-background p-4">
            <div className="flex gap-3">
              {/* Cancel */}
              <Button
                type="button"
                variant="outline"
                onClick={() => { setOpen(false) }}
                className="h-12 flex-1 rounded-xl text-base font-medium"
              >
                Cancel
              </Button>

              {/* Save */}
              <Button
                onClick={handleAddTransaction}
                className={`h-12 flex-1 rounded-xl text-white text-base font-semibold transition active:scale-[0.98] ${isOut
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
              >
                {isOut ? "You give" : "You get"}
                {isOut ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
              </Button>
            </div>
          </div>

        </SheetContent>
      </Sheet>
    </>
  )
}
