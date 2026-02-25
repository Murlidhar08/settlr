"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function LayoutTransitions({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="popLayout" initial={false}>
            <motion.main
                key={pathname}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex-1 flex flex-col overflow-y-auto pb-24 bg-background transition-[width] duration-300 ease-in-out h-full"
            >
                {children}
            </motion.main>
        </AnimatePresence>

    );
}
