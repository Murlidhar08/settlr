"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Filter, X, Calendar as CalendarIcon, ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { MoneyType } from "@/lib/generated/prisma/enums";

export default function StatementFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentMode = searchParams.get("mode") || "All";
    const currentDirection = searchParams.get("direction") || "All";
    const currentStartDate = searchParams.get("startDate");
    const currentEndDate = searchParams.get("endDate");

    const updateFilters = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });
        router.push(`${pathname}?${params.toString()}` as any);
    };

    const hasFilters = currentMode !== "All" || currentDirection !== "All" || currentStartDate || currentEndDate;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Transactions</h3>
                <div className="flex gap-2">
                    {hasFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(pathname as any)}
                            className="text-xs text-muted-foreground hover:text-foreground"
                        >
                            Reset
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {/* Direction Filter */}
                <Popover>
                    <PopoverTrigger>
                        <Button
                            variant={currentDirection !== "All" ? "default" : "secondary"}
                            size="sm"
                            className="rounded-full shrink-0 gap-1.5"
                        >
                            {currentDirection === "IN" ? <ArrowDownLeft size={14} /> : currentDirection === "OUT" ? <ArrowUpRight size={14} /> : <Filter size={14} />}
                            {currentDirection === "All" ? "Type" : currentDirection === "IN" ? "Cash In" : "Cash Out"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-1 rounded-2xl" align="start">
                        {["All", "IN", "OUT"].map((dir) => (
                            <button
                                key={dir}
                                onClick={() => updateFilters({ direction: dir === "All" ? null : dir })}
                                className={cn(
                                    "w-full text-left px-3 py-2 text-sm rounded-xl transition-colors",
                                    currentDirection === dir ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"
                                )}
                            >
                                {dir === "All" ? "All Types" : dir === "IN" ? "Cash In" : "Cash Out"}
                            </button>
                        ))}
                    </PopoverContent>
                </Popover>

                {/* Mode Filter */}
                <Popover>
                    <PopoverTrigger>
                        <Button
                            variant={currentMode !== "All" ? "default" : "secondary"}
                            size="sm"
                            className="rounded-full shrink-0 gap-1.5"
                        >
                            <Wallet size={14} />
                            {currentMode === "All" ? "Mode" : currentMode}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-1 rounded-2xl" align="start">
                        {["All", MoneyType.CASH, MoneyType.ONLINE].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => updateFilters({ mode: mode === "All" ? null : mode })}
                                className={cn(
                                    "w-full text-left px-3 py-2 text-sm rounded-xl transition-colors",
                                    currentMode === mode ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"
                                )}
                            >
                                {mode}
                            </button>
                        ))}
                    </PopoverContent>
                </Popover>

                {/* Date Range Filter */}
                <Popover>
                    <PopoverTrigger>
                        <Button
                            variant={currentStartDate || currentEndDate ? "default" : "secondary"}
                            size="sm"
                            className="rounded-full shrink-0 gap-1.5"
                        >
                            <CalendarIcon size={14} />
                            {currentStartDate ? (currentEndDate ? `${format(new Date(currentStartDate), "dd MMM")} - ${format(new Date(currentEndDate), "dd MMM")}` : format(new Date(currentStartDate), "dd MMM")) : "Date Range"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden" align="start">
                        <div className="p-3 border-b flex items-center justify-between bg-muted/50">
                            <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Select Date Range</span>
                            {(currentStartDate || currentEndDate) && (
                                <button onClick={() => updateFilters({ startDate: null, endDate: null })} className="text-xs text-primary hover:underline font-bold">Clear</button>
                            )}
                        </div>
                        <Calendar
                            mode="range"
                            selected={currentStartDate ? { from: new Date(currentStartDate), to: currentEndDate ? new Date(currentEndDate) : undefined } : undefined}
                            onSelect={(range) => {
                                updateFilters({
                                    startDate: range?.from ? format(range.from, "yyyy-MM-dd") : null,
                                    endDate: range?.to ? format(range.to, "yyyy-MM-dd") : null
                                });
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
