import { TransactionDirection } from "@/types/transaction/TransactionDirection";

/**
 * Determines the direction of a transaction from the perspective of a specific account.
 * 
 * @param toAccountId The ID of the account receiving the money
 * @param fromAccountId The ID of the account sending the money
 * @param contextAccountId The ID of the account from whose perspective we are viewing the transaction
 * @param contextAccountType The type of the context account (MONEY, PARTY, CATEGORY)
 * @returns IN if money is flowing into the context's "pocket", OUT if it's flowing out.
 */
export function getTransactionPerspective(
    toAccountId: string,
    fromAccountId: string,
    contextAccountId: string,
    contextAccountType?: string
): TransactionDirection {
    // Base logic: Is money arriving at our doorstep?
    const isTargetOfFlow = toAccountId === contextAccountId;

    // Flip logic: 
    // For MONEY accounts (Cash/Bank), "In" meant we received money (+).
    // For PARTY accounts (Ledgers), "In" meant they received money. 
    // But from OUR perspective on a Party page: 
    // - They receive money = We GAVE = OUT (-)
    // - They send money = We GOT = IN (+)

    const isNonMoneyAccount = contextAccountType && contextAccountType !== "MONEY";

    if (isNonMoneyAccount) {
        // If it's a party/category, we flip it.
        // Flow TO them means flow OUT from us.
        return isTargetOfFlow ? TransactionDirection.OUT : TransactionDirection.IN;
    }

    // For Money accounts, Flow TO us means IN.
    return isTargetOfFlow ? TransactionDirection.IN : TransactionDirection.OUT;
}

/**
 * Calculates aggregate totals for a list of transactions relative to a specific account.
 */
export function calculateAccountStats(
    transactions: any[],
    accountId: string,
    accountType?: string
) {
    let totalIn = 0;  // Money coming in to the business perspective
    let totalOut = 0; // Money going out from the business perspective

    transactions.forEach((tx) => {
        const amount = Number(tx.amount);
        const direction = getTransactionPerspective(
            tx.toAccountId,
            tx.fromAccountId,
            accountId,
            accountType
        );

        if (direction === TransactionDirection.IN) {
            totalIn += amount;
        } else {
            totalOut += amount;
        }
    });

    return {
        totalIn,
        totalOut,
        balance: totalIn - totalOut,
        // Human readable aliases
        totalReceived: totalIn,
        totalPaid: totalOut
    };
}
