// Components
import { redirect } from "next/navigation";

// Lib
import { getUserSession } from "@/lib/auth";

// Components
import { Sidebar } from "@/components/sidebar";
import { getDefaultConfig, getUserConfig } from "@/lib/user-config";
import { UserConfigProvider } from "@/components/providers/user-config-provider";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // User Config
  let userConfig = await getUserConfig()
  userConfig = userConfig ?? getDefaultConfig()

  const session = await getUserSession();

  if (!session)
    redirect("/login");

  return (
    <UserConfigProvider config={userConfig}>
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
    </UserConfigProvider>
  );
}
