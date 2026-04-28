"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateAppConfig } from "@/actions/admin/app-config";
import { Globe, Mail, Save, Server, ShieldCheck, Fingerprint, CreditCard, Layout } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const emailRegex = /^([^<]+<)?([^@\s<>]+@[^@\s<>.]+\.[^@\s<>.]+)>?$/;

const appConfigSchema = z.object({
    appName: z.string().min(1, "App name is required"),
    appDescription: z.string().min(1, "Description is required"),
    smtpHost: z.string().optional().nullable(),
    smtpPort: z.coerce.number().int().optional().nullable(),
    smtpUser: z.string().optional().nullable(),
    smtpPass: z.string().optional().nullable(),
    smtpSecure: z.boolean().default(false),
    fromEmail: z.string().refine((val) => !val || emailRegex.test(val), {
        message: "Invalid email format. Use 'email@example.com' or 'Name <email@example.com>'",
    }).optional().nullable().or(z.literal("")),
    googleClientId: z.string().optional().nullable(),
    googleClientSecret: z.string().optional().nullable(),
    discordClientId: z.string().optional().nullable(),
    discordClientSecret: z.string().optional().nullable(),
});

type AppConfigValues = z.infer<typeof appConfigSchema>;

import { useQueryClient } from "@tanstack/react-query";

interface AppSettingsFormProps {
    initialData: any;
}

export function AppSettingsForm({ initialData }: AppSettingsFormProps) {
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<AppConfigValues>({
        resolver: zodResolver(appConfigSchema) as any,
        defaultValues: {
            appName: initialData.appName || "",
            appDescription: initialData.appDescription || "",
            smtpHost: initialData.smtpHost || "",
            smtpPort: initialData.smtpPort || 587,
            smtpUser: initialData.smtpUser || "",
            smtpPass: initialData.smtpPass || "",
            smtpSecure: !!initialData.smtpSecure,
            fromEmail: initialData.fromEmail || "",
            googleClientId: initialData.googleClientId || "",
            googleClientSecret: initialData.googleClientSecret || "",
            discordClientId: initialData.discordClientId || "",
            discordClientSecret: initialData.discordClientSecret || ""
        },
    });

    const onSubmit = async (data: AppConfigValues) => {
        setLoading(true);
        try {
            await updateAppConfig(data as any);
            queryClient.invalidateQueries({ queryKey: ["admin-app-config"] });
            toast.success("Application settings updated successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to update settings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-10">
            {/* General & Branding Card */}
            <ConfigCard
                title="General & Branding"
                description="Core application identity and global settings."
                icon={<Layout className="w-5 h-5" />}
            >
                <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest opacity-50 ml-1">App Name</Label>
                    <Input
                        {...form.register("appName")}
                        className="h-12 rounded-2xl border-none bg-muted/40 shadow-inner focus-visible:ring-primary/20 transition-all font-bold"
                        placeholder="e.g. Settlr"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest opacity-50 ml-1">Description</Label>
                    <Textarea
                        {...form.register("appDescription")}
                        className="min-h-[100px] rounded-2xl border-none bg-muted/40 shadow-inner focus-visible:ring-primary/20 transition-all font-bold resize-none"
                        placeholder="A brief description..."
                    />
                </div>
            </ConfigCard>

            {/* Email Server Card */}
            <ConfigCard
                title="Email Server (SMTP)"
                description="Configuration for transactional emails."
                icon={<Mail className="w-5 h-5" />}
            >
                <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest opacity-50 ml-1">Support Email</Label>
                    <Input
                        {...form.register("fromEmail")}
                        className="h-12 rounded-2xl border-none bg-muted/40 shadow-inner focus-visible:ring-primary/20 transition-all font-bold"
                        placeholder="noreply@example.com"
                    />
                </div>
                <div className="grid gap-6 sm:grid-cols-3">
                    <div className="sm:col-span-2 space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest opacity-50 ml-1">Host</Label>
                        <Input
                            {...form.register("smtpHost")}
                            className="h-12 rounded-2xl border-none bg-muted/40 shadow-inner focus-visible:ring-primary/20 transition-all font-bold"
                            placeholder="smtp.example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest opacity-50 ml-1">Port</Label>
                        <Input
                            type="number"
                            {...form.register("smtpPort")}
                            className="h-12 rounded-2xl border-none bg-muted/40 shadow-inner focus-visible:ring-primary/20 transition-all font-bold"
                        />
                    </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest opacity-50 ml-1">User</Label>
                        <Input
                            {...form.register("smtpUser")}
                            className="h-12 rounded-2xl border-none bg-muted/40 shadow-inner focus-visible:ring-primary/20 transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest opacity-50 ml-1">Password</Label>
                        <Input
                            type="password"
                            {...form.register("smtpPass")}
                            className="h-12 rounded-2xl border-none bg-muted/40 shadow-inner focus-visible:ring-primary/20 transition-all font-bold"
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <Checkbox
                        id="smtpSecure"
                        checked={form.watch("smtpSecure")}
                        onCheckedChange={(checked) => form.setValue("smtpSecure", !!checked)}
                        className="rounded-lg h-6 w-6 border-primary/20 data-[state=checked]:bg-primary"
                    />
                    <div className="grid gap-1">
                        <Label htmlFor="smtpSecure" className="text-sm font-black">Secure Connection (SSL/TLS)</Label>
                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest italic">Use for port 465</p>
                    </div>
                </div>
            </ConfigCard>

            {/* Email Auth Card (OAuth) */}
            <ConfigCard
                title="Email Auth (OAuth)"
                description="Social login providers configuration."
                icon={<Fingerprint className="w-5 h-5" />}
            >
                <div className="space-y-6">
                    {/* Google */}
                    <div className="p-5 rounded-2xl border-2 border-dashed border-muted-foreground/10 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center">
                                <Globe className="w-4 h-4 text-rose-500" />
                            </div>
                            <h4 className="font-black text-[11px] uppercase tracking-widest">Google Auth</h4>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                {...form.register("googleClientId")}
                                className="h-11 rounded-xl border-none bg-background shadow-inner text-xs font-bold"
                                placeholder="Client ID"
                            />
                            <Input
                                type="password"
                                {...form.register("googleClientSecret")}
                                className="h-11 rounded-xl border-none bg-background shadow-inner text-xs font-bold"
                                placeholder="Client Secret"
                            />
                        </div>
                    </div>

                    {/* Discord */}
                    <div className="p-5 rounded-2xl border-2 border-dashed border-muted-foreground/10 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                <Globe className="w-4 h-4 text-indigo-500" />
                            </div>
                            <h4 className="font-black text-[11px] uppercase tracking-widest">Discord Auth</h4>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                {...form.register("discordClientId")}
                                className="h-11 rounded-xl border-none bg-background shadow-inner text-xs font-bold"
                                placeholder="Client ID"
                            />
                            <Input
                                type="password"
                                {...form.register("discordClientSecret")}
                                className="h-11 rounded-xl border-none bg-background shadow-inner text-xs font-bold"
                                placeholder="Client Secret"
                            />
                        </div>
                    </div>
                </div>
            </ConfigCard>

            <div className="sticky bottom-0 bg-background/80 backdrop-blur-md pt-4 pb-10 flex justify-end">
                <Button
                    type="submit"
                    disabled={loading}
                    className="h-14 px-16 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all hover:shadow-primary/40 active:scale-[0.98] bg-primary text-white"
                >
                    {loading ? "Saving Settings..." : "Sync All Config"}
                </Button>
            </div>
        </form>
    );
}

function ConfigCard({ title, description, icon, children }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative rounded-[2.5rem] border-2 border-primary/5 bg-card p-6 sm:p-10 shadow-xl shadow-primary/5 transition-all hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:rotate-12">
                    {icon}
                </div>
                <div>
                    <h3 className="text-xl font-black tracking-tight">{title}</h3>
                    <p className="text-sm font-bold text-muted-foreground/60">{description}</p>
                </div>
            </div>
            <div className="space-y-6">
                {children}
            </div>
        </motion.div>
    );
}
