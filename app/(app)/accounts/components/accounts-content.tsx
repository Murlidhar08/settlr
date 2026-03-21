"use client"

import { useQuery } from "@tanstack/react-query"
import { getFinancialAccountsWithBalance } from "@/actions/financial-account.actions"
import { AddAccountModal } from "@/components/account/add-account-modal"
import { AccountCard } from "@/components/account/account-card"
import { Button } from "@/components/ui/button"
import { Plus, Wallet } from "lucide-react"
import { FinancialAccountType } from "@/lib/generated/prisma/enums"
import { t } from "@/lib/languages/i18n"
import { useCachedAccountsWithBalance } from "@/lib/hooks/use-cached-queries"
import { FooterButtons } from "@/components/footer-buttons"
import { Currency } from "@/lib/generated/prisma/enums"

export function AccountsContent({ language, currency }: { language: string, currency: Currency }) {
    const { data: allAccounts = [], isLoading } = useCachedAccountsWithBalance()

    const accounts = allAccounts.filter(a => a.partyId === null);

    const groupedAccounts = {
        [FinancialAccountType.MONEY]: accounts.filter(a => a.type === FinancialAccountType.MONEY),
        [FinancialAccountType.CATEGORY]: accounts.filter(a => a.type === FinancialAccountType.CATEGORY),
    };

    const sections = [
        { type: FinancialAccountType.MONEY, title: t("accounts.money_title", language), subtitle: t("accounts.money_subtitle", language) },
        { type: FinancialAccountType.CATEGORY, title: t("accounts.business_title", language), subtitle: t("accounts.business_subtitle", language) },
    ];

    if (isLoading) {
        return (
            <div className="w-full bg-background">
                <div className="mx-auto w-full max-w-4xl px-6 py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                        <div className="h-8 w-12 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="space-y-16">
                        {[1, 2].map((section) => (
                            <div key={section} className="space-y-6">
                                <div className="flex items-center gap-4 px-1">
                                    <div className="h-1 w-12 bg-muted animate-pulse rounded-full" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                                        <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="h-24 w-full bg-muted/30 rounded-2xl animate-pulse" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-background">
            <div className="mx-auto w-full max-w-4xl px-6 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/50 ml-1 mb-1">{t("accounts.overview", language)}</h2>
                    <p className="text-3xl font-black tracking-tight">{t("accounts.total", language, { count: accounts.length.toString() })}</p>
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
                    <Button className="h-14 w-full md:w-auto md:px-24 rounded-full gap-3 font-semibold uppercase bg-slate-900 text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 py-2">
                        <Plus size={20} className="stroke-3" />
                        <span className="text-center font-black tracking-[0.2em] text-sm">
                            {t("accounts.new", language)}
                        </span>
                    </Button>
                </AddAccountModal>
            </FooterButtons>
        </div>
    );
}
