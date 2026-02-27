"use client";

import { motion } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    Settings,
    LogOut,
    Edit3,
    ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient, signOut, useSession } from "@/lib/auth-client";
import { getInitials } from "@/utility/party";
import { BackHeader } from "@/components/back-header";
import { FooterButtons } from "@/components/footer-buttons";

export default function ProfilePage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    const handleLogout = async () => {
        try {
            await signOut();
            toast.success("Logged out successfully");
            router.replace("/login");
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    if (isPending) return <ProfileSkeleton />;

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
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="w-full bg-background pb-32">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto max-w-lg px-6 mt-8 space-y-8"
            >
                {/* Profile Card */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center gap-4 p-8 rounded-[2.5rem] bg-card border shadow-sm relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-br from-primary/10 to-transparent" />

                    <div className="relative group">
                        <Avatar className="h-28 w-28 ring-4 ring-background shadow-xl transition-transform duration-500 group-hover:scale-105">
                            <AvatarImage
                                src={session?.user?.image ?? undefined}
                                alt={session?.user?.name}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary text-3xl font-black">
                                {getInitials(session?.user?.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
                    </div>

                    <div className="text-center space-y-1 relative z-10">
                        <h1 className="text-3xl font-black tracking-tight">{session?.user?.name}</h1>
                        <p className="text-muted-foreground font-medium opacity-70 italic">@{session?.user?.name?.toLowerCase().replace(/\s+/g, '')}</p>
                    </div>
                </motion.div>

                {/* Details Section */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <DetailRow
                        icon={User}
                        label="Full Name"
                        value={session?.user?.name || "Not set"}
                    />
                    <DetailRow
                        icon={Mail}
                        label="Email Address"
                        value={session?.user?.email || "Not set"}
                    />
                    <DetailRow
                        icon={Phone}
                        label="Phone Number"
                        value={session?.user?.contactNo || "Not set"}
                    />
                </motion.div>

                {/* Actions Section */}
                <FooterButtons>
                    <div className="flex flex-col sm:flex-row gap-3 w-[calc(100vw-2.5rem)] max-w-lg">
                        <Button
                            onClick={() => router.push("/edit-profile" as any)}
                            className="flex-1 h-14 rounded-2xl gap-3 font-black uppercase tracking-[0.1em] shadow-xl shadow-primary/20 transition-all hover:shadow-2xl active:scale-[0.98]"
                        >
                            <Edit3 size={18} />
                            Edit Profile
                        </Button>

                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="flex-1 h-14 rounded-2xl gap-3 font-black uppercase tracking-[0.1em] border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300"
                        >
                            <LogOut size={18} />
                            Logout
                        </Button>
                    </div>
                </FooterButtons>
            </motion.div>
        </div>
    );
}

function DetailRow({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-center gap-4 p-5 rounded-3xl bg-card/50 border shadow-xs group hover:bg-card hover:shadow-md transition-all duration-300">
            <div className="h-12 w-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/60">{label}</p>
                <p className="font-bold text-base leading-tight">{value}</p>
            </div>
        </div>
    );
}

function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <BackHeader title="Profile" />
            <div className="mx-auto max-w-lg px-6 mt-8 space-y-8">
                <div className="h-64 w-full animate-pulse rounded-[2.5rem] bg-muted" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 w-full animate-pulse rounded-3xl bg-muted" />
                    ))}
                </div>
                <div className="space-y-4">
                    <div className="h-16 w-full animate-pulse rounded-2xl bg-muted" />
                    <div className="h-16 w-full animate-pulse rounded-2xl bg-muted" />
                </div>
            </div>
        </div>
    );
}
