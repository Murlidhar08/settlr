import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getUserSession } from "@/lib/auth"
import { TransactionDirection } from "@/lib/generated/prisma/enums"
import { format } from "date-fns"
import { Check, PenSquareIcon, Trash2 } from "lucide-react"
import { BackHeader } from "@/components/back-header"
import { FooterButtons } from "@/components/footer-buttons"
import { Button } from "@/components/ui/button"
import { AddTransactionModal } from "@/components/transaction/add-transaction-modal"
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

  if (!session?.session.activeBusinessId)
    notFound()

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      businessId: session.session.activeBusinessId,
    },
    include: {
      party: { select: { id: true, name: true } },
    },
  })

  if (!transaction)
    notFound()

  const isIn = transaction.direction === TransactionDirection.IN

  return (
    <div className="min-h-screen bg-background">
      <BackHeader title="Transaction Details" />

      <main className="mx-auto max-w-4xl px-4 pb-36 pt-6 md:px-6">
        <div className="space-y-10">
          {/* STATUS */}
          <section className="flex flex-col items-center text-center animate-in fade-in slide-in-from-top-2 duration-500">
            <div
              className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full shadow-md transition-transform animate-in zoom-in ${isIn
                ? "bg-emerald-100 text-emerald-600"
                : "bg-rose-100 text-rose-600"
                }`}
            >
              <Check className="h-8 w-8" />
            </div>

            <h1 className="text-2xl font-bold">Transaction Successful!</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Completed on{" "}
              {format(transaction.createdAt, "dd MMM yyyy • hh:mm a")}
            </p>
          </section>

          {/* AMOUNT CARD */}
          <section className="rounded-3xl border bg-card p-6 text-center shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Total Amount
            </p>

            <p
              className={`mt-2 text-4xl font-extrabold transition-transform animate-in zoom-in ${isIn
                ? "text-emerald-600"
                : "text-rose-600"
                }`}
            >
              {isIn ? "+" : "-"}₹{transaction.amount.toFixed(2)}
            </p>

            <span
              className={`mt-3 inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold ${isIn
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
                }`}
            >
              {isIn ? "Money Received" : "Money Sent"}
            </span>
          </section>

          {/* DETAILS */}
          <section className="rounded-3xl border bg-card p-6 shadow-sm space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <DetailRow label="Transaction ID">
              <span className="font-mono font-semibold">
                #{transaction.id}
              </span>
            </DetailRow>

            <Divider />

            <DetailRow label={transaction.party ? "Party Name" : "Account"}>
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {transaction.party?.name ?? "Cash"}
                </span>
                {!transaction.party && (
                  <span className="text-xs text-muted-foreground italic">
                    (Cashbook Entry)
                  </span>
                )}
              </div>
            </DetailRow>



            <Divider />

            <DetailRow label="Payment Mode">
              <span className="font-semibold">{transaction.mode}</span>
            </DetailRow>

            {transaction.description && (
              <>
                <Divider />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="rounded-xl bg-muted/50 p-3 text-sm leading-relaxed">
                    {transaction.description}
                  </p>
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      {/* BOTTOM ACTIONS */}
      <FooterButtons>
        {/* DELETE */}
        <AlertDialog>
          <AlertDialogTrigger>
            <Button
              variant="outline"
              size="lg"
              className="px-12 flex-1 h-14 rounded-full gap-3 font-semibold uppercase text-red-600 border-red-200 shadow-lg shadow-primary-600/30 transition-all hover:shadow-xl hover:-translate-y-0.5 hover:text-red-600 active:translate-y-0"
            >
              <Trash2 className="mr-2 h-5 w-5" />
              Delete
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction>
                <form
                  action={deleteTransaction.bind(
                    null,
                    transaction.id,
                    transaction.partyId || ""
                  )}
                >
                  <Button className="rounded-full bg-red-600 hover:bg-red-700">
                    Yes, delete
                  </Button>
                </form>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* EDIT */}
        <AddTransactionModal
          title="Edit Transaction"
          transactionData={transaction}
          direction={transaction.direction}
          partyId={transaction.partyId}
        >
          <Button
            size="lg"
            className="px-12 flex-1 h-14 rounded-full gap-3 font-semibold uppercase shadow-lg shadow-primary-600/30 transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            <PenSquareIcon className="mr-2 h-5 w-5" />
            Edit
          </Button>
        </AddTransactionModal>
      </FooterButtons>
    </div>
  )
}

/* Helpers */
function Divider() {
  return <div className="h-px w-full bg-border" />
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
      <span className="text-sm text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}
