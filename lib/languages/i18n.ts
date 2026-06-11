export type Language = "en" | "hi";

import en from "./en/en";
import hi from "./hi/hi";

export const translations: Record<Language, any> = {
    en,
    hi,
};

let activeLanguage: Language = "en";

export function setActiveLanguage(lang: string) {
    activeLanguage = lang as Language;
}

export function getActiveLanguage(): Language {
    return activeLanguage;
}

export const t = (key: string, lang?: Language, params?: Record<string, string>): string => {
    const language = lang || activeLanguage;
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

export function tran(key: string, params?: Record<string, string>): string {
    return t(key, activeLanguage, params);
}