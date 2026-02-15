import { Currency } from "@/lib/generated/prisma/enums";

export const formatAmount = (
  amount: number,
  currency: Currency = Currency.INR,
  showSign: boolean = false,
  direction?: 'IN' | 'OUT',
): string => {
  const symbol = getCurrencySymbol(currency);
  const formattedAmount = Math.abs(amount).toLocaleString("en-IN");

  let sign = "";
  if (showSign) {
    if (direction === 'IN') sign = "+";
    else if (direction === 'OUT') sign = "-";
    else sign = amount >= 0 ? "+" : "-";
  }

  return `${sign}${symbol}${formattedAmount}`;
};

export const getCurrencySymbol = (currency: Currency = Currency.INR): string => {
  switch (currency) {
    case Currency.USD: return "$";
    case Currency.EUR: return "€";
    case Currency.INR:
    default:
      return "₹";
  }
};
