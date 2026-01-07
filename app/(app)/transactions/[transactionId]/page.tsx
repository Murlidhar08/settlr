import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getUserSession } from "@/lib/auth"
import { TransactionDirection } from "@/lib/generated/prisma/enums"
import { format } from "date-fns"
import { Check, PenSquareIcon, Trash2 } from "lucide-react"
import { BackHeader } from "@/components/back-header"
import { FooterButtons } from "@/components/footer-buttons"
import { Button } from "@/components/ui/button"
import { AddTransactionModal } from "../../parties/[partyId]/components/add-transaction-modal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteTransaction } from "@/actions/transaction.actions"

export default async function TransactionDetailPage({ params }: { params: Promise<{ transactionId: string }> }) {
  const transactionId = (await params).transactionId;
  const session = await getUserSession()

  if (!session?.session.activeBusinessId) {
    notFound()
  }

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      businessId: session.session.activeBusinessId,
    },
    include: {
      party: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  if (!transaction) {
    notFound()
  }

  const isIn = transaction.direction === TransactionDirection.IN

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <BackHeader
        title="Transaction Details"
        backUrl={transaction?.party?.id ? `/parties/${transaction?.party?.id}` : "/cashbook"}
      />

      <div className={`mx-auto max-w-4xl pb-32 mt-6 space-y-8 px-6 rounded-3xl ${isIn
        ? "bg-emerald-50/80"
        : "bg-rose-50/80"
        }`}>
        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-52">
          <div className="px-4 pt-6 md:px-6 lg:px-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

              {/* LEFT: Status + Amount */}
              <div className="flex flex-col items-center lg:items-start">
                {/* Status */}
                <div className="mb-8 flex w-full flex-col items-center lg:items-start">
                  <div
                    className={`mb-4 flex size-20 items-center justify-center rounded-full shadow-sm ${isIn
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                      : "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                      }`}
                  >
                    <Check />
                  </div>

                  <h1 className="mb-1 text-xl font-bold md:text-2xl">
                    Transaction Successful!
                  </h1>

                  <span className="text-sm text-text-muted dark:text-gray-400">
                    Completed on{" "}
                    {format(transaction.createdAt, "dd MMM, yyyy • hh:mm:ss a")}
                  </span>
                </div>

                {/* Amount Card */}
                <div className="flex flex-col justify-center items-center rounded-3xl border border-white/50 bg-surface-light p-6 text-center shadow-soft dark:border-gray-800 dark:bg-surface-dark md:p-8">
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-text-muted">
                    Total Amount
                  </p>

                  <span
                    className={`text-4xl font-bold tracking-tight md:text-5xl ${isIn
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                      }`}
                  >
                    {isIn ? "+" : "-"}₹{transaction.amount.toFixed(2)}
                  </span>

                  <div
                    className={`mt-4 inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold ${isIn
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                      }`}
                  >
                    {isIn ? "Money Received" : "Money Sent"}
                  </div>
                </div>
              </div>

              {/* RIGHT: Details */}
              <div className="flex flex-col">
                <div className="flex w-full flex-col gap-6 rounded-[2rem] border border-white/50 bg-surface-light p-6 shadow-card dark:border-gray-800 dark:bg-surface-dark md:p-8">
                  <DetailRow label="Transaction ID">
                    <span className="font-mono font-bold">
                      #{transaction.id.slice(-9).toUpperCase()}
                    </span>
                  </DetailRow>

                  <Divider />

                  <DetailRow label="Party Name">
                    <span className="font-bold">
                      {transaction.party?.name}
                    </span>
                  </DetailRow>

                  <Divider />

                  <DetailRow label="Payment Mode">
                    <span className="font-bold">{transaction.mode}</span>
                  </DetailRow>

                  {transaction.description && (
                    <>
                      <Divider />
                      <div className="flex flex-col gap-2">
                        <span className="text-sm text-text-muted">
                          Description
                        </span>
                        <p className="rounded-xl border bg-slate-50 p-3 text-sm leading-relaxed dark:border-slate-700/50 dark:bg-slate-800/50">
                          {transaction.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </main>

        <FooterButtons>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button
                size="lg"
                variant="outline"
                className="px-12 flex-1 h-14 rounded-full gap-3 font-semibold uppercase
          text-red-600 border-red-200
          shadow-lg shadow-primary-600/30
          transition-all hover:shadow-xl hover:-translate-y-0.5
          hover:text-red-600 active:translate-y-0"
              >
                <Trash2 className="h-5 w-5" />
                Delete
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-lg font-bold">
                  Are you sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-muted-foreground">
                  Are you sure you want to delete this transaction?
                  <br />
                  <span className="font-semibold text-red-500">
                    This action cannot be reversed.
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="gap-3 sm:gap-2">
                {/* NO */}
                <AlertDialogCancel className="rounded-full h-11 px-8 bg-muted text-muted-foreground hover:bg-muted/80">
                  No
                </AlertDialogCancel>

                {/* YES */}
                <AlertDialogAction>
                  <form action={deleteTransaction.bind(
                    null,
                    transaction.id,
                    transaction.partyId || ""
                  )}>
                    <Button
                      type="submit"
                      className="rounded-full h-11 px-8 bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                    >
                      Yes, Delete
                    </Button>
                  </form>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* EDIT */}
          <AddTransactionModal
            title="Add Transaction"
            transactionData={transaction}
            direction={transaction.direction}
            partyId={transaction.partyId}
          >
            <Button
              size="lg"
              className="px-12 flex-1 h-14 rounded-full gap-3 font-semibold uppercase shadow-lg shadow-primary-600/30 transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              <PenSquareIcon className="h-5 w-5" />
              Edit
            </Button>
          </AddTransactionModal>
        </FooterButtons>
      </div>
    </div>
  )
}

/* Helpers */
function Divider() {
  return <div className="h-px w-full bg-slate-100 dark:bg-slate-700/50" />
}

function DetailRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-text-muted">{label}</span>
      {children}
    </div>
  )
}
