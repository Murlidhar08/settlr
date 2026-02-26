"use client";

import { TransactionList } from "@/components/transaction/transaction-list";
import { motion } from "framer-motion";

interface CashbookListProps {
    transactions: any[];
}

export function CashbookList({ transactions }: CashbookListProps) {


    if (transactions.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 text-center space-y-3"
            >
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-2xl">🔍</span>
                </div>
                <p className="text-muted-foreground">No transactions found matching your filters.</p>
            </motion.div>
        );
    }

    const formattedTransactions = transactions.map((tra) => ({
        ...tra,
        amount: Number(tra.amount)
    }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-3"
        >
            <TransactionList partyId={null} transactions={formattedTransactions} />
        </motion.div>
    );
}
