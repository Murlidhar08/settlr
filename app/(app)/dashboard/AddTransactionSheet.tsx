"use client"

import { useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Minus,
    Plus,
    CheckCircle2,
    Calendar,
    UserSearch,
    ChevronDown,
    Paperclip,
    Trash2,
    ArrowRight
} from "lucide-react"

export function AddTransactionSheet() {
    const [isAddTranOpen, setIsAddTranOpen] = useState(false);
    return (
        <Sheet open={isAddTranOpen} onOpenChange={setIsAddTranOpen}>
            <SheetContent
                side="right"
                className="p-0 flex flex-col min-w-full sm:min-w-3/4 lg:min-w-1/2 max-w-none"
            >
                {/* Header */}
                <SheetHeader className="px-5 py-4 border-b flex-row items-center justify-between space-y-0">
                    <h2 className="text-lg font-bold">New Transaction</h2>
                </SheetHeader>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

                    {/* Mode Toggle */}
                    <div className="flex p-1 rounded-full bg-muted">
                        <button className="flex-1 py-2 rounded-full text-sm text-muted-foreground">
                            General
                        </button>
                        <button className="flex-1 py-2 rounded-full text-sm bg-background shadow font-bold">
                            Party
                        </button>
                    </div>

                    {/* Money In / Out */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="relative h-24 rounded-2xl border border-red-200 bg-red-50 flex flex-col items-center justify-center text-red-600">
                            <span className="text-xs font-bold uppercase">Money Out</span>
                            <Minus className="size-7 mt-1" />
                            <CheckCircle2 className="absolute top-2 right-2 size-5" />
                        </button>

                        <button className="relative h-24 rounded-2xl border border-green-200 bg-green-50 flex flex-col items-center justify-center text-green-600">
                            <span className="text-xs font-bold uppercase">Money In</span>
                            <Plus className="size-7 mt-1" />
                            <CheckCircle2 className="absolute top-2 right-2 size-5" />
                        </button>

                        {/* Not Selected */}
                        {/* <button className="h-24 rounded-2xl bg-muted flex flex-col items-center justify-center text-muted-foreground">
                        <span className="text-xs font-bold uppercase">Money In</span>
                        <Plus className="size-7 mt-1" />
                    </button> */}
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col items-center py-2">
                        <div className="flex items-baseline p-3">
                            <span className="text-4xl text-muted-foreground mr-2">₹</span>
                            <Input
                                type="number"
                                placeholder="0.00"
                                className="text-4xl text-center font-bold border-none focus-visible:ring-0"
                            />
                        </div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mt-2">
                            Enter Amount
                        </p>
                    </div>

                    {/* Party */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">
                            Party
                        </label>
                        <div className="relative">
                            <UserSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <select className="w-full rounded-2xl border bg-background py-4 pl-12 pr-10 font-medium">
                                <option>Select Customer or Supplier</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        </div>
                    </div>

                    {/* Date & Mode */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">
                                Date
                            </label>
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-3 rounded-2xl"
                            >
                                <Calendar className="size-4" />
                                Today
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">
                                Mode
                            </label>
                            <select className="w-full rounded-2xl border bg-background py-3 px-4">
                                <option>Cash</option>
                                <option>Online</option>
                                <option>Bank</option>
                            </select>
                        </div>
                    </div>

                    {/* Note */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">
                            Note
                        </label>
                        <Textarea
                            placeholder="What is this transaction for?"
                            className="rounded-2xl"
                        />
                    </div>

                    {/* Attachments */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">
                            Attachments
                        </label>
                        <div className="flex gap-3 overflow-x-auto">
                            <button className="size-20 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground">
                                <Paperclip className="size-5 mb-1" />
                                <span className="text-[10px] font-bold">ADD</span>
                            </button>

                            <div className="relative size-20 rounded-2xl overflow-hidden group">
                                <img
                                    src="https://placehold.co/150x150"
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <Trash2 className="text-white size-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Footer */}
                <div className="border-t p-4">
                    <Button className="w-full rounded-full py-6 text-lg font-bold">
                        Save Transaction
                        <ArrowRight className="ml-2 size-5" />
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
