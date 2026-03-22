export function formatAmount(amount?: number | null) {
    if (!amount) return "0";

    return Math.abs(amount).toLocaleString("en-IN");
}
