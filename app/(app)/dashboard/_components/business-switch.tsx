"use client"

import { Building2, Check, ChevronDown, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Sheet, SheetContent, SheetFooter, SheetHeader } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addBusiness } from "@/actions/business.actions"

/* ========================================================= */
/* TYPES */
/* ========================================================= */

interface Business {
    id: string
    name: string
}

interface SwitchBusinessProps {
    businesses: Business[]
    activeBusinessId: string
}

/* ========================================================= */
/* COMPONENT */
/* ========================================================= */

export default function SwitchBusiness({ businesses }: SwitchBusinessProps) {
    const [popOpen, setPopOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [businessName, setBusinessName] = useState("");
    const [activeBusinessId, setActiveBusinessId] = useState(businesses?.[0]?.id);
    const activeBusiness = businesses.find((b) => b.id === activeBusinessId)

    const handleAddBusiness = async () => {
        await addBusiness(businessName)
        setPopOpen(false);
        setOpen(false);
    }

    const onChangeBusinessId = (businessId: string) => {
        setActiveBusinessId(businessId);
        setPopOpen(false);
    }

    return (
        <>
            <Popover open={popOpen} onOpenChange={setPopOpen}>
                <PopoverTrigger className="group flex min-w-0 items-center gap-2">
                    <span>Business -</span>
                    <span className="truncate text-xl font-semibold tracking-tight text-foreground">
                        {activeBusiness?.name ?? "Select Business"}
                    </span>

                    <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </PopoverTrigger>

                <PopoverContent
                    align="start"
                    className="w-72 rounded-2xl p-2 shadow-xl"
                >
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="space-y-1"
                        >
                            {/* Business List */}
                            {businesses.map((business) => {
                                const isActive = business.id === activeBusinessId

                                return (
                                    <button
                                        key={business.id}
                                        onClick={() => { onChangeBusinessId(business.id) }}
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "hover:bg-muted"
                                        )}
                                    >
                                        <Building2 className="h-4 w-4 shrink-0" />

                                        <span className="flex-1 truncate text-left">
                                            {business.name}
                                        </span>

                                        {isActive && (
                                            <Check className="h-4 w-4 shrink-0" />
                                        )}
                                    </button>
                                )
                            })}

                            {/* Divider */}
                            <div className="my-2 h-px bg-border" />

                            {/* Add Business */}
                            <Button
                                onClick={() => {
                                    setOpen(!open);
                                    setPopOpen(!popOpen)
                                }}
                                variant="ghost"
                                className="w-full justify-start gap-2 rounded-xl text-sm"
                            >
                                <Plus className="h-4 w-4" />
                                Add Business
                            </Button>
                        </motion.div>
                    </AnimatePresence>
                </PopoverContent>
            </Popover >

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent
                    side="right"
                    className="flex h-full w-full max-w-full flex-col p-0 sm:max-w-xl"
                >
                    {/* ================================================== */}
                    {/* HEADER */}
                    {/* ================================================== */}
                    <SheetHeader className="sticky top-0 z-10 flex-row items-center justify-between border-b bg-background px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">Add Business</h2>
                        </div>
                    </SheetHeader>

                    {/* ================================================== */}
                    {/* BODY */}
                    {/* ================================================== */}
                    <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
                        {/* Business Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Business name</Label>
                            <Input
                                id="name"
                                placeholder="Business name"
                                value={businessName}
                                onChange={e => setBusinessName(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* ================================================== */}
                    {/* FOOTER */}
                    {/* ================================================== */}
                    <SheetFooter className="sticky bottom-0 border-t bg-background px-6 py-4">
                        <div className="flex w-full gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                onClick={handleAddBusiness}
                                className="flex-1"
                                disabled={!businessName?.trim()}
                            >
                                Create Business
                            </Button>
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    )
}
