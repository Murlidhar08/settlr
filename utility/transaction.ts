export const formatAmount = (amount: number, positive: boolean) =>
  `${positive ? "+" : "-"}₹${Math.abs(amount).toLocaleString("en-IN")}`;
