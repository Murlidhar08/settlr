import { format } from "date-fns";
import { getGlobalUserConfig } from "./global-user-config";

/**
 * Formats a date according to the user's preferred date format.
 * Falls back to safe formatting or original string if parsing fails.
 */
export const formatUserDate = (date: Date | string | number, customFormat?: string): string => {
    try {
        const globalUserConfig = getGlobalUserConfig();
        const d = new Date(date);
        const dateFormat = customFormat ?? globalUserConfig.dateFormat;

        if (isNaN(d.getTime())) return String(date);
        return format(d, dateFormat!);
    } catch (error) {
        return String(date);
    }
};

/**
 * Formats a time according to the user's preferred time format (12/24 hour).
 * Falls back to safe formatting or original string if parsing fails.
 */
export const formatUserTime = (date: Date | string | number, customFormat?: string): string => {
    try {
        const globalUserConfig = getGlobalUserConfig();
        const d = new Date(date);
        const timeFormat = customFormat ?? globalUserConfig.timeFormat;

        if (isNaN(d.getTime())) return String(date);
        return format(d, timeFormat!);
    } catch (error) {
        return String(date);
    }
};

/**
 * Formats both date and time in a cohesive string based on user preferences.
 */
export const formatUserDateTime = (
    date: Date | string | number,
    separator: string = " • "
): string => {
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return String(date);

        const formattedDate = formatUserDate(d);
        const formattedTime = formatUserTime(d);

        return `${formattedDate}${separator}${formattedTime}`;
    } catch (error) {
        return String(date);
    }
};