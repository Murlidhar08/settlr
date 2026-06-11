"use client";

import { useSession } from "@/lib/auth/auth-client";
import { UserRole } from "@/lib/generated/prisma/enums";
import { tran } from "@/lib/languages/i18n";
import { LandmarkIcon, LayoutDashboard, Settings, User2Icon, UserRoundCog, Wallet } from "lucide-react";
import { TabItem } from "./tab-item";

export const useNavItems = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === UserRole.admin;

  const navItems: TabItem[] = [
    { id: "dashboard", label: tran("dashboard.title"), icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { id: "accounts", label: tran("accounts.title"), icon: <LandmarkIcon size={20} />, href: "/accounts" },
    { id: "parties", label: tran("parties.title"), icon: <User2Icon size={20} />, href: "/parties" },
    { id: "cashbook", label: tran("cashbook.title"), icon: <Wallet size={20} />, href: "/cashbook" },
    { id: "settings", label: tran("settings.title"), icon: <Settings size={20} />, href: "/settings" },
    ...(isAdmin ? [{ id: "admin", label: tran("admin.title"), icon: <UserRoundCog size={20} />, href: "/admin" }] : []),
  ];

  return navItems;
};