"use client"

import { CalendarIcon, Wallet, Paperclip, ChevronDownIcon, ArrowUpRight, ArrowDownLeft, Clock, Info, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect, ReactNode } from "react"
import { PaymentMode, TransactionDirection, FinancialAccountType } from "@/lib/generated/prisma/enums"
import { addTransaction } from "@/actions/transaction.actions"
import { getFinancialAccountsWithBalance } from "@/actions/financial-account.actions"
import { Transaction, FinancialAccount } from "@/lib/generated/prisma/client"
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
  const [allAccounts, setAllAccounts] = useState<(FinancialAccount & { balance: number })[]>([])
  const [loadingAccounts, setLoadingAccounts] = useState(false)

  const router = useRouter()
  const isOut = direction === TransactionDirection.OUT;

  const [uiSelectedAccountId, setUiSelectedAccountId] = useState<string>("")
  const [linkedAccountId, setLinkedAccountId] = useState<string>("")

  const [data, setData] = useState<any>({
    id: undefined,
    businessId: "",
    amount: "",
    date: format(transactionData?.date ? new Date(transactionData.date) : new Date(), "yyyy-MM-dd"),
    time: format(transactionData?.date ? new Date(transactionData.date) : new Date(), "HH:mm"),
    description: "",
    mode: PaymentMode.CASH,
    direction: direction || TransactionDirection.OUT,
    partyId: partyId || null,
    fromAccountId: "",
    toAccountId: "",
    userId: "",
  })

  useEffect(() => {
    if (open) {
      const fetchAccounts = async () => {
        setLoadingAccounts(true)
        try {
          const accs = await getFinancialAccountsWithBalance()
          setAllAccounts(accs as any)

          if (transactionData) {
            setData((pre: any) => ({
              ...pre,
              ...transactionData,
              amount: Number(transactionData.amount),
              date: format(transactionData?.date ? new Date(transactionData.date) : new Date(), "yyyy-MM-dd"),
              time: format(transactionData?.date ? new Date(transactionData.date) : new Date(), "HH:mm"),
            }))

            // For editing, we need to infer which one is the UI selected one (usually the MONEY one)
            const moneyAccId = isOut ? transactionData.fromAccountId : transactionData.toAccountId
            const otherAccId = isOut ? transactionData.toAccountId : transactionData.fromAccountId
            setUiSelectedAccountId(moneyAccId)
            setLinkedAccountId(otherAccId)

          } else {
            const moneyAccounts = accs.filter(a => a.type === FinancialAccountType.MONEY)
            let firstMoneyAcc = moneyAccounts[0]?.id || ""

            // Cashbook specific logic: Default to 'CASH' money account
            if (path === "/cashbook") {
              const cashAcc = moneyAccounts.find(a => a.moneyType === "CASH")
              if (cashAcc) firstMoneyAcc = cashAcc.id
            }

            const partyAcc = partyId ? accs.find(a => a.partyId === partyId)?.id || "" : ""
            const categoryAcc = !partyAcc ? accs.find(a => a.type === FinancialAccountType.CATEGORY)?.id || "" : ""
            const linked = partyAcc || categoryAcc

            setUiSelectedAccountId(firstMoneyAcc)
            setLinkedAccountId(linked)

            setData((pre: any) => ({
              ...pre,
              fromAccountId: isOut ? firstMoneyAcc : linked,
              toAccountId: isOut ? linked : firstMoneyAcc,
            }))
          }
        } catch (err) {
          toast.error("Failed to load accounts")
        } finally {
          setLoadingAccounts(false)
        }
      }
      fetchAccounts()
    }
  }, [open, partyId, transactionData, isOut])

  const handleAccountChange = (val: string | null) => {
    if (!val) return
    setUiSelectedAccountId(val)
    setData((pre: any) => ({
      ...pre,
      fromAccountId: isOut ? val : linkedAccountId,
      toAccountId: isOut ? linkedAccountId : val,
    }))
  }

  const handleAddTransaction = async () => {
    if (!data.amount || isNaN(Number(data.amount))) {
      return toast.error("Please enter a valid amount")
    }

    if (!data.fromAccountId || !data.toAccountId) {
      return toast.error("Please select a valid account")
    }

    try {
      const combinedDateTime = new Date(`${data.date}T${data.time}:00`)
      const selectedAcc = allAccounts.find(a => a.id === uiSelectedAccountId)

      const mode = selectedAcc?.moneyType === "ONLINE" ? PaymentMode.ONLINE : PaymentMode.CASH

      await addTransaction({
        ...data,
        mode,
        amount: Number(data.amount),
        date: combinedDateTime,
        description: data.description || null
      }, path)

      toast.success("Transaction recorded successfully", {
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      })

      router.refresh()
      setOpen(false)

      // Reset
      setData({
        id: undefined,
        businessId: "",
        amount: "",
        date: format(new Date(), "yyyy-MM-dd"),
        time: format(new Date(), "HH:mm"),
        description: "",
        mode: PaymentMode.CASH,
        direction: direction || TransactionDirection.OUT,
        partyId: partyId || null,
        fromAccountId: "",
        toAccountId: "",
        userId: "",
      })
      setUiSelectedAccountId("")
      setLinkedAccountId("")
    } catch (error) {
      toast.error("Failed to save transaction")
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
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
                <div className="h-1 w-24 mx-auto bg-linear-to-r from-transparent via-muted to-transparent rounded-full" />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Selection */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                    <CalendarIcon size={12} /> Date
                  </Label>
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger>
                      <Button
                        variant="outline"
                        className="h-14 w-full justify-between rounded-2xl border-2 px-4 text-base font-bold shadow-sm hover:border-primary/50 transition-all"
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

                {/* Money Account Selection - Hidden in Cashbook */}
                {path !== "/cashbook" && (
                  <motion.div variants={itemVariants} className="col-span-full space-y-2">
                    <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                      <Wallet size={12} /> {isOut ? "Pay From Account" : "Receive In Account"}
                    </Label>
                    <Select
                      value={uiSelectedAccountId}
                      onValueChange={handleAccountChange}
                    >
                      <SelectTrigger className="h-20 w-full rounded-2xl border-2 px-4 text-base font-bold shadow-sm hover:border-primary/50 transition-all text-foreground bg-background hover:text-foreground active:text-foreground">
                        <SelectValue placeholder="Choose Account">
                          {allAccounts.find(a => a.id === uiSelectedAccountId)?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl shadow-xl max-h-[400px]">
                        {allAccounts
                          .filter(acc => {
                            // Filter 1: If Pay From (OUT), hide accounts with 0 or less balance
                            if (isOut && acc.type === FinancialAccountType.MONEY && acc.balance <= 0) {
                              return false
                            }
                            return true
                          })
                          .map(acc => (
                            <SelectItem key={acc.id} value={acc.id} className="py-4 px-4 focus:bg-primary/75 hover:bg-primary rounded-xl cursor-pointer transition-colors group">
                              <div className="flex flex-col w-full gap-1">
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-bold text-sm">{acc.name}</span>
                                  <span className={cn(
                                    "font-bold text-xs tabular-nums text-muted-foreground",
                                    acc.balance > 0 ? "text-emerald-600" : acc.balance < 0 ? "text-rose-600" : ""
                                  )}>
                                    ₹{Math.abs(acc.balance).toLocaleString()}
                                  </span>
                                </div>
                                <span className="text-[10px] text-muted-foreground/60 transition-colors group-hover:text-primary/70">
                                  {acc.moneyType || acc.partyType || acc.categoryType || acc.type}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                )}
              </div>

              {/* Note */}
              <motion.div variants={itemVariants} className="space-y-2">
                <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                  <Paperclip size={12} /> Description
                </Label>
                <Textarea
                  placeholder="What is this for?"
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
                disabled={loadingAccounts}
                className={cn(
                  "h-14 flex-2 rounded-2xl text-white text-base font-black uppercase tracking-widest gap-2 shadow-xl active:scale-[0.97] transition-all",
                  isOut
                    ? "bg-rose-600 hover:bg-rose-700 shadow-rose-200"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                )}
              >
                {isOut ? "Confirm Give" : "Confirm Get"}
                {isOut ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
