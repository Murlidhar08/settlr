import { getGlobalUserConfig } from "./global-user-config";

export function formatAmount(amount?: number | null, locale?: string) {
    if (!amount) return "0";

    if (locale) return Math.abs(amount).toLocaleString(locale);

    const globalUserConfig = getGlobalUserConfig();
    return Math.abs(amount).toLocaleString(globalUserConfig.locale);
}

/**
 * Formats a number, string, or bigint as currency according to the user's preferred currency and locale.
 * Falls back to safe formatting or original string if parsing/formatting fails.
 */
export const formatUserCurrency = (
    value: number | string | bigint,
    customCurrency?: string,
    customLocale?: string
): string => {
    try {
        let num: number;
        if (typeof value === "bigint") {
            num = Number(value);
        } else {
            num = typeof value === "number" ? value : parseFloat(value);
        }

        if (isNaN(num)) return String(value);

        const globalUserConfig = getGlobalUserConfig();
        const locale = customLocale || globalUserConfig.locale;
        const currency = customCurrency || globalUserConfig.currency;

        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency,
        }).format(num);
    } catch (error) {
        return String(value);
    }
};

/**
 * Formats a number, string, or bigint to standard decimal/number formatting without the currency symbol.
 * Useful for text inputs or display columns that are already labeled with a currency header.
 */
export const formatUserNumber = (
    value: number | string | bigint,
    customLocale?: string
): string => {
    try {
        let num: number;
        if (typeof value === "bigint") {
            num = Number(value);
        } else {
            num = typeof value === "number" ? value : parseFloat(value);
        }

        if (isNaN(num)) return String(value);

        const globalUserConfig = getGlobalUserConfig();
        const locale = customLocale || globalUserConfig.locale;

        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(num);
    } catch (error) {
        return String(value);
    }
};