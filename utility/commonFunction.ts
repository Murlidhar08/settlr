export function formatAmount(amount?: number | null) {
    if (!amount) return "?";

    return Math.abs(amount).toLocaleString("en-IN");
}
