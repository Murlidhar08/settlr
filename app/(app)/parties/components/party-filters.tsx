"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function PartyFilters() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const currentTab = searchParams.get("tab") || "customers"
    const currentSearch = searchParams.get("search") || ""

    const [searchValue, setSearchValue] = useState(currentSearch)

    const updateFilters = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString())
        Object.entries(updates).forEach(([key, value]) => {
            if (value) params.set(key, value)
            else params.delete(key)
        })
        router.push(`${pathname}?${params.toString()}` as any)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== currentSearch) {
                updateFilters({ search: searchValue || null })
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [searchValue, currentSearch])


    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
            >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                    placeholder="Search name, phone..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="h-12 rounded-full pl-10 bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-sm"
                />
            </motion.div>

            <Tabs
                value={currentTab}
                onValueChange={(val) => updateFilters({ tab: val })}
                className="w-full"
            >
                <TabsList className="grid grid-cols-2 h-14 rounded-2xl bg-muted/50 p-1 md:w-[400px]">
                    <TabsTrigger
                        value="customers"
                        className="rounded-xl font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-background data-[state=active]:shadow-md transition-all h-12"
                    >
                        Customers
                    </TabsTrigger>
                    <TabsTrigger
                        value="suppliers"
                        className="rounded-xl font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-background data-[state=active]:shadow-md transition-all h-12"
                    >
                        Suppliers
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    )
}
