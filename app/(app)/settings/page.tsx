"use client";

import { useEffect, useRef, useState } from "react";
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
import { Currency, PaymentMode, ThemeMode } from "@/lib/generated/prisma/enums";
import { getCredientialAccounts, getAppVersion, getListSessions, upsertUserSettings } from "@/actions/user-settings.actions";
import { useSession } from "@/lib/auth-client";
import { Session } from "@/lib/generated/prisma/client";
import { SecurityModal } from "./components/security-modal";
import { SessionModal } from "./components/session-modal";
import { LinkAccountModal } from "./components/link-account-modal";
import { DangerModal } from "./components/danger-modal";
import { auth } from "@/lib/auth";
import { getInitials } from "@/utility/party";
import { useUserConfig } from "@/components/providers/user-config-provider";

type userAccount = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number]

export default function SettingsPage() {
  const router = useRouter();
  const userConfig = useUserConfig()
  const { data: session, isPending } = useSession();

  const [currency, setCurrency] = useState<Currency>(userConfig.currency);
  const [dateFormat, setDateFormat] = useState(userConfig.dateFormat);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(userConfig.defaultPayment);
  const [theme, setTheme] = useState<ThemeMode>(userConfig.theme);

  const [sessionsList, setSessionsList] = useState<Session[]>([])
  const [currAccount, setCurrAccount] = useState<userAccount[]>([])
  const [version, setVersion] = useState<string>("Pending ...");

  const initialized = useRef(false);

  // 2. Sync state when session loads
  useEffect(() => {
    if (isPending) return;
    if (initialized.current) return;

    getListSessions()
      .then(res => {
        if (!res) return
        setSessionsList(res as Session[])
      })

    getCredientialAccounts()
      .then(res => {
        if (!res) return
        setCurrAccount(res as userAccount[])
      })

    getAppVersion()
      .then(res => {
        setVersion(res);
      })

    initialized.current = true;
  }, [isPending, session]);

  if (isPending)
    return <h1>Loading ...</h1>;

  // ----------
  // Const
  const currencyLabel: Record<Currency, string> = {
    USD: "USD ($)",
    INR: "INR (₹)",
    EUR: "EUR (€)",
  };

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
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Settings" />

      <div className="mx-auto max-w-4xl pb-32 mt-6 space-y-8 px-6">
        {/* USER */}
        <motion.div
          onClick={() => { router.push("/account") }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-4 p-4 rounded-2xl bg-background border shadow-sm cursor-pointer"
        >
          <Avatar className="h-16 w-16 ring-2 ring-background transition-transform hover:scale-105">
            <AvatarImage
              src={session?.user?.image ?? undefined}
              alt={session?.user?.name ?? "User avatar"}
            />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
              {getInitials(session?.user?.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <p className="font-bold text-lg">
              {session?.user?.name ?? "Unknown"}
            </p>
            <p className="text-sm text-muted-foreground">
              {session?.user?.email ?? "Unknown"}
            </p>
          </div>
          <ChevronRight className="text-muted-foreground" />
        </motion.div>

        {/* GENERAL */}
        <Section title="General Preferences">
          <Row icon={DollarSign} label="Currency">
            <Select
              value={currency}
              onValueChange={(value) => {
                if (!value) return

                const v = value as Currency
                setCurrency(v)

                // fire-and-forget async side-effect
                upsertUserSettings({ currency: v })
              }}
            >
              <SelectTrigger className="w-30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Currency).map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currencyLabel[currency]}
                  </SelectItem>
                ))}
              </SelectContent>

            </Select>
          </Row>

          <Row icon={Calendar} label="Date Format">
            <Select
              value={dateFormat}
              onValueChange={(value) => {
                if (!value) return

                setDateFormat(value)

                void upsertUserSettings({
                  dateFormat: value,
                })
              }}
            >
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
            <Select
              value={paymentMode}
              onValueChange={(value) => {
                if (!value) return

                const v = value as PaymentMode
                setPaymentMode(v)

                void upsertUserSettings({
                  defaultPayment: v,
                })
              }}
            >
              <SelectTrigger className="w-30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PaymentMode).map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {mode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Row>
        </Section>

        {/* SECURITY */}
        <Section title="Security">
          {/* Link Account */}
          <LinkAccountModal
            currentAccounts={currAccount}
          />

          {/* Security */}
          <SecurityModal
            email={session?.user.email ?? ""}
            isTwoFactorEnabled={session?.user?.twoFactorEnabled ?? false}
          />

          {/* Sessions */}
          <SessionModal
            sessions={sessionsList}
            currentSessionToken={session?.session.token}
          />

          {/* Danger */}
          <DangerModal />
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
                <div className="flex gap-1 bg-muted rounded-xl p-1">
                  <Button
                    variant={theme === ThemeMode.AUTO ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-1 rounded-lg text-xs font-semibold hover:bg-white hover:shadow",
                      theme === ThemeMode.AUTO && "bg-background shadow"
                    )}
                    onClick={async () => {
                      setTheme(ThemeMode.AUTO);
                      await upsertUserSettings({ theme: ThemeMode.AUTO });
                    }}
                  >
                    <Laptop size={16} />
                    Auto
                  </Button>

                  <Button
                    variant={theme === ThemeMode.LIGHT ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-1 rounded-lg text-xs font-semibold hover:bg-white hover:shadow",
                      theme === ThemeMode.LIGHT && "bg-background shadow"
                    )}
                    onClick={async () => {
                      setTheme(ThemeMode.LIGHT);
                      await upsertUserSettings({ theme: ThemeMode.LIGHT });
                    }}
                  >
                    <Sun size={16} />
                    Light
                  </Button>

                  <Button
                    variant={theme === ThemeMode.DARK ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-1 rounded-lg text-xs font-semibold hover:bg-white hover:shadow",
                      theme === ThemeMode.DARK && "bg-background"
                    )}
                    onClick={async () => {
                      setTheme(ThemeMode.DARK);
                      await upsertUserSettings({ theme: ThemeMode.DARK });
                    }}
                  >
                    <Moon size={16} />
                    Dark
                  </Button>
                </div>

              </div>
            </motion.div>
          </div>
        </Section>

        {/* DATA MANAGEMENT */}
        {/* TODO: PENDING DATA BACKUP*/}
        <div className="hidden">
          <Section title="Data Management">
            <ActionRow icon={CloudUpload} title="Backup Data" subtitle="Synced just now" />
            <ActionRow icon={Download} title="Export Transactions" />
          </Section>
        </div>

        {/* SUPPORT */}
        {/* TODO: PENDING DATA BACKUP*/}
        <div className="hidden">
          <Section title="Support">
            <LinkRow label="Help Center" />
            <LinkRow label="Privacy Policy" />
          </Section>
        </div>

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
          Build Version {version}
        </div>
      </div>
    </div >
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

function ActionRow({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
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
