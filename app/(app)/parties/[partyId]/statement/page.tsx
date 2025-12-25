import { ArrowLeft, Share2, Calendar, Filter, ArrowUpRight, ArrowDownLeft, ShoppingBag, Undo2, Download, Lock, BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
// import Image from 'next/image'

export default async function Page({ params }: { params: Promise<{ partyId: string }> }) {
  const partyId = (await params).partyId;

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-white dark:bg-[#1a190b] sm:my-8 sm:h-[90vh] sm:rounded-[2.5rem] sm:shadow-2xl">

      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-white/90 px-4 pb-2 pt-6 backdrop-blur-md dark:bg-[#1a190b]/90">
        <Button size="icon" variant="ghost">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {partyId} - Public Statement
        </h1>
        <Button size="icon" variant="ghost">
          <Share2 className="h-5 w-5" />
        </Button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-32">

        {/* Profile */}
        <section className="flex flex-col items-center px-6 pb-8 pt-4 text-center">
          <div className="relative mb-4">
            <div className="h-24 w-24 rounded-full bg-slate-100 p-1 shadow-inner dark:bg-slate-800">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnxNn6l3bkd6-9XnAo_iWC0h9OKLnEs9PDSvc3zzQ8O8LZaU_rP2jzT1tEJ3oWV2-KJWwvLg5ziN-mVdUF06HcZwaybnsi5XvFmN2obmsyxJeFuJa86JO3BR3UAZmy8Ci0QgkGxkrRW92pq_qOx8WHnrq9WPhDrEGeSVd-MwAKmRe3mfWLOv_ErPkDpyEbeCeDqdSpif6IqW9FoC5n1LXWXeFZ8Pr8d6UD1ryKGYKH84JLx8Kxt5E5VXZaonHq2o51T5gKVVVKS8cv"
                alt="Business Logo"
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 rounded-full border-4 border-white bg-primary p-1.5 text-black dark:border-[#1a190b]">
              <BadgeCheck className="h-4 w-4" />
            </div>
          </div>

          <h2 className="text-2xl font-bold">Acme Supplies Ltd.</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Statement for <span className="font-semibold text-foreground">John Doe</span>
          </p>

          <Card className="mt-6 flex items-center gap-2 rounded-full px-4 py-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Aug 1 – Aug 31, 2023</span>
          </Card>
        </section>

        {/* Transactions */}
        <section className="rounded-t-[2.5rem] bg-muted/30 p-6 shadow-inner">
          <div className="mb-6 flex items-center justify-between px-2">
            <h3 className="text-xl font-bold">Transactions</h3>
            <Button variant="ghost" size="sm" className="gap-1 text-xs uppercase">
              Filter <Filter className="h-4 w-4" />
            </Button>
          </div>

          <TransactionGroup label="Today">
            <Transaction
              icon={<ArrowUpRight className="h-5 w-5 text-red-600" />}
              title="Invoice #1024 – Consulting"
              meta="09:41 AM • Due Oct 24"
              amount="-$500.00"
              negative
            />
            <Transaction
              icon={<ArrowDownLeft className="h-5 w-5 text-green-600" />}
              title="Payment Received"
              meta="11:30 AM • Bank Transfer"
              amount="+$200.00"
            />
          </TransactionGroup>

          <TransactionGroup label="Yesterday">
            <Transaction
              icon={<ShoppingBag className="h-5 w-5 text-red-600" />}
              title="Office Supplies"
              meta="Aug 14 • Credit Card"
              amount="-$125.50"
              negative
            />
            <Transaction
              icon={<Undo2 className="h-5 w-5 text-green-600" />}
              title="Refund: Defective Goods"
              meta="Aug 14 • Adjustment"
              amount="+$45.00"
            />
          </TransactionGroup>

          <div className="h-32" />
        </section>

        {/* Footer */}
        <div className="w-full rounded-t-3xl border-t bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.08)] dark:border-slate-800 dark:bg-[#1a190b]">
          <div className="p-6">
            <div className="mb-6 grid grid-cols-2 gap-4">
              <Metric label="Total In" value="+$245.00" positive />
              <Metric label="Total Out" value="-$625.50" />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                  Closing Balance
                </p>
                <p className="text-3xl font-bold">-$380.50</p>
              </div>
              <Button className="gap-2 rounded-full px-6 py-6 font-bold">
                <Download className="h-5 w-5" /> PDF
              </Button>
            </div>

            <div className="flex justify-center opacity-60">
              <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Lock className="h-3 w-3" /> Secure Public View • Powered by Settlr
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function TransactionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="px-2 py-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  )
}

function Transaction({ icon, title, meta, amount, negative }: any) {
  return (
    <Card className="flex flex-row items-center justify-between rounded-2xl p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          {icon}
        </div>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">{meta}</p>
        </div>
      </div>
      <p className={`font-bold ${negative ? 'text-red-600' : 'text-green-600'}`}>
        {amount}
      </p>
    </Card>
  )
}

function Metric({ label, value, positive }: any) {
  return (
    <Card className="rounded-2xl p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <p className={`text-lg font-bold ${positive ? 'text-green-600' : 'text-red-600'}`}>
        {value}
      </p>
    </Card>
  )
}
