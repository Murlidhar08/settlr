"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useUserConfig } from "@/components/providers/user-config-provider"
import { t } from "@/lib/languages/i18n"

export function PartyFilters() {
    const { language } = useUserConfig()
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
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-4">Search {currentTab}</span>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 size-4 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder={t("common.search_parties", language)}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="h-12 rounded-2xl pl-11 bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-background transition-all shadow-sm font-medium"
                        />
                    </div>
                </div>
            </motion.div>

            <Tabs
                value={currentTab}
                onValueChange={(val) => updateFilters({ tab: val })}
                className="w-full md:w-auto"
            >
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Directory Type</span>
                    <TabsList className="grid grid-cols-4 rounded-2xl bg-muted/40 p-1 w-full md:w-[480px] border border-border/50">
                        <TabsTrigger
                            value="customers"
                            className="rounded-xl font-bold uppercase tracking-widest text-[9px] data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all h-10"
                        >
                            {t("parties.customers", language)}
                        </TabsTrigger>
                        <TabsTrigger
                            value="suppliers"
                            className="rounded-xl font-bold uppercase tracking-widest text-[9px] data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all h-10"
                        >
                            {t("parties.suppliers", language)}
                        </TabsTrigger>
                        <TabsTrigger
                            value="employees"
                            className="rounded-xl font-bold uppercase tracking-widest text-[9px] data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all h-10"
                        >
                            {t("parties.employees", language)}
                        </TabsTrigger>
                        <TabsTrigger
                            value="other"
                            className="rounded-xl font-bold uppercase tracking-widest text-[9px] data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all h-10"
                        >
                            {t("parties.other", language)}
                        </TabsTrigger>
                    </TabsList>
                </div>
            </Tabs>
        </div>
    )
}

