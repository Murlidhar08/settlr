import { format } from "date-fns";

export function formatAmount(amount?: number | null) {
    if (!amount) return "0";

    return Math.abs(amount).toLocaleString("en-IN");
}

export function getInitials(name?: string | null) {
    if (!name) return "?";

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0][0]?.toUpperCase() ?? "?";
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export const formatDate = (date: Date | string | number, dateFormat: string = "dd/MM/yyyy"): string => {
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return String(date);
        return format(d, dateFormat);
    } catch (error) {
        return String(date);
    }
};

export const formatTime = (date: Date | string | number, timeFormat: string = "hh:mm a"): string => {
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return String(date);
        return format(d, timeFormat);
    } catch (error) {
        return String(date);
    }
};
