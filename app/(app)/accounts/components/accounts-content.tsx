"use client";

import { AccountCard } from "@/components/account/account-card";
import { AccountsSkeleton } from "@/components/account/accounts-skeleton";
import { AddAccountModal } from "@/components/account/add-account-modal";
import { FooterButtons } from "@/components/footer-buttons";
import { Button } from "@/components/ui/button";
import { Currency, FinancialAccountType } from "@/lib/generated/prisma/enums";
import { t } from "@/lib/languages/i18n";
import { cn } from "@/lib/utils";
import { useFinancialAccounts } from "@/tanstacks/financial-account";
import { Eye, EyeOff, Plus, Wallet } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function AccountsContent({
    language,
    currency,
    initialShowInactive
}: {
    language: string,
    currency: Currency,
    initialShowInactive: boolean
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [showInactive, setShowInactive] = useState(initialShowInactive);

    const toggleInactive = () => {
        const nextValue = !showInactive;
        setShowInactive(nextValue);

        const params = new URLSearchParams(searchParams.toString());
        if (nextValue) {
            params.set("inactive", "true");
        } else {
            params.delete("inactive");
        }
        router.push(`${pathname}?${params.toString()}` as any, { scroll: false });
    };

    const { allAccounts, isLoading } = useFinancialAccounts(showInactive);

    if (isLoading) {
        return <AccountsSkeleton />;
    }

    const accounts = allAccounts?.filter(a => a.partyId === null) || [];

    const groupedAccounts = {
        [FinancialAccountType.MONEY]: accounts.filter(a => a.type === FinancialAccountType.MONEY),
        [FinancialAccountType.CATEGORY]: accounts.filter(a => a.type === FinancialAccountType.CATEGORY),
    };

    const sections = [
        { type: FinancialAccountType.MONEY, title: t("accounts.money_title", language), subtitle: t("accounts.money_subtitle", language) },
        { type: FinancialAccountType.CATEGORY, title: t("accounts.business_title", language), subtitle: t("accounts.business_subtitle", language) },
    ];

    return (
        <div className="w-full bg-background">
            <div className="mx-auto w-full max-w-4xl px-6 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex flex-col">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/50 ml-1 mb-1">{t("accounts.overview", language)}</h2>
                        <div className="flex items-center gap-4">
                            <p className="text-3xl font-black tracking-tight">{t("accounts.total", language, { count: accounts.length.toString() })}</p>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleInactive}
                                className={cn(
                                    "rounded-full h-8 px-3 text-[10px] font-black uppercase tracking-widest",
                                    showInactive ? "bg-primary/10 text-primary hover:bg-primary/20" : "bg-muted text-muted-foreground hover:bg-muted/80"
                                )}
                            >
                                {showInactive ? <Eye className="size-3 mr-2" /> : <EyeOff className="size-3 mr-2" />}
                                {showInactive ? "Viewing All" : "Hide Inactive"}
                            </Button>
                        </div>
                    </div>
                </div>

                {accounts.length === 0 ? (
                    <div className="py-32 text-center space-y-6">
                        <div className="mx-auto w-24 h-24 rounded-[2.5rem] bg-muted/10 flex items-center justify-center text-muted-foreground/40 border-2 border-dashed border-muted relative">
                            <Wallet size={48} className="stroke-[1.5]" />
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground border-4 border-background">
                                <Plus size={16} className="stroke-3" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-2xl font-black">{t("accounts.not_found", language)}</p>
                            <p className="text-muted-foreground font-medium max-w-xs mx-auto">{t("accounts.description", language)}</p>
                        </div>
                        <AddAccountModal>
                            <Button variant="outline" className="h-12 rounded-xl border-2 font-bold px-6">
                                {t("accounts.get_started", language)}
                            </Button>
                        </AddAccountModal>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {sections.map((section) => {
                            const sectionAccounts = groupedAccounts[section.type];
                            if (sectionAccounts.length === 0) return null;

                            return (
                                <div key={section.type} className="space-y-6">
                                    <div className="flex items-center gap-4 px-1">
                                        <div className="h-1 w-12 bg-linear-to-r from-primary to-transparent rounded-full" />
                                        <div>
                                            <h3 className="text-sm font-black uppercase tracking-[0.2em]">{section.title}</h3>
                                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{section.subtitle} — {sectionAccounts.length}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {sectionAccounts.map((account, index) => (
                                            <AccountCard key={account.id} account={account} index={index} currency={currency} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <FooterButtons>
                <AddAccountModal>
                    <Button className="h-14 w-14 md:w-auto md:px-12 rounded-full md:gap-3 font-semibold uppercase bg-primary text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 p-0 md:py-2">
                        <Plus className="size-6 sm:size-5" />
                        <span className="hidden md:block text-center font-black tracking-[0.2em] text-sm">
                            {t("accounts.new", language)}
                        </span>
                    </Button>
                </AddAccountModal>
            </FooterButtons>
        </div>
    );
}
