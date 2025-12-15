import { motion } from "framer-motion";

export default function CashSummary() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-3xl bg-background p-6 shadow-sm"
        >
            <p className="text-xs uppercase text-muted-foreground text-center">
                Total Cash Balance
            </p>

            <h2 className="mt-2 text-center text-4xl font-extrabold">
                ₹4,250.00
            </h2>

            <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-green-50 p-4 text-center">
                    <p className="text-green-600 font-bold text-lg">+₹1,500</p>
                    <span className="text-xs text-muted-foreground">Total In</span>
                </div>

                <div className="rounded-2xl bg-red-50 p-4 text-center">
                    <p className="text-red-600 font-bold text-lg">-₹820</p>
                    <span className="text-xs text-muted-foreground">Total Out</span>
                </div>
            </div>
        </motion.div>
    );
}
