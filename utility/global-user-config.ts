import { Currency } from "@/lib/generated/prisma/enums";
import { UserSettingsInput } from "@/types/user/UserSettingsInput";

let globalUserConfig: UserSettingsInput = {
    dateFormat: "dd/MM/yyyy",
    timeFormat: "hh:mm a",
    currency: Currency.INR,
    locale: "en-IN"
};

/**
 * Set the global user configuration for hook-free formatting.
 */
export function setGlobalUserConfig(config: Partial<UserSettingsInput>) {
    if (config.dateFormat)
        globalUserConfig.dateFormat = config.dateFormat;

    if (config.timeFormat)
        globalUserConfig.timeFormat = config.timeFormat;

    if (config.currency)
        globalUserConfig.currency = config.currency;

    if (config.locale)
        globalUserConfig.locale = config.locale;
}

/**
 * Retrieve the active global user config preferences.
 */
export function getGlobalUserConfig(): UserSettingsInput {
    return globalUserConfig;
}