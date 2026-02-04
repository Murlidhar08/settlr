import { Currency, TransactionDirection } from "@/lib/generated/prisma/enums";

export const formatAmount = (
  amount: number,
  currency: Currency = Currency.INR,
  showSign: boolean = false,
  direction?: TransactionDirection,
): string => {
  const symbol = getCurrencySymbol(currency);
  const formattedAmount = Math.abs(amount).toLocaleString("en-IN");

  const sign = direction == TransactionDirection.IN
    ? "+"
    : direction == TransactionDirection.OUT
      ? "-"
      : amount > 0
        ? "+"
        : "-";

  const result = `${symbol}${formattedAmount}`;
  return showSign ? `${sign}${result}` : result;
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
