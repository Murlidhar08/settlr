import { getUserSession } from "@/lib/auth/auth";
import { ShieldAlert } from "lucide-react";
import { Suspense } from "react";
import { AdminContent } from "./components/admin-content";
import { AdminSkeleton } from "./components/admin-skeleton";

export default async function AdminPage() {
    const session = await getUserSession();

    // Guard: Only admins can access this page
    if (session?.user.role !== "admin") {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="relative">
                    <div className="absolute -inset-8 bg-rose-500/10 rounded-full blur-3xl" />
                    <div className="relative p-6 bg-rose-500/5 rounded-2xl border border-rose-500/20 shadow-sm">
                        <ShieldAlert className="text-rose-500 h-12 w-12" strokeWidth={1.5} />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Access Restricted</h2>
                    <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
                        You do not have the necessary permissions to access this administrative resource.
                    </p>
                </div>
                <a href="/dashboard">
                    <button className="px-10 py-3 bg-foreground text-background font-semibold rounded-xl hover:shadow-lg transition-all active:scale-[0.98] text-[11px] uppercase tracking-widest">
                        Return to Dashboard
                    </button>
                </a>
            </div>
        );
    }

    return (
        <Suspense fallback={<AdminSkeleton />}>
            <AdminContent />
        </Suspense>
    );
}
