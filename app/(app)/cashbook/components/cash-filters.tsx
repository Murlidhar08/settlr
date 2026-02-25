"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar as CalendarIcon, X, Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { MoneyType } from "@/lib/generated/prisma/enums";

import { DateRange } from "react-day-picker";
import { useUserConfig } from "@/components/providers/user-config-provider";
import { t } from "@/lib/languages/i18n";

export default function CashFilters({
    effectiveStartDate,
    effectiveEndDate
}: {
    effectiveStartDate?: string;
    effectiveEndDate?: string;
}) {
    const { language } = useUserConfig();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const currentSearch = searchParams.get("search") || "";
    const currentCategory = searchParams.get("category") || "All";
    const currentStartDate = searchParams.get("startDate") || effectiveStartDate;
    const currentEndDate = searchParams.get("endDate") || effectiveEndDate;

    const [searchValue, setSearchValue] = useState(currentSearch);

    // Optimistic states for instant feedback
    const [optCategory, setOptCategory] = useState(currentCategory);
    const [optDateRange, setOptDateRange] = useState<{ from?: string, to?: string }>({
        from: currentStartDate,
        to: currentEndDate
    });

    // Sync optimistic state with actual URL state
    useEffect(() => {
        setOptCategory(currentCategory);
    }, [currentCategory]);

    useEffect(() => {
        setOptDateRange({ from: currentStartDate, to: currentEndDate });
    }, [currentStartDate, currentEndDate]);

    // Categories
    const categories = ["All", MoneyType.CASH, MoneyType.ONLINE];

    const updateFilters = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}` as any, { scroll: false });
        });
    };

    // Date range label
    const getDateLabel = () => {
        const start = optDateRange.from;
        const end = optDateRange.to;

        if (!start) return t("common.select_dates", language);
        if (start === end) {
            return start === format(new Date(), "yyyy-MM-dd") ? t("common.today", language) : format(new Date(start), "dd MMM");
        }
        return `${format(new Date(start), "dd MMM")} - ${format(new Date(end || start), "dd MMM")}`;
    };

    const isDateActive = !!searchParams.get("startDate") || (optDateRange.from === format(new Date(), "yyyy-MM-dd") && optDateRange.to === format(new Date(), "yyyy-MM-dd"));

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== currentSearch) {
                updateFilters({ search: searchValue || null });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchValue, currentSearch]);

    return (
        <div className="mt-6 space-y-4">
            {/* Search */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
            >
                <div className="relative group">
                    <Search className={cn(
                        "absolute left-4 top-1/2 -translate-y-1/2 size-4 transition-colors",
                        isPending ? "text-primary animate-pulse" : "text-muted-foreground"
                    )} />
                    <Input
                        placeholder={t("common.search_cashbook", language)}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="h-12 rounded-2xl pl-11 pr-11 bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-background transition-all shadow-sm font-medium"
                    />
                    <AnimatePresence>
                        {searchValue && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={() => setSearchValue("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-full"
                            >
                                <X size={14} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex gap-2 items-center overflow-x-auto no-scrollbar pb-1"
            >
                {categories.map((item) => (
                    <Button
                        key={item}
                        variant={optCategory === item ? "default" : "secondary"}
                        size="sm"
                        onClick={() => {
                            setOptCategory(item);
                            updateFilters({ category: item === "All" ? null : item });
                        }}
                        className={cn(
                            "rounded-xl shrink-0 transition-all duration-300 h-10 font-bold uppercase tracking-widest text-[10px]",
                            optCategory === item ? "px-6 shadow-lg shadow-primary/20" : "px-4 bg-muted/40 hover:bg-muted"
                        )}
                    >
                        {item === "All" ? t("common.all", language) : item}
                    </Button>
                ))}

                <div className="h-6 w-px bg-border/50 mx-1 shrink-0" />

                <Popover>
                    <PopoverTrigger
                        render={
                            <Button
                                variant={isDateActive ? "default" : "secondary"}
                                size="sm"
                                className={cn(
                                    "rounded-xl shrink-0 gap-2 font-bold uppercase tracking-widest text-[10px] h-10 transition-all",
                                    isDateActive ? "px-6 shadow-lg shadow-primary/20" : "px-4 bg-muted/40 hover:bg-muted"
                                )}
                            >
                                <CalendarIcon size={14} className={isPending && isDateActive ? "animate-pulse" : ""} />
                                {getDateLabel()}
                            </Button>
                        }
                    />

                    <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden shadow-2xl border-0" align="start">
                        <Calendar
                            mode="range"
                            selected={{
                                from: optDateRange.from ? new Date(optDateRange.from) : undefined,
                                to: optDateRange.to ? new Date(optDateRange.to) : undefined
                            } as DateRange}
                            onSelect={(range) => {
                                const start = range?.from ? format(range.from, "yyyy-MM-dd") : null;
                                const end = range?.to ? format(range.to, "yyyy-MM-dd") : null;
                                setOptDateRange({ from: start || undefined, to: end || undefined });
                                updateFilters({
                                    startDate: start,
                                    endDate: end,
                                });
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                <AnimatePresence>
                    {(searchParams.get("startDate") || searchParams.get("endDate")) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, x: -10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.5, x: -10 }}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setOptDateRange({ from: effectiveStartDate, to: effectiveEndDate });
                                    updateFilters({ startDate: null, endDate: null });
                                }}
                                className="rounded-full shrink-0 h-8 w-8 text-muted-foreground hover:bg-muted"
                            >
                                <X size={14} />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isPending && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-auto"
                    >
                        <Loader2 className="size-4 text-primary animate-spin" />
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}



