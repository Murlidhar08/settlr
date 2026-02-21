import { TransactionDirection } from "@/types/transaction/TransactionDirection";

/**
 * ------------------------------------------------------------
 * CORE RULE (Settlr Accounting Standard)
 * ------------------------------------------------------------
 *
 * IN  = Money flows INTO this account
 * OUT = Money flows OUT OF this account
 *
 * No account-type flipping.
 * Works for MONEY, PARTY, CATEGORY, EQUITY, ASSET, etc.
 *
 * Double-entry guarantee:
 * One account will always be IN
 * One account will always be OUT
 * ------------------------------------------------------------
 */


/**
 * Determines transaction direction from the perspective
 * of a specific account.
 *
 * @param toAccountId   Account receiving money
 * @param fromAccountId Account sending money
 * @param contextAccountId Account we are viewing
 *
 * @returns IN | OUT | undefined (if unrelated)
 */
export function getTransactionPerspective(
    toAccountId: string,
    fromAccountId: string,
    contextAccountId: string
): TransactionDirection | undefined {

    // Money is flowing INTO this account
    if (toAccountId === contextAccountId) {
        return TransactionDirection.IN;
    }

    // Money is flowing OUT OF this account
    if (fromAccountId === contextAccountId) {
        return TransactionDirection.OUT;
    }

    // Transaction not related to this account
    return undefined;
}


/**
 * ------------------------------------------------------------
 * Calculate totals for a specific account
 * ------------------------------------------------------------
 *
 * Used for:
 * - Cashbook page
 * - Party ledger
 * - Category summary
 * - Bank account
 * - Owner equity
 */
export function calculateAccountStats(
    transactions: any[],
    accountId: string
) {
    let totalIn = 0;
    let totalOut = 0;

    for (const tx of transactions) {
        const direction = getTransactionPerspective(
            tx.toAccountId,
            tx.fromAccountId,
            accountId
        );

        // Skip unrelated transactions
        if (!direction) continue;

        const amount = Number(tx.amount) || 0;

        if (direction === TransactionDirection.IN) {
            totalIn += amount;
        }

        if (direction === TransactionDirection.OUT) {
            totalOut += amount;
        }
    }

    return {
        totalIn,
        totalOut,
        balance: totalIn - totalOut,

        // Human-readable aliases
        totalReceived: totalIn,
        totalPaid: totalOut,
    };
}


/**
 * ------------------------------------------------------------
 * Get signed amount for a transaction (useful for ledgers)
 * ------------------------------------------------------------
 *
 * Returns:
 * +amount  → IN
 * -amount  → OUT
 * undefined → unrelated
 */
export function getSignedAmount(
    transaction: {
        toAccountId: string;
        fromAccountId: string;
        amount: number;
    },
    accountId: string
): number | undefined {

    const direction = getTransactionPerspective(
        transaction.toAccountId,
        transaction.fromAccountId,
        accountId
    );

    if (!direction) return undefined;

    const amount = Number(transaction.amount) || 0;

    return direction === TransactionDirection.IN
        ? amount
        : -amount;
}


/**
 * ------------------------------------------------------------
 * Utility: Check if transaction belongs to account
 * ------------------------------------------------------------
 */
export function isTransactionRelatedToAccount(
    transaction: {
        toAccountId: string;
        fromAccountId: string;
    },
    accountId: string
): boolean {
    return (
        transaction.toAccountId === accountId ||
        transaction.fromAccountId === accountId
    );
}


/**
 * ------------------------------------------------------------
 * Utility: Detect Self Transfer (Account to same account)
 * ------------------------------------------------------------
 *
 * Normally should never happen.
 * Safe guard for data integrity.
 */
export function isSelfTransfer(
    toAccountId: string,
    fromAccountId: string
): boolean {
    return toAccountId === fromAccountId;
}