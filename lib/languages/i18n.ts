export type Language = "en" | "hi";

import en from "./en/en";
import hi from "./hi/hi";

export const translations: Record<Language, any> = {
    en,
    hi,
};

export const t = (key: string, lang: string = "en", params?: Record<string, string>): string => {
    const language = (lang as Language) || "en";
    const keys = key.split(".");
    let value = translations[language];

    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            return key;
        }
    }

    if (typeof value !== 'string') return key;

    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            value = (value as string).replace(`{${k}}`, v);
        });
    }

    return value;
};
