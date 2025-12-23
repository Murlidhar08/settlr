"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
    ChevronRight,
    PaintbrushIcon,
    DollarSign,
    Calendar,
    CreditCard,
    CloudUpload,
    Download,
    ExternalLink,
    LogOut,
    Moon,
    Sun,
    Laptop,
} from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SettingsPage() {
    const router = useRouter();
    const [theme, setTheme] = React.useState<"auto" | "light" | "dark">("auto");

    // -------------
    // Handle Logout
    const handleLogout = async () => {
        try {
            await signOut();

            toast.success("Logged out successfully");

            // small delay so toast is visible before navigation
            setTimeout(() => {
                router.replace("/login");
            }, 300);
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header title="Settings" isProfile={false} />

            <div className="mx-auto max-w-4xl pb-32">
                <div className="mt-6 space-y-8 px-4">
                    {/* USER */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-background border shadow-sm cursor-pointer"
                    >
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                            {/* <User size={28} /> */}
                            <img
                                className="rounded-full"
                                src="https://github.com/shadcn.png"
                                alt="image"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-lg">Alex Sterling</p>
                            <p className="text-sm text-muted-foreground">Sterling Logistics</p>
                        </div>
                        <ChevronRight className="text-muted-foreground" />
                    </motion.div>

                    {/* GENERAL */}
                    <Section title="General Preferences">
                        <Row icon={DollarSign} label="Currency">
                            <Select defaultValue="USD">
                                <SelectTrigger className="w-30">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">USD ($)</SelectItem>
                                    <SelectItem value="INR">INR (₹)</SelectItem>
                                    <SelectItem value="EUR">EUR (€)</SelectItem>
                                </SelectContent>
                            </Select>
                        </Row>

                        <Row icon={Calendar} label="Date Format">
                            <Select defaultValue="DD/MM/YYYY">
                                <SelectTrigger className="w-35">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                </SelectContent>
                            </Select>
                        </Row>

                        <Row icon={CreditCard} label="Default Payment">
                            <Select defaultValue="Cash">
                                <SelectTrigger className="w-30">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="Online">Online</SelectItem>
                                </SelectContent>
                            </Select>
                        </Row>
                    </Section>

                    {/* APPEARANCE */}
                    <Section title="Appearance">
                        <div className="flex items-center justify-between px-4 h-16 w-full">
                            <motion.div
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center justify-between h-16 gap-4 flex-1"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                        <PaintbrushIcon size={16} />
                                    </div>
                                    <p className="flex-1 font-semibold">Theme</p>
                                </div>

                                <div className="flex gap-1 bg-muted rounded-xl p-1">
                                    <ThemeButton
                                        active={theme === "auto"}
                                        onClick={() => setTheme("auto")}
                                    >
                                        <Laptop size={20} /> Auto
                                    </ThemeButton>
                                    <ThemeButton
                                        active={theme === "light"}
                                        onClick={() => setTheme("light")}
                                    >
                                        <Sun size={20} /> Light
                                    </ThemeButton>
                                    <ThemeButton
                                        active={theme === "dark"}
                                        onClick={() => setTheme("dark")}
                                    >
                                        <Moon size={20} /> Dark
                                    </ThemeButton>
                                </div>
                            </motion.div>
                        </div>
                    </Section>

                    {/* DATA */}
                    <Section title="Data Management">
                        <ActionRow icon={CloudUpload} title="Backup Data" subtitle="Synced just now" />
                        <ActionRow icon={Download} title="Export Transactions" />
                    </Section>

                    {/* SUPPORT */}
                    <Section title="Support">
                        <LinkRow label="Help Center" />
                        <LinkRow label="Privacy Policy" />
                    </Section>

                    {/* LOGOUT */}
                    <motion.div whileTap={{ scale: 0.97 }}>
                        <Button
                            onClick={handleLogout}
                            variant="destructive"
                            className="w-full h-12 rounded-xl gap-2"
                        >
                            <LogOut size={18} /> Log Out
                        </Button>
                    </motion.div>

                    <div className="text-center text-xs text-muted-foreground pt-10">
                        Version 1.0.0 (Build 204)
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------------- components ---------------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 pl-2">
                {title}
            </h3>
            <div className="rounded-2xl bg-background border shadow-sm divide-y">
                {children}
            </div>
        </div>
    );
}

function Row({
    icon: Icon,
    label,
    children,
}: {
    icon: any;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 px-4 h-16"
        >
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Icon size={16} />
            </div>
            <p className="flex-1 font-semibold">{label}</p>
            {children}
        </motion.div>
    );
}

function ActionRow({
    icon: Icon,
    title,
    subtitle,
}: {
    icon: any;
    title: string;
    subtitle?: string;
}) {
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-4 px-4 h-16 text-left"
        >
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Icon size={16} />
            </div>
            <div className="flex-1">
                <p className="font-semibold">{title}</p>
                {subtitle && <p className="text-xs text-green-500">{subtitle}</p>}
            </div>
            <ChevronRight className="text-muted-foreground" />
        </motion.button>
    );
}

function LinkRow({ label }: { label: string }) {
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between px-4 h-16"
        >
            <span className="font-medium">{label}</span>
            <ExternalLink size={16} className="text-muted-foreground" />
        </motion.button>
    );
}

function ThemeButton({
    active,
    children,
    onClick,
}: {
    active: boolean;
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all",
                active
                    ? "bg-background shadow text-primary"
                    : "text-muted-foreground hover:text-primary"
            )}
        >
            {children}
        </button>
    );
}
