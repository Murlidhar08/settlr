import { TransactionDirection } from "@/types/transaction/TransactionDirection";
import { FinancialAccountType } from "./generated/prisma/enums";

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
 * Technically correct transaction direction from the perspective of an account.
 * IN: Money enters the account
 * OUT: Money leaves the account
 */
export function getTransactionPerspective(
    toAccountId: string,
    fromAccountId: string,
    contextAccountId: string,
): TransactionDirection | undefined {
    if (toAccountId === contextAccountId) return TransactionDirection.IN;
    if (fromAccountId === contextAccountId) return TransactionDirection.OUT;
    return undefined;
}

/**
 * Logically correct direction for Party transactions (Business-Centric).
 * Since sending money to a party is an entry in their book (IN), 
 * it is logically an OUTFLOW from the business.
 */
export function getPartyTransactionPerspective(
    toAccountId: string,
    fromAccountId: string,
    partyAccountId: string
): TransactionDirection | undefined {
    const raw = getTransactionPerspective(toAccountId, fromAccountId, partyAccountId);
    if (!raw) return undefined;

    // Flip the direction: IN(to party) => OUT(from business)
    return raw === TransactionDirection.IN
        ? TransactionDirection.OUT
        : TransactionDirection.IN;
}

/**
 * Perspective from the business owner's overall view (Cashbook level).
 * Focuses on money movement.
 */
export function getBusinessTransactionPerspective(
    toAccountType?: string,
    fromAccountType?: string
): TransactionDirection | undefined {
    if (toAccountType === FinancialAccountType.MONEY && fromAccountType === FinancialAccountType.MONEY) {
        return TransactionDirection.NEUTRAL;
    }

    if (toAccountType === FinancialAccountType.MONEY && fromAccountType !== FinancialAccountType.MONEY) {
        return TransactionDirection.IN;
    }
    if (fromAccountType === FinancialAccountType.MONEY && toAccountType !== FinancialAccountType.MONEY) {
        return TransactionDirection.OUT;
    }

    // Default fallback: If it's entering a MONEY account, it's IN.
    if (toAccountType === FinancialAccountType.MONEY) return TransactionDirection.IN;
    if (fromAccountType === FinancialAccountType.MONEY) return TransactionDirection.OUT;

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
    accountId: string,
    accountType?: string
) {
    let totalIn = 0;
    let totalOut = 0;

    for (const tx of transactions) {
        const direction = accountType === FinancialAccountType.PARTY
            ? getPartyTransactionPerspective(tx.toAccountId, tx.fromAccountId, accountId)
            : getTransactionPerspective(tx.toAccountId, tx.fromAccountId, accountId);

        if (!direction) continue;

        const amount = Number(tx.amount) || 0;

        if (direction === TransactionDirection.IN)
            totalIn += amount;

        if (direction === TransactionDirection.OUT)
            totalOut += amount;
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
    accountId: string,
    accountType?: string
): number | undefined {

    const direction = accountType === "PARTY"
        ? getPartyTransactionPerspective(transaction.toAccountId, transaction.fromAccountId, accountId)
        : getTransactionPerspective(transaction.toAccountId, transaction.fromAccountId, accountId);

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