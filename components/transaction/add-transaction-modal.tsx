"use client"

import { CalendarIcon, Wallet, Paperclip, ChevronDownIcon, ArrowUpRight, ArrowDownLeft, Clock, Info, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect, ReactNode } from "react"
import { PaymentMode, TransactionDirection } from "@/lib/generated/prisma/enums"
import { addTransaction } from "@/actions/transaction.actions"
import { Transaction } from "@/lib/generated/prisma/client"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

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
    id: undefined,
    businessId: "",
    amount: "",
    date: format(transactionData?.date || new Date(), "yyyy-MM-dd"),
    time: format(transactionData?.date || new Date(), "HH:mm"),
    description: "",
    mode: PaymentMode.CASH,
    direction,
    partyId: partyId || null,
    userId: "",
  })

  useEffect(() => {
    if (transactionData) {
      setData((pre: any) => ({
        ...pre,
        ...transactionData,
        amount: Number(transactionData.amount),
        date: format(transactionData?.date || new Date(), "yyyy-MM-dd"),
        time: format(transactionData?.date || new Date(), "HH:mm"),
      }))
    }
  }, [transactionData])

  const handleAddTransaction = async () => {
    if (!data.amount || isNaN(Number(data.amount))) {
      return toast.error("Please enter a valid amount")
    }

    try {
      // Combine date and time
      const combinedDateTime = new Date(`${data.date}T${data.time}:00`)

      await addTransaction({
        ...data,
        amount: Number(data.amount),
        date: combinedDateTime,
        description: data.description || null
      }, path)

      toast.success("Transaction recorded successfully", {
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      })

      router.refresh()
      setOpen(false)

      // Clear data
      setData({
        id: undefined,
        businessId: "",
        amount: "",
        date: format(new Date(), "yyyy-MM-dd"),
        time: format(new Date(), "HH:mm"),
        description: "",
        mode: PaymentMode.CASH,
        direction,
        partyId: partyId || null,
        userId: "",
      })
    } catch (error) {
      toast.error("Failed to save transaction")
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <>
      <div onClick={() => setOpen(true)} className="inline-block cursor-pointer active:scale-95 transition-transform">
        {children}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full! h-full! sm:max-w-[70vw]! lg:max-w-[35vw]! border-l-0 sm:border-l p-0 flex flex-col overflow-hidden bg-background"
        >
          <SheetHeader className="px-6 py-6 border-b bg-muted/20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className={cn(
                "h-10 w-10 rounded-2xl flex items-center justify-center shadow-lg",
                isOut ? "bg-rose-500 text-white shadow-rose-200" : "bg-emerald-500 text-white shadow-emerald-200"
              )}>
                {isOut ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
              </div>
              <div>
                <SheetTitle className="text-xl font-black tracking-tight">{title}</SheetTitle>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Recording new entry</p>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="px-6 py-8 space-y-8"
            >
              {/* Amount Input */}
              <motion.div variants={itemVariants} className="text-center space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Amount</Label>
                <div className={cn(
                  "relative flex items-center justify-center transition-all duration-300",
                  isOut ? "text-rose-600" : "text-emerald-600"
                )}>
                  <span className="text-4xl font-black mr-2 opacity-50">₹</span>
                  <input
                    value={data.amount}
                    onChange={(e) => setData({ ...data, amount: e.target.value })}
                    inputMode="decimal"
                    placeholder="0.00"
                    autoFocus
                    className={cn(
                      "w-full bg-transparent text-6xl font-black text-center outline-none selection:bg-primary/10 transition-all",
                      isOut ? "placeholder:text-rose-100" : "placeholder:text-emerald-100"
                    )}
                  />
                </div>
                <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-muted to-transparent rounded-full" />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Selection */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                    <CalendarIcon size={12} /> Date
                  </Label>
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-14 w-full justify-between rounded-2xl border-2 px-4 text-base font-bold shadow-sm hover:hover:border-primary/50 transition-all"
                      >
                        {format(new Date(data.date), "dd MMM yyyy")}
                        <ChevronDownIcon size={16} className="text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden shadow-2xl border-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(data.date)}
                        onSelect={(d) => {
                          if (d) {
                            setData({ ...data, date: format(d, "yyyy-MM-dd") })
                            setDateOpen(false)
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </motion.div>

                {/* Time Selection */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                    <Clock size={12} /> Time
                  </Label>
                  <input
                    type="time"
                    value={data.time}
                    onChange={(e) => setData({ ...data, time: e.target.value })}
                    className="h-14 w-full rounded-2xl border-2 bg-transparent px-4 text-base font-bold shadow-sm outline-none focus:border-primary transition-all"
                  />
                </motion.div>

                {/* Payment Mode */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                    <Wallet size={12} /> Mode
                  </Label>
                  <Select
                    value={data.mode}
                    onValueChange={(val) => setData({ ...data, mode: val as PaymentMode })}
                  >
                    <SelectTrigger className="h-14 rounded-2xl border-2 px-4 text-base font-bold shadow-sm hover:border-primary/50 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl shadow-xl">
                      <SelectItem value={PaymentMode.CASH}>Cash Payment</SelectItem>
                      <SelectItem value={PaymentMode.ONLINE}>Online Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Category/Tag Placeholder */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                    <Info size={12} /> Type
                  </Label>
                  <div className="h-14 flex items-center px-4 rounded-2xl border-2 border-dashed bg-muted/10 text-muted-foreground font-bold opacity-60">
                    {isOut ? "General Expense" : "Direct Income"}
                  </div>
                </motion.div>
              </div>

              {/* Note */}
              <motion.div variants={itemVariants} className="space-y-2">
                <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                  <Paperclip size={12} /> Description
                </Label>
                <Textarea
                  placeholder="Add a remark or note..."
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  className="min-h-[100px] rounded-2xl border-2 p-4 text-base font-medium transition-all focus:border-primary focus:ring-0"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t bg-background/50 backdrop-blur-md pb-[env(safe-area-inset-bottom,24px)]">
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="h-14 flex-1 rounded-2xl text-base font-bold border-2"
              >
                Discard
              </Button>
              <Button
                onClick={handleAddTransaction}
                className={cn(
                  "h-14 flex-[2] rounded-2xl text-white text-base font-black uppercase tracking-widest gap-2 shadow-xl active:scale-[0.97] transition-all",
                  isOut
                    ? "bg-rose-600 hover:bg-rose-700 shadow-rose-200"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                )}
              >
                {isOut ? "Confirm Give" : "Confirm Win"}
                {isOut ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

