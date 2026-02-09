"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function LayoutTransitions({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.main
                key={pathname}
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="flex-1 overflow-y-auto pb-24 bg-background transition-[width] duration-300 ease-in-out"
            >
                {children}
            </motion.main>
        </AnimatePresence>
    );
}
