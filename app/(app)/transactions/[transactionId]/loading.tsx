import { Skeleton } from "@/components/ui/skeleton"
import { BackHeader } from "@/components/back-header"
import { FooterButtons } from "@/components/footer-buttons"

export default function TransactionDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <BackHeader title="Transaction Details" />

      <main className="mx-auto max-w-4xl px-4 pb-36 pt-6 md:px-6">
        <div className="space-y-10">
          {/* STATUS */}
          <section className="flex flex-col items-center text-center space-y-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-40" />
          </section>

          {/* AMOUNT CARD */}
          <section className="rounded-3xl border bg-card p-6 text-center space-y-4">
            <Skeleton className="mx-auto h-4 w-24" />
            <Skeleton className="mx-auto h-10 w-40" />
            <Skeleton className="mx-auto h-6 w-32 rounded-full" />
          </section>

          {/* DETAILS */}
          <section className="rounded-3xl border bg-card p-6 space-y-5">
            <DetailRowSkeleton />
            <Divider />

            <DetailRowSkeleton />
            <Divider />

            <DetailRowSkeleton />
            <Divider />

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          </section>
        </div>
      </main>

      {/* BOTTOM ACTIONS */}
      <FooterButtons>
        <Skeleton className="h-14 flex-1 rounded-full" />
        <Skeleton className="h-14 flex-1 rounded-full" />
      </FooterButtons>
    </div>
  )
}

/* Helpers */

function Divider() {
  return <div className="h-px w-full bg-border" />
}

function DetailRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-40" />
    </div>
  )
}
