"use client"

// Packages
import { useState, useEffect, ReactNode } from "react"
import { CalendarIcon, Wallet, Paperclip, ChevronDownIcon, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// Components
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Actions
import { addTransaction } from "@/actions/transaction.actions"
import { getFinancialAccountsWithBalance } from "@/actions/financial-account.actions"

// Library
import { FinancialAccount } from "@/lib/generated/prisma/client"
import { FinancialAccountType, CategoryType } from "@/lib/generated/prisma/enums"
import { cn } from "@/lib/utils"

// Types
import { TransactionDirection } from "@/types/transaction/TransactionDirection"

interface TransactionProps {
  title: string
  children: ReactNode
  partyId?: string | null
  accountId?: string | null
  transactionData?: any
  direction?: TransactionDirection
  path?: string
}

type ModalMode = 'PARTY' | 'CASHBOOK' | 'ACCOUNT'

export const AddTransactionModal = ({
  title,
  partyId,
  accountId,
  transactionData,
  direction,
  path,
  children,
}: TransactionProps) => {
  const [open, setOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [allAccounts, setAllAccounts] = useState<(FinancialAccount & { balance: number })[]>([])
  const [loadingAccounts, setLoadingAccounts] = useState(false)
  const [showAccountControls, setShowAccountControls] = useState(false)

  const router = useRouter()
  const isOut = direction === TransactionDirection.OUT;

  // Selected IDs
  const [moneyAccountId, setMoneyAccountId] = useState<string>("")
  const [partnerAccountId, setPartnerAccountId] = useState<string>("")

  const [data, setData] = useState<any>({
    id: undefined,
    businessId: "",
    amount: "",
    date: format(transactionData?.date ? new Date(transactionData.date) : new Date(), "yyyy-MM-dd"),
    time: format(transactionData?.date ? new Date(transactionData.date) : new Date(), "HH:mm"),
    description: "",
    partyId: partyId || null,
    fromAccountId: "",
    toAccountId: "",
    userId: "",
  })

  // Mode Detection
  const [mode, setMode] = useState<ModalMode>('CASHBOOK')

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

            // Editing logic
            const from = accs.find(a => a.id === transactionData.fromAccountId)
            const to = accs.find(a => a.id === transactionData.toAccountId)

            if (from?.type === FinancialAccountType.MONEY) {
              setMoneyAccountId(from.id)
              setPartnerAccountId(transactionData.toAccountId)
            } else {
              setMoneyAccountId(transactionData.toAccountId)
              setPartnerAccountId(transactionData.fromAccountId)
            }
          } else {
            // New Transaction Logic
            let inferredMode: ModalMode = 'CASHBOOK'
            let initialMoneyAcc = ""
            let initialPartnerAcc = ""

            const currentAcc = accs.find(a => a.id === accountId)
            const partyAcc = partyId ? accs.find(a => a.partyId === partyId) : null

            if (partyId || (currentAcc && currentAcc.type === FinancialAccountType.PARTY)) {
              inferredMode = 'PARTY'
              const partyAccount = partyAcc || currentAcc
              initialPartnerAcc = partyAccount?.id || ""
              initialMoneyAcc = accs.find(a => a.type === FinancialAccountType.MONEY)?.id || ""
            }
            else if (currentAcc && currentAcc.type === FinancialAccountType.MONEY) {
              inferredMode = 'ACCOUNT'
              initialMoneyAcc = currentAcc.id
              // Default partner is any other non-party account
              initialPartnerAcc = accs.find(a => a.id !== currentAcc.id && a.partyId === null)?.id || ""
            }
            else {
              inferredMode = 'CASHBOOK'
              const moneyAccs = accs.filter(a => a.type === FinancialAccountType.MONEY)
              initialMoneyAcc = moneyAccs[0]?.id || ""

              const targetCat = isOut ? CategoryType.EXPENSE : CategoryType.INCOME
              initialPartnerAcc = accs.find(a => a.type === FinancialAccountType.CATEGORY && a.categoryType === targetCat)?.id || ""
            }

            setMode(inferredMode)
            setMoneyAccountId(initialMoneyAcc)
            setPartnerAccountId(initialPartnerAcc)

            // Sync with data state
            setData((pre: any) => ({
              ...pre,
              partyId: accs.find(a => a.id === initialPartnerAcc)?.partyId || null
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
  }, [open, partyId, accountId, transactionData, isOut])

  // Update data state whenever selections change
  useEffect(() => {
    const partnerAcc = allAccounts.find(a => a.id === partnerAccountId)

    // Direction logic
    // PARTY: OUT -> Money to Party, IN -> Party to Money
    // ACCOUNT: OUT -> Current to Other, IN -> Other to Current
    // CASHBOOK: OUT -> Money to Expense, IN -> Income to Money

    let from = ""
    let to = ""

    if (mode === 'PARTY') {
      from = isOut ? moneyAccountId : partnerAccountId
      to = isOut ? partnerAccountId : moneyAccountId
    } else if (mode === 'ACCOUNT') {
      from = isOut ? moneyAccountId : partnerAccountId
      to = isOut ? partnerAccountId : moneyAccountId
    } else {
      // CASHBOOK
      from = isOut ? moneyAccountId : partnerAccountId
      to = isOut ? partnerAccountId : moneyAccountId
    }

    setData((pre: any) => ({
      ...pre,
      fromAccountId: from,
      toAccountId: to,
      partyId: partnerAcc?.partyId || null
    }))
  }, [moneyAccountId, partnerAccountId, isOut, mode, allAccounts])

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      return addTransaction(payload, path)
    },
    onMutate: async (newTx) => {
      // Invalidate both transactions and financial accounts since balance changes
      await queryClient.cancelQueries({ queryKey: ["transactions"] })
      await queryClient.cancelQueries({ queryKey: ["financial-accounts"] })

      const previousTransactions = queryClient.getQueryData(["transactions"])
      const previousAccounts = queryClient.getQueryData(["financial-accounts"])

      // We don't necessarily update the list optimistically for transactions 
      // because of the complex filtering, but invalidating handles it well. 
      // For "ultra fast" feel, we can try to prepend if filters match.

      return { previousTransactions, previousAccounts }
    },
    onError: (err, newTx, context) => {
      queryClient.setQueryData(["transactions"], context?.previousTransactions)
      queryClient.setQueryData(["financial-accounts"], context?.previousAccounts)
      toast.error("Failed to save transaction")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["financial-accounts"] })
    },
    onSuccess: () => {
      toast.success("Transaction recorded successfully", {
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      })
      setOpen(false)

      // Reset
      setData({
        id: undefined,
        businessId: "",
        amount: "",
        date: format(new Date(), "yyyy-MM-dd"),
        time: format(new Date(), "HH:mm"),
        description: "",
        partyId: partyId || null,
        fromAccountId: "",
        toAccountId: "",
        userId: "",
      })
      setMoneyAccountId("")
      setPartnerAccountId("")
    }
  })

  const handleAddTransaction = async () => {
    if (!data.amount || isNaN(Number(data.amount))) {
      return toast.error("Please enter a valid amount")
    }

    if (!data.fromAccountId || !data.toAccountId) {
      return toast.error("Please select both accounts")
    }

    const combinedDateTime = new Date(`${data.date}T${data.time}:00`)
    if (isNaN(combinedDateTime.getTime())) {
      return toast.error("Please enter a valid date and time")
    }

    mutation.mutate({
      ...data,
      amount: Number(data.amount),
      date: combinedDateTime,
      description: data.description || null
    })
  }

  // Filtering Logic
  const moneyAccounts = allAccounts.filter(a => a.type === FinancialAccountType.MONEY)

  const partnerOptions = allAccounts.filter(acc => {
    if (mode === 'PARTY') return false // Partner is fixed
    if (mode === 'ACCOUNT') {
      // Show list of accounts where partyId is null, except current
      return acc.partyId === null && acc.id !== (isOut ? moneyAccountId : accountId)
    }
    if (mode === 'CASHBOOK') {
      const targetCat = isOut ? CategoryType.EXPENSE : CategoryType.INCOME
      return acc.type === FinancialAccountType.CATEGORY && acc.categoryType === targetCat
    }
    return true
  })

  // Labels
  const moneyLabel = isOut ? "Pay From Account" : "Receive In Account"
  const partnerLabel = mode === 'ACCOUNT'
    ? (isOut ? "Transfer To" : "Transfer From")
    : (isOut ? "Payment For (Category)" : "Source (Category)")

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
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                  {mode} ENTRY
                </p>
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

                {/* Advanced Controls Toggle */}
                <motion.div variants={itemVariants} className="col-span-full pt-4">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-border/40" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAccountControls(!showAccountControls)}
                      className="rounded-xl px-4 py-1.5 h-auto text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-primary hover:bg-primary/5 transition-all"
                    >
                      {showAccountControls ? "Hide Account Details" : "Adjust Accounts"}
                    </Button>
                    <div className="h-px flex-1 bg-border/40" />
                  </div>
                </motion.div>

                <AnimatePresence>
                  {showAccountControls && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="col-span-full space-y-6 overflow-hidden"
                    >
                      {/* Money Account Selection */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                          <Wallet size={12} /> {moneyLabel}
                        </Label>
                        <Select
                          value={moneyAccountId}
                          onValueChange={(val) => val && setMoneyAccountId(val)}
                        >
                          <SelectTrigger className="h-14 w-full rounded-2xl border-2 px-4 text-base font-bold shadow-sm hover:border-primary/50 transition-all text-foreground bg-background">
                            <SelectValue placeholder="Choose Account">
                              {allAccounts.find(a => a.id === moneyAccountId)?.name}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl shadow-xl max-h-[300px]">
                            {moneyAccounts.map(acc => (
                              <SelectItem key={acc.id} value={acc.id} className="py-2 px-4 focus:bg-primary/10 rounded-xl cursor-pointer">
                                <div className="flex justify-between items-center w-full gap-4">
                                  <span>{acc.name}</span>
                                  <span className="text-xs font-bold tabular-nums text-muted-foreground">
                                    ₹{acc.balance.toLocaleString()}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Partner Account Selection (Category/Transfer) */}
                      {mode !== 'PARTY' && (
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                            <Wallet size={12} /> {partnerLabel}
                          </Label>
                          <Select
                            value={partnerAccountId}
                            onValueChange={(val) => val && setPartnerAccountId(val)}
                          >
                            <SelectTrigger className="h-14 w-full rounded-2xl border-2 px-4 text-base font-bold shadow-sm hover:border-primary/50 transition-all text-foreground bg-background">
                              <SelectValue placeholder="Select Category or Account">
                                {allAccounts.find(a => a.id === partnerAccountId)?.name}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl shadow-xl max-h-[300px]">
                              {partnerOptions.map(acc => (
                                <SelectItem key={acc.id} value={acc.id} className="py-2 px-4 focus:bg-primary/10 rounded-xl cursor-pointer">
                                  <div className="flex flex-col">
                                    <span className="font-bold text-sm">{acc.name}</span>
                                    <span className="text-[10px] text-muted-foreground/60 italic">
                                      {acc.partyType || acc.categoryType || acc.type}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
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
                disabled={loadingAccounts || mutation.isPending}
                className={cn(
                  "h-14 flex-2 rounded-2xl text-white text-base font-black uppercase tracking-widest gap-2 shadow-xl active:scale-[0.97] transition-all",
                  isOut
                    ? "bg-rose-600 hover:bg-rose-700 shadow-rose-200"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                )}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Recording...
                  </>
                ) : (
                  <>
                    {isOut ? "Confirm Pay" : "Confirm Receive"}
                    {isOut ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                  </>
                )}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
