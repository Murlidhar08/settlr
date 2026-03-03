"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function LayoutTransitions({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <motion.main
            key={pathname}
            className="flex-1 flex flex-col bg-background w-full pb-34"
        >
            {children}
        </motion.main>

    );
}
