'use client';

// import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
    X,
    ChevronRight,
    DollarSign,
    Calendar,
    CreditCard,
    Moon,
    Sparkles,
    CloudUpload,
    Share2,
    ExternalLink,
    LogOut,
} from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-md pb-10">

                {/* Header */}
                <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b">
                    <div className="flex h-14 items-center justify-between px-4">
                        <h1 className="text-xl font-extrabold">Settings</h1>
                        <Button size="icon" variant="ghost">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </header>

                {/* Profile */}
                <div className="px-4 mt-4">
                    <Card className="rounded-2xl">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="relative h-16 w-16 overflow-hidden rounded-full">
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD09W_WbV1VksW5PCyv7u3cLlhKxV2p1Owx-tx1j_kWagmAq3bqnQoJGJWLnP3WRvJ5wBRKBg-c_q38veuaIPkuAImeOsTF0goRxV4otJviqjjDtUqbkJ99_3_mrBP1YfJwgKdEEURAPq3cGTuTdKx6Cr-oSa08D23sWh0Hr98A2Oa4GJKqeesFT31xEMtFpLKcM4AC6skp0PQDY9ae0NOi51MLoa9DBzKOFc249y2glQ6U5h8EvAdmPnbWgYnTSO23c9fKMg6UUIQK"
                                    alt="User avatar"
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold">Alex Sterling</p>
                                <p className="text-sm text-muted-foreground">Sterling Logistics</p>
                                <Badge className="mt-2" variant="secondary">PRO Plan</Badge>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </CardContent>
                    </Card>
                </div>

                {/* General Preferences */}
                <SettingsSection title="General Preferences">
                    <SettingsRow icon={DollarSign} label="Currency" value="USD ($)" />
                    <SettingsRow icon={Calendar} label="Date Format" value="DD/MM/YYYY" />
                    <SettingsRow icon={CreditCard} label="Default Payment" value="Cash" />
                </SettingsSection>

                {/* Appearance */}
                <SettingsSection title="Appearance">
                    <SettingsRow icon={Moon} label="Theme" customRight>
                        <div className="flex gap-1">
                            <Button size="sm" variant="secondary">Auto</Button>
                            <Button size="sm" variant="ghost">Light</Button>
                            <Button size="sm" variant="ghost">Dark</Button>
                        </div>
                    </SettingsRow>

                    <SettingsRow icon={Sparkles} label="Animations" customRight>
                        <Switch />
                    </SettingsRow>
                </SettingsSection>

                {/* Data */}
                <SettingsSection title="Data Management">
                    <SettingsRow icon={CloudUpload} label="Backup Data" value="Synced just now" />
                    <SettingsRow icon={Share2} label="Export Transactions" />
                </SettingsSection>

                {/* Support */}
                <SettingsSection title="Support">
                    <SettingsRow label="Help Center" external />
                    <SettingsRow label="Privacy Policy" external />
                </SettingsSection>

                {/* Footer */}
                <div className="mt-8 text-center text-xs text-muted-foreground">
                    Version 1.0.0 (Build 204)
                </div>

                {/* Logout */}
                <div className="px-4 mt-6">
                    <Button variant="destructive" className="w-full gap-2 rounded-xl">
                        <LogOut className="h-4 w-4" />
                        Log Out
                    </Button>
                </div>
            </div>
        </div>
    );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="px-4 mt-6">
            <h3 className="mb-2 pl-2 text-xs font-bold uppercase text-muted-foreground">{title}</h3>
            <Card className="rounded-2xl overflow-hidden">
                <CardContent className="p-0 divide-y">{children}</CardContent>
            </Card>
        </section>
    );
}

function SettingsRow({
    icon: Icon,
    label,
    value,
    external,
    customRight,
    children,
}: {
    icon?: any;
    label: string;
    value?: string;
    external?: boolean;
    customRight?: boolean;
    children?: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-3 px-4 h-14 hover:bg-muted/50 cursor-pointer">
            {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
            <p className="flex-1 font-medium">{label}</p>
            {customRight ? (
                children
            ) : (
                <>
                    {value && <span className="text-sm text-muted-foreground mr-1">{value}</span>}
                    {external ? (
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                </>
            )}
        </div>
    );
}
