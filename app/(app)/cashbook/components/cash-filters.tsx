"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar as CalendarIcon, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function CashFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentSearch = searchParams.get("search") || "";
    const currentCategory = searchParams.get("category") || "All";
    const currentDate = searchParams.get("date");

    const [searchValue, setSearchValue] = useState(currentSearch);

    // Filter categories
    const categories = ["All", "Cash", "Online"];

    const updateFilters = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });
        router.push(`${pathname}?${params.toString()}` as any);
    };

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
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                    placeholder="Search description or amount..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="h-12 rounded-full pl-10 pr-10"
                />
                {searchValue && (
                    <button
                        onClick={() => setSearchValue("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X size={16} />
                    </button>
                )}
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
                        variant={currentCategory === item ? "default" : "secondary"}
                        size="sm"
                        onClick={() => updateFilters({ category: item })}
                        className={cn(
                            "rounded-full shrink-0 transition-all duration-300",
                            currentCategory === item ? "px-6 shadow-md" : "px-4"
                        )}
                    >
                        {item}
                    </Button>
                ))}

                <div className="h-6 w-px bg-border mx-1" />

                <Popover>
                    <PopoverTrigger
                        className={cn(
                            "inline-flex items-center justify-center h-8 rounded-full shrink-0 gap-2 text-sm font-medium transition-all px-4",
                            currentDate ? "bg-primary text-primary-foreground px-6 shadow-md" : "bg-secondary text-secondary-foreground"
                        )}
                    >
                        <CalendarIcon size={14} />
                        {currentDate ? format(new Date(currentDate), "dd MMM") : "Date"}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden" align="start">
                        <Calendar
                            mode="single"
                            selected={currentDate ? new Date(currentDate) : undefined}
                            onSelect={(date) => updateFilters({ date: date ? format(date, "yyyy-MM-dd") : null })}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                {currentDate && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateFilters({ date: null })}
                        className="rounded-full shrink-0 h-8 w-8 text-muted-foreground"
                    >
                        <X size={14} />
                    </Button>
                )}
            </motion.div>
        </div>
    );
}


