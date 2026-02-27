"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function LayoutTransitions({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.main
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 1, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex-1 flex flex-col bg-background w-full pb-34"
            >
                {children}
            </motion.main>
        </AnimatePresence>

    );
}
