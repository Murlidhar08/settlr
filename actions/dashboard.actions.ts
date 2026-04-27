"use server";

import { FinancialAccountType } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma/prisma";
import { getTransactionPerspective } from "@/lib/transaction-logic";
import { TransactionDirection } from "@/types/transaction/TransactionDirection";

export async function getDashboardSummary(businessId?: string | null) {
  if (!businessId) {
    return;
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // 1. Fetch all financial accounts for the business
  const accounts = await prisma.financialAccount.findMany({
    where: { businessId },
    select: { id: true, type: true, partyId: true }
  });

  const moneyAccIds = new Set(accounts.filter(a => a.type === FinancialAccountType.MONEY).map(a => a.id));
  const partyAccs = accounts.filter(a => a.type === FinancialAccountType.PARTY);

  // 2. Fetch all transactions (optimized for production later, using findMany for now to keep parity with existing logic)
  const transactions = await prisma.transaction.findMany({
    where: { businessId, isDelete: false },
    select: {
      amount: true,
      fromAccountId: true,
      toAccountId: true,
      partyId: true,
      date: true
    }
  });

  let receivable = 0;
  let payable = 0;
  let todayIn = 0;
  let todayOut = 0;
  let liquidCash = 0;

  const partyToAccId = new Map(partyAccs.map(a => [a.partyId!, a.id]));
  const partyBalances: Record<string, number> = {};
  const moneyBalances: Record<string, number> = {};

  transactions.forEach(tx => {
    const amount = Number(tx.amount);

    // Today's Cash Flow logic
    if (tx.date >= startOfDay && tx.date <= endOfDay) {
      if (moneyAccIds.has(tx.toAccountId)) todayIn += amount;
      if (moneyAccIds.has(tx.fromAccountId)) todayOut += amount;
    }

    // Money Account Balances
    if (moneyAccIds.has(tx.toAccountId)) {
      moneyBalances[tx.toAccountId] = (moneyBalances[tx.toAccountId] || 0) + amount;
    }
    if (moneyAccIds.has(tx.fromAccountId)) {
      moneyBalances[tx.fromAccountId] = (moneyBalances[tx.fromAccountId] || 0) - amount;
    }

    // Party Balance logic
    if (tx.partyId) {
      const pAccId = partyToAccId.get(tx.partyId);
      if (pAccId) {
        const perspective = getTransactionPerspective(tx.toAccountId, tx.fromAccountId, pAccId);
        if (perspective === TransactionDirection.IN) {
          partyBalances[tx.partyId] = (partyBalances[tx.partyId] || 0) + amount;
        } else if (perspective === TransactionDirection.OUT) {
          partyBalances[tx.partyId] = (partyBalances[tx.partyId] || 0) - amount;
        }
      }
    }
  });

  Object.values(partyBalances).forEach(balance => {
    if (balance > 0) receivable += balance;
    else if (balance < 0) payable += Math.abs(balance);
  });

  Object.values(moneyBalances).forEach(bal => {
    liquidCash += bal;
  });

  const todayNetCash = todayIn - todayOut;
  const netWorth = liquidCash + receivable - payable;

  return {
    liquidCash,
    todayNetCash,
    receivable,
    payable,
    netWorth,
  };
}
