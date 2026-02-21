"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  PaintbrushIcon,
  DollarSign,
  Calendar,
  Clock,
  Languages,
  CloudUpload,
  Download,
  ExternalLink,
  LogOut,
  Moon,
  Sun,
  Laptop,
  Link2Icon,
  LockKeyhole,
  KeyRoundIcon,
  Trash2Icon,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Currency, ThemeMode } from "@/lib/generated/prisma/enums";
import { envClient } from "@/lib/env.client";
import { getAppVersion, upsertUserSettings } from "@/actions/user-settings.actions";
import { useSession } from "@/lib/auth-client";
import { getInitials } from "@/utility/party";
import { useUserConfig } from "@/components/providers/user-config-provider";
import { t } from "@/lib/languages/i18n";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme, ...userConfig } = useUserConfig();
  const { data: session, isPending } = useSession();

  const [currency, setCurrency] = useState<Currency>(userConfig.currency);
  const [dateFormat, setDateFormat] = useState(userConfig.dateFormat);
  const [timeFormat, setTimeFormat] = useState(userConfig.timeFormat);
  const [language, setLanguage] = useState(userConfig.language);

  const [version, setVersion] = useState<string>("Pending ...");

  const initialized = useRef(false);

  useEffect(() => {
    if (isPending) return;
    if (initialized.current) return;

    getAppVersion().then(res => setVersion(res));
    initialized.current = true;
  }, [isPending, session]);

  if (isPending)
    return <SettingsSkeleton />;

  const currencyLabel: Record<Currency, string> = {
    USD: "USD ($)",
    INR: "INR (₹)",
    EUR: "EUR (€)",
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      setTimeout(() => router.replace("/login"), 300);
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title={t("settings.title", language)} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-4xl pb-32 mt-6 space-y-8 px-6"
      >
        {/* USER */}
        <motion.div
          variants={itemVariants}
          onClick={() => { router.push("/profile") }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-4 p-5 rounded-3xl bg-card border shadow-sm cursor-pointer transition-shadow hover:shadow-md"
        >
          <div className="relative group">
            <Avatar className="h-16 w-16 ring-4 ring-background transition-transform duration-500 group-hover:scale-110">
              <AvatarImage
                src={session?.user?.image ?? undefined}
                alt={session?.user?.name ?? "User avatar"}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-black text-xl">
                {getInitials(session?.user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          </div>

          <div className="flex-1">
            <p className="font-black text-xl tracking-tight">{session?.user?.name ?? "Unknown"}</p>
            <p className="text-sm font-medium text-muted-foreground opacity-70">{session?.user?.email ?? "Unknown"}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center">
            <ChevronRight className="text-muted-foreground" size={20} />
          </div>
        </motion.div>

        {/* GENERAL */}
        <motion.div variants={itemVariants}>
          <Section title={t("settings.general", language)}>
            <Row icon={DollarSign} label={t("settings.currency", language)}>
              <Select
                value={currency}
                onValueChange={(value) => {
                  if (!value) return
                  const v = value as Currency
                  setCurrency(v)
                  upsertUserSettings({ currency: v })
                  toast.success(`Currency updated to ${v}`)
                }}
              >
                <SelectTrigger className="w-[140px] h-10 rounded-xl border-2 font-bold focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-2xl">
                  {Object.values(Currency).map((currency) => (
                    <SelectItem key={currency} value={currency} className="rounded-lg font-medium">
                      {currencyLabel[currency]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Row>

            <Row icon={Calendar} label={t("settings.date_format", language)}>
              <Select
                value={dateFormat}
                onValueChange={(value) => {
                  if (!value) return
                  setDateFormat(value)
                  void upsertUserSettings({ dateFormat: value })
                  toast.success(`Date format updated`)
                }}
              >
                <SelectTrigger className="w-[140px] h-10 rounded-xl border-2 font-bold focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-2xl">
                  <SelectItem value="dd/MM/yyyy" className="rounded-lg font-medium">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/dd/yyyy" className="rounded-lg font-medium">MM/DD/YYYY</SelectItem>
                  <SelectItem value="yyyy-MM-dd" className="rounded-lg font-medium">YYYY-MM-DD</SelectItem>
                  <SelectItem value="dd MMM, yyyy" className="rounded-lg font-medium">DD MMM, YYYY</SelectItem>
                </SelectContent>
              </Select>
            </Row>

            <Row icon={Clock} label={t("settings.time_format", language)}>
              <Select
                value={timeFormat}
                onValueChange={(value) => {
                  if (!value) return
                  setTimeFormat(value)
                  void upsertUserSettings({ timeFormat: value })
                  toast.success(`Time format updated`)
                }}
              >
                <SelectTrigger className="w-[140px] h-10 rounded-xl border-2 font-bold focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-2xl">
                  <SelectItem value="hh:mm a" className="rounded-lg font-medium">12 Hour</SelectItem>
                  <SelectItem value="HH:mm" className="rounded-lg font-medium">24 Hour</SelectItem>
                </SelectContent>
              </Select>
            </Row>

            <Row icon={Languages} label={t("settings.language", language)}>
              <Select
                value={language}
                onValueChange={(value) => {
                  if (!value) return
                  setLanguage(value)
                  void upsertUserSettings({ language: value })
                  toast.success(`Language updated`)
                }}
              >
                <SelectTrigger className="w-[140px] h-10 rounded-xl border-2 font-bold focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-2xl">
                  <SelectItem value="en" className="rounded-lg font-medium">English</SelectItem>
                  <SelectItem value="hi" className="rounded-lg font-medium">Hindi</SelectItem>
                </SelectContent>
              </Select>
            </Row>
          </Section>
        </motion.div>

        {/* APPEARANCE */}
        <motion.div variants={itemVariants}>
          <Section title={t("settings.appearance", language)}>
            <div className="flex items-center justify-between px-5 h-20 w-full group">
              <div className="flex items-center justify-between h-full gap-4 flex-1">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:rotate-12">
                    <PaintbrushIcon size={18} />
                  </div>
                  <p className="flex-1 font-bold text-base">Theme Mode</p>
                </div>

                <div className="flex gap-1 bg-muted/50 rounded-2xl p-1.5 border-2 border-transparent focus-within:border-primary/10">
                  {[
                    { id: ThemeMode.AUTO, icon: Laptop, label: "Auto" },
                    { id: ThemeMode.LIGHT, icon: Sun, label: "Light" },
                    { id: ThemeMode.DARK, icon: Moon, label: "Dark" },
                  ].map((mode) => (
                    <Button
                      key={mode.id}
                      variant={theme === mode.id ? "secondary" : "ghost"}
                      size="sm"
                      className={cn(
                        "gap-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all px-4 h-9",
                        theme === mode.id && "bg-background shadow-lg scale-100 text-primary",
                        theme !== mode.id && "opacity-60 hover:opacity-100"
                      )}
                      onClick={async () => {
                        setTheme(mode.id);
                        await upsertUserSettings({ theme: mode.id });
                      }}
                    >
                      <mode.icon size={15} />
                      <span className="hidden sm:inline">{mode.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </motion.div>

        {/* SECURITY */}
        <motion.div variants={itemVariants}>
          <Section title="Security & Privacy">
            <NavigationRow
              icon={Link2Icon}
              label="Connected Accounts"
              onClick={() => router.push("/settings/link-account" as any)}
            />
            <NavigationRow
              icon={LockKeyhole}
              label="Safety & Security"
              onClick={() => router.push("/settings/security" as any)}
            />
            <NavigationRow
              icon={KeyRoundIcon}
              label="Active Sessions"
              onClick={() => router.push("/settings/session-management" as any)}
            />
            <NavigationRow
              icon={Trash2Icon}
              label="Danger Zone"
              labelClassName="text-rose-600"
              iconContainerClassName="bg-rose-100 text-rose-600"
              onClick={() => router.push("/settings/danger" as any)}
            />
          </Section>
        </motion.div>

        {/* LOGOUT */}
        <motion.div variants={itemVariants} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full h-14 rounded-2xl gap-3 font-black uppercase tracking-[0.2em] shadow-lg shadow-rose-200 dark:shadow-rose-950/20"
          >
            <LogOut size={20} />
            {t("settings.logout", language)}
          </Button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="text-center space-y-2 opacity-50 pt-4"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Build Version {version}</p>
          <p className="text-[9px] font-medium italic">© {new Date().getFullYear()} {envClient.NEXT_PUBLIC_APP_NAME}. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div >
  );
}

function SettingsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Settings" />
      <div className="mx-auto max-w-4xl pb-32 mt-6 space-y-8 px-6">
        <div className="h-24 w-full animate-pulse rounded-2xl bg-muted" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse bg-muted rounded" />
          <div className="h-48 w-full animate-pulse rounded-2xl bg-muted" />
        </div>
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse bg-muted rounded" />
          <div className="h-64 w-full animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    </div>
  );
}

function NavigationRow({
  icon: Icon,
  label,
  onClick,
  labelClassName,
  iconContainerClassName
}: {
  icon: any,
  label: string,
  onClick: () => void,
  labelClassName?: string,
  iconContainerClassName?: string
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center gap-4 px-4 h-16 text-left"
    >
      <div className={cn("h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center", iconContainerClassName)}>
        <Icon size={16} />
      </div>
      <p className={cn("flex-1 font-semibold", labelClassName)}>{label}</p>
      <ChevronRight className="text-muted-foreground" />
    </motion.button>
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

function Row({ icon: Icon, label, children }: {
  icon: React.ElementType; label: string; children: React.ReactNode
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
