// Components
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Lib
import { auth } from "@/lib/auth";

// Components
import { Sidebar } from "@/components/sidebar";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="flex min-h-screen">
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-24 bg-background transition-[width] duration-300 ease-in-out">
          {children}
        </main>
      </div>
    </div>
  );
}
