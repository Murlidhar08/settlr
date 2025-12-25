import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import clsx from "clsx";

export default function CashTransactionItem({
    name,
    time,
    amount,
    type,
    tag,
}: any) {
    const isIn = type === "in";

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-between rounded-2xl bg-background p-4 shadow-sm border cursor-pointer user"
        >
            <div className="flex items-center gap-3">
                <div
                    className={clsx(
                        "h-10 w-10 rounded-full flex items-center justify-center",
                        isIn ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    )}
                >
                    {isIn ? <ArrowDownLeft /> : <ArrowUpRight />}
                </div>

                <div>
                    <p className="font-semibold text-sm">{name}</p>
                    <span className="text-xs text-muted-foreground">
                        {tag} • {time}
                    </span>
                </div>
            </div>

            <p
                className={clsx(
                    "font-bold",
                    isIn ? "text-green-600" : "text-red-600"
                )}
            >
                {amount}
            </p>
        </motion.div>
    );
}
