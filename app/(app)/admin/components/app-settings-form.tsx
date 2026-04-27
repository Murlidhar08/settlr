"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateAppConfig } from "@/actions/admin/app-config";
import { Globe, Mail, Save, Server, ShieldCheck, Fingerprint } from "lucide-react";

const appConfigSchema = z.object({
    appName: z.string().min(1, "App name is required"),
    appDescription: z.string().min(1, "Description is required"),
    smtpHost: z.string().optional().nullable(),
    smtpPort: z.coerce.number().int().optional().nullable(),
    smtpUser: z.string().optional().nullable(),
    smtpPass: z.string().optional().nullable(),
    smtpSecure: z.boolean().default(false),
    fromEmail: z.string().optional().nullable().or(z.literal("")),
    googleClientId: z.string().optional().nullable(),
    googleClientSecret: z.string().optional().nullable(),
    discordClientId: z.string().optional().nullable(),
    discordClientSecret: z.string().optional().nullable(),
});

type AppConfigValues = z.infer<typeof appConfigSchema>;

interface AppSettingsFormProps {
    initialData: any;
}

export function AppSettingsForm({ initialData }: AppSettingsFormProps) {
    const [loading, setLoading] = useState(false);

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
            discordClientSecret: initialData.discordClientSecret || "",
        },
    });

    const onSubmit = async (data: AppConfigValues) => {
        setLoading(true);
        try {
            await updateAppConfig(data as any);
            toast.success("Application settings updated successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to update settings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* General Settings */}
            <Card className="border-muted-foreground/10 shadow-sm overflow-hidden rounded-2xl">
                <CardHeader className="bg-muted/30 pb-4 border-b border-muted-foreground/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Globe className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle>General Settings</CardTitle>
                            <CardDescription>Basic application information and branding.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="appName">Application Name</Label>
                            <Input
                                id="appName"
                                {...form.register("appName")}
                                className="h-11 rounded-xl"
                                placeholder="e.g. Settlr"
                            />
                            {form.formState.errors.appName && (
                                <p className="text-xs text-destructive">{form.formState.errors.appName.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fromEmail">From Email Address</Label>
                            <Input
                                id="fromEmail"
                                {...form.register("fromEmail")}
                                className="h-11 rounded-xl"
                                placeholder="noreply@example.com"
                            />
                            {form.formState.errors.fromEmail && (
                                <p className="text-xs text-destructive">{form.formState.errors.fromEmail.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="appDescription">Application Description</Label>
                        <Textarea
                            id="appDescription"
                            {...form.register("appDescription")}
                            className="min-h-[100px] rounded-xl resize-none"
                            placeholder="A brief description of your application..."
                        />
                        {form.formState.errors.appDescription && (
                            <p className="text-xs text-destructive">{form.formState.errors.appDescription.message}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* SMTP Settings */}
            <Card className="border-muted-foreground/10 shadow-sm overflow-hidden rounded-2xl">
                <CardHeader className="bg-muted/30 pb-4 border-b border-muted-foreground/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Server className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Email Server (SMTP)</CardTitle>
                            <CardDescription>Configure outgoing email settings for notifications and auth.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="grid gap-6 sm:grid-cols-3">
                        <div className="sm:col-span-2 space-y-2">
                            <Label htmlFor="smtpHost">SMTP Host</Label>
                            <Input
                                id="smtpHost"
                                {...form.register("smtpHost")}
                                className="h-11 rounded-xl"
                                placeholder="smtp.example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="smtpPort">SMTP Port</Label>
                            <Input
                                id="smtpPort"
                                type="number"
                                {...form.register("smtpPort")}
                                className="h-11 rounded-xl"
                                placeholder="587"
                            />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="smtpUser">SMTP User</Label>
                            <Input
                                id="smtpUser"
                                {...form.register("smtpUser")}
                                className="h-11 rounded-xl"
                                placeholder="user@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="smtpPass">SMTP Password</Label>
                            <Input
                                id="smtpPass"
                                type="password"
                                {...form.register("smtpPass")}
                                className="h-11 rounded-xl"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 p-4 bg-muted/20 rounded-xl border border-muted-foreground/5">
                        <Checkbox
                            id="smtpSecure"
                            checked={form.watch("smtpSecure")}
                            onCheckedChange={(checked) => form.setValue("smtpSecure", !!checked)}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label
                                htmlFor="smtpSecure"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Use SSL/TLS (Secure Connection)
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Enable if your SMTP server requires SSL (typically port 465).
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Authentication Settings */}
            <Card className="border-muted-foreground/10 shadow-sm overflow-hidden rounded-2xl">
                <CardHeader className="bg-muted/30 pb-4 border-b border-muted-foreground/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Fingerprint className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Authentication (OAuth)</CardTitle>
                            <CardDescription>Configure external login providers.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-8">
                    {/* Google */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center">
                                <Globe className="w-4 h-4 text-rose-500" />
                            </div>
                            <h3 className="font-bold text-sm">Google Cloud Console</h3>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 ml-10">
                            <div className="space-y-2">
                                <Label htmlFor="googleClientId">Client ID</Label>
                                <Input
                                    id="googleClientId"
                                    {...form.register("googleClientId")}
                                    className="h-11 rounded-xl"
                                    placeholder="xxx-yyy.apps.googleusercontent.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="googleClientSecret">Client Secret</Label>
                                <Input
                                    id="googleClientSecret"
                                    type="password"
                                    {...form.register("googleClientSecret")}
                                    className="h-11 rounded-xl"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Discord */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                <Globe className="w-4 h-4 text-indigo-500" />
                            </div>
                            <h3 className="font-bold text-sm">Discord Developer Portal</h3>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 ml-10">
                            <div className="space-y-2">
                                <Label htmlFor="discordClientId">Client ID</Label>
                                <Input
                                    id="discordClientId"
                                    {...form.register("discordClientId")}
                                    className="h-11 rounded-xl"
                                    placeholder="123456789"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="discordClientSecret">Client Secret</Label>
                                <Input
                                    id="discordClientSecret"
                                    type="password"
                                    {...form.register("discordClientSecret")}
                                    className="h-11 rounded-xl"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-4 pb-10">
                <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 px-12 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-[0.98]"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Saving...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Save All Settings
                        </div>
                    )}
                </Button>
            </div>
        </form>
    );
}
