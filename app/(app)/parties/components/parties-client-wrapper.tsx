"use client"
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const TabContext = createContext<{
    optimisticTab: string | null;
    setOptimisticTab: (tab: string | null) => void;
}>({ optimisticTab: null, setOptimisticTab: () => { } })

export function PartiesClientProvider({ currentTab, children }: { currentTab: string, children: ReactNode }) {
    const [optimisticTab, setOptimisticTab] = useState<string | null>(null)

    useEffect(() => {
        // When the server catches up, reset optimistic tab
        setOptimisticTab(null)
    }, [currentTab])

    return (
        <TabContext.Provider value={{ optimisticTab, setOptimisticTab }}>
            {children}
        </TabContext.Provider>
    )
}

export function PartiesTabContent({ currentTab, children, fallback }: { currentTab: string, children: ReactNode, fallback: ReactNode }) {
    const { optimisticTab } = useContext(TabContext)
    return optimisticTab && optimisticTab !== currentTab ? fallback : children
}

export function useOptimisticTab() {
    return useContext(TabContext)
}
