"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, ShieldCheck } from "lucide-react";

interface AdminStatsProps {
    totalUsers: number;
    activeUsers: number;
    bannedUsers: number;
    adminUsers: number;
}

export function AdminStats({ totalUsers, activeUsers, bannedUsers, adminUsers }: AdminStatsProps) {
    const stats = [
        {
            title: "Total Users",
            value: totalUsers,
            icon: <Users className="h-5 w-5 sm:h-7 sm:w-7 text-white" />,
            bgColor: "bg-indigo-600 dark:bg-indigo-500/90 shadow-indigo-500/20",
            glowColor: "bg-white/20",
            description: "Registered",
        },
        {
            title: "Active",
            value: activeUsers,
            icon: <UserCheck className="h-5 w-5 sm:h-7 sm:w-7 text-white" />,
            bgColor: "bg-emerald-600 dark:bg-emerald-500/90 shadow-emerald-500/20",
            glowColor: "bg-emerald-400/20",
            description: "Non-banned",
        },
        {
            title: "Banned",
            value: bannedUsers,
            icon: <UserX className="h-5 w-5 sm:h-7 sm:w-7 text-white" />,
            bgColor: "bg-rose-600 dark:bg-rose-500/90 shadow-rose-500/20",
            glowColor: "bg-rose-400/20",
            description: "Restricted",
        },
        {
            title: "Admins",
            value: adminUsers,
            icon: <ShieldCheck className="h-5 w-5 sm:h-7 sm:w-7 text-white" />,
            bgColor: "bg-slate-900 dark:bg-slate-950 shadow-slate-900/20",
            glowColor: "bg-indigo-500/30",
            description: "Privileged",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <div
                    key={stat.title}
                    className={`relative overflow-hidden rounded-3xl group p-5 sm:p-6 text-white shadow-2xl transition-all hover:-translate-y-1 border border-white/10 backdrop-blur-md ${stat.bgColor}`}
                >
                    <div className={`absolute -top-20 -right-20 h-48 w-48 rounded-full blur-3xl group-hover:scale-110 transition-all duration-700 ${stat.glowColor}`} />

                    <div className="relative z-10 flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">{stat.title}</p>
                            <p className="text-2xl font-black tracking-tighter sm:text-3xl">
                                {stat.value}
                            </p>
                        </div>
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                            {stat.icon}
                        </div>
                    </div>

                    <div className="relative z-10 mt-4 flex items-center gap-2">
                        <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                            <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">{stat.description}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
