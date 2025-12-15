"use client";

// Components
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="flex min-h-screen">
        {/* Fixed Sidebar */}
        <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />

        {/* Sidebar Spacer (ONLY for lg+) */}
        <div className={`hidden lg:block shrink-0 ${collapsed ? "w-20" : "w-64"}`} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-24 transition-[width] duration-300 ease-in-out lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
