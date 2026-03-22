"use client"

// Packages
import { format } from "date-fns"
import { motion } from "framer-motion"
import { ArrowDownLeft, ArrowUpRight, CalendarIcon, CheckCircle2, ChevronDownIcon, Clock, Loader2, Paperclip, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"
import { toast } from "sonner"

// Components
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"

// Actions
import { addTransaction } from "@/actions/transaction.actions"

// Library
import { FinancialAccount } from "@/lib/generated/prisma/client"
import { CategoryType, FinancialAccountType } from "@/lib/generated/prisma/enums"
import { cn } from "@/lib/utils"

// Types
import { getFinancialAccounts } from "@/actions/financial-account.actions"
import { ModalMode } from "@/types/transaction/ModalMode"
import { TransactionDirection } from "@/types/transaction/TransactionDirection"
interface TransactionProps {
  title: string
  children: ReactNode
  partyId?: string | null
  accountId?: string | null
  transactionData?: any
  direction?: TransactionDirection
  path?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const AddTransactionModal = ({
  title,
  partyId,
  accountId,
  transactionData,
  direction,
  path,
  children,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: TransactionProps) => {
  const router = useRouter()
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = (val: boolean) => {
    if (setControlledOpen) {
      setControlledOpen(val)
    } else {
      setInternalOpen(val)
    }
  }

  const [dateOpen, setDateOpen] = useState(false)
  const [allAccounts, setAllAccounts] = useState<(FinancialAccount & { balance: number })[]>([])
  const [loadingAccounts, setLoadingAccounts] = useState(false)
  const [currentDirection, setCurrentDirection] = useState<TransactionDirection>(direction || TransactionDirection.OUT)
  const isOut = currentDirection === TransactionDirection.OUT;

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
  const [mode, setMode] = useState<ModalMode>(ModalMode.CASHBOOK)

  useEffect(() => {
    let isMounted = true

    if (open) {
      const fetchAccounts = async () => {
        // Prevent redundant fetching if already loading
        setLoadingAccounts(true)
        try {
          const accs = await getFinancialAccounts()
          if (!isMounted) return

          setAllAccounts(accs as any)

          if (transactionData) {
            // Bulk update to reduce re-renders
            setData((pre: any) => ({
              ...pre,
              ...transactionData,
              amount: Number(transactionData.amount).toFixed(2),
              date: format(transactionData?.date ? new Date(transactionData.date) : new Date(), "yyyy-MM-dd"),
              time: format(transactionData?.date ? new Date(transactionData.date) : new Date(), "HH:mm"),
            }))

            const from = accs.find(a => a.id === transactionData.fromAccountId)
            if (from?.type === FinancialAccountType.MONEY) {
              setMoneyAccountId(from.id)
              setPartnerAccountId(transactionData.toAccountId)
            } else {
              setMoneyAccountId(transactionData.toAccountId)
              setPartnerAccountId(transactionData.fromAccountId)
            }
          } else {
            let inferredMode: ModalMode = ModalMode.CASHBOOK
            let initialMoneyAcc = ""
            let initialPartnerAcc = ""

            const currentAcc = accs.find(a => a.id === accountId)
            const partyAcc = partyId ? accs.find(a => a.partyId === partyId) : null

            if (partyId || (currentAcc && currentAcc.type === FinancialAccountType.PARTY)) {
              inferredMode = ModalMode.PARTY
              const partyAccount = partyAcc || currentAcc
              initialPartnerAcc = partyAccount?.id || ""
              initialMoneyAcc = accs.find(a => a.type === FinancialAccountType.MONEY)?.id || ""
            } else if (currentAcc && currentAcc.type === FinancialAccountType.MONEY) {
              inferredMode = ModalMode.ACCOUNT
              initialMoneyAcc = currentAcc.id
              initialPartnerAcc = accs.find(a => a.id !== currentAcc.id && a.partyId === null)?.id || ""
            } else {
              inferredMode = ModalMode.CASHBOOK
              const moneyAccs = accs.filter(a => a.type === FinancialAccountType.MONEY)
              initialMoneyAcc = moneyAccs[0]?.id || ""
              const targetCat = isOut ? CategoryType.EXPENSE : CategoryType.INCOME
              initialPartnerAcc = accs.find(a => a.type === FinancialAccountType.CATEGORY && a.categoryType === targetCat)?.id || ""
            }

            setMode(inferredMode)
            setMoneyAccountId(initialMoneyAcc)
            setPartnerAccountId(initialPartnerAcc)
            setData((pre: any) => ({
              ...pre,
              partyId: accs.find(a => a.id === initialPartnerAcc)?.partyId || null
            }))
          }
        } catch (err) {
          if (isMounted) toast.error("Failed to load accounts")
        } finally {
          if (isMounted) setLoadingAccounts(false)
        }
      }
      fetchAccounts()
    } else {
      // Cleanup for next open
      if (!transactionData) {
        setData({
          id: undefined,
          businessId: "",
          amount: "",
          description: "",
          date: format(new Date(), "yyyy-MM-dd"),
          time: format(new Date(), "HH:mm"),
          partyId: partyId || null,
          fromAccountId: "",
          toAccountId: "",
          userId: "",
        })
        setMoneyAccountId("")
        setPartnerAccountId("")
      }
    }

    return () => { isMounted = false }
  }, [open, partyId, accountId, transactionData?.id, currentDirection]) // Stabilized dependencies

  // Update data state whenever selections change
  useEffect(() => {
    const partnerAcc = allAccounts.find(a => a.id === partnerAccountId)

    // Direction logic
    // PARTY: OUT -> Money to Party, IN -> Party to Money
    // ACCOUNT: OUT -> Current to Other, IN -> Other to Current
    // CASHBOOK: OUT -> Money to Expense, IN -> Income to Money

    let from = ""
    let to = ""

    if (mode === ModalMode.PARTY) {
      from = isOut ? moneyAccountId : partnerAccountId
      to = isOut ? partnerAccountId : moneyAccountId
    } else if (mode === ModalMode.ACCOUNT) {
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
  }, [moneyAccountId, partnerAccountId, currentDirection, mode, allAccounts])

  const [isPending, setIsPending] = useState(false)

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

    setIsPending(true)
    try {
      await addTransaction({
        ...data,
        amount: Number(data.amount),
        date: combinedDateTime,
        description: data.description || null
      }, path)

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
      router.refresh()
    } catch (err) {
      toast.error("Failed to save transaction")
    } finally {
      setIsPending(false)
    }
  }

  // Filtering Logic
  const moneyAccounts = allAccounts.filter(a => a.type === FinancialAccountType.MONEY)
  const partnerOptions = allAccounts.filter(acc => {
    if (mode === ModalMode.PARTY)
      return false // Partner is fixed

    if (mode === ModalMode.ACCOUNT) {
      // Show list of accounts where partyId is null, except current
      return acc.partyId === null && acc.id !== (isOut ? moneyAccountId : accountId)
    }

    if (mode === ModalMode.CASHBOOK) {
      const targetCat = isOut ? CategoryType.EXPENSE : CategoryType.INCOME
      return acc.type === FinancialAccountType.CATEGORY && acc.categoryType === targetCat
    }

    return true
  })

  // Labels
  const moneyLabel = isOut ? "Pay From Account" : "Receive In Account"
  const partnerLabel = mode === ModalMode.ACCOUNT
    ? (isOut ? "Transfer To" : "Transfer From")
    : (isOut ? "Payment For (Category)" : "Source (Category)")

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
          <SheetHeader className="px-4 py-4 border-b bg-muted/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-10 w-10 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-400",
                  isOut ? "bg-rose-500 text-white shadow-rose-200" : "bg-emerald-500 text-white shadow-emerald-200"
                )}>
                  {isOut ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                </div>
                <div>
                  <SheetTitle className="text-xl font-black tracking-tight">{title || "New Entry"}</SheetTitle>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                    {mode} ENTRY
                  </p>
                </div>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Money In/Out Toggle */}
            <div className="bg-muted/50 p-1 mx-6 rounded-[20px] flex items-center shadow-inner border border-muted-foreground/5">
              <button
                onClick={() => setCurrentDirection(TransactionDirection.IN)}
                className={cn(
                  "flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-400 ease-out",
                  !isOut
                    ? "bg-background text-emerald-600 shadow-xl scale-[1.02] border border-emerald-100/50"
                    : "text-muted-foreground/40 hover:text-muted-foreground/60"
                )}
              >
                Money In
              </button>
              <button
                onClick={() => setCurrentDirection(TransactionDirection.OUT)}
                className={cn(
                  "flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-400 ease-out",
                  isOut
                    ? "bg-background text-rose-600 shadow-xl scale-[1.02] border border-rose-100/50"
                    : "text-muted-foreground/40 hover:text-muted-foreground/60"
                )}
              >
                Money Out
              </button>
            </div>

            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.04
                  }
                }
              }}
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
                    value={(() => {
                      if (!data.amount) return "";
                      const parts = data.amount.toString().split('.');
                      const integerPart = parts[0];
                      const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
                      const formattedInteger = integerPart ? parseInt(integerPart, 10).toLocaleString('en-IN') : integerPart === '0' ? '0' : '';
                      return (integerPart === "" && data.amount.startsWith('.') ? "" : formattedInteger) + decimalPart;
                    })()}
                    onChange={(e) => {
                      const val = e.target.value.replace(/,/g, '');
                      // Allow only numbers and up to two decimal points
                      if (/^\d*\.?\d{0,2}$/.test(val)) {
                        setData({ ...data, amount: val });
                      }
                    }}
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
                    <PopoverTrigger
                      render={
                        <Button
                          variant="outline"
                          className="h-14 w-full justify-between rounded-2xl border-2 px-4 text-base font-bold shadow-sm hover:border-primary/50 transition-all"
                        >
                          {format(new Date(data.date), "dd MMM yyyy")}
                          <ChevronDownIcon size={16} className="text-muted-foreground" />
                        </Button>
                      }
                    />
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

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="col-span-full space-y-6 overflow-hidden"
                >
                  {/* Money Account Selection */}
                  {mode !== ModalMode.ACCOUNT && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                        <Wallet size={12} /> {moneyLabel}
                      </Label>
                      <Select
                        value={moneyAccountId}
                        onValueChange={(val) => val && setMoneyAccountId(val)}
                      >
                        <SelectTrigger className="h-14 w-full rounded-2xl border-2 px-4 text-base font-bold shadow-sm hover:border-primary transition-all text-foreground bg-background">
                          <SelectValue placeholder="Choose Account">
                            {allAccounts.find(a => a.id === moneyAccountId)?.name}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl shadow-xl max-h-[300px]">
                          {moneyAccounts.map(acc => (
                            <SelectItem key={acc.id} value={acc.id} className="py-2 px-4 focus:bg-primary/90 rounded-xl cursor-pointer">
                              <div className="flex justify-between items-center w-full gap-4">
                                <span>{acc.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Partner Account Selection (Category/Transfer) */}
                  {mode !== ModalMode.PARTY && (
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
                            <SelectItem key={acc.id} value={acc.id} className="py-2 px-4 focus:bg-primary/90 rounded-xl cursor-pointer">
                              <div className="flex flex-col">
                                <span className="font-bold text-sm">{acc.name}</span>
                                <span className="text-[10px] text-muted-foreground/90 italic">
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
          <div className="p-2 border-t bg-background/50 backdrop-blur-md pb-[env(safe-area-inset-bottom,24px)]">
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="h-12 flex-1 rounded-2xl text-base font-bold border-2"
              >
                Discard
              </Button>
              <Button
                onClick={handleAddTransaction}
                disabled={loadingAccounts || isPending}
                className={cn(
                  "h-12 flex-2 rounded-2xl text-white text-base font-black uppercase tracking-widest gap-2 shadow-xl active:scale-[0.97] transition-all",
                  isOut
                    ? "bg-rose-600 hover:bg-rose-700 shadow-rose-200"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                )}
              >
                {isPending ? (
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
