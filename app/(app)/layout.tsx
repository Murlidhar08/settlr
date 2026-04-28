// Components
import { redirect } from "next/navigation";

// Lib
import { getUserSession } from "@/lib/auth/auth";
import { isSetupRequired } from "@/lib/setup";

// Components
import { AppHeader } from "@/components/app-header";
import { ImpersonationIndicator } from "@/components/auth/impersonation-indicator";
import { LayoutTransitions } from "@/components/layout-transitions";
import { UserConfigProvider } from "@/components/providers/user-config-provider";
import { Sidebar } from "@/components/sidebar";
import { getDefaultConfig, getUserConfig } from "@/lib/user-config";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Check if setup is needed
  if (await isSetupRequired()) {
    redirect("/setup" as any);
  }

  // User Config
  let userConfig = await getUserConfig()
  userConfig = userConfig ?? getDefaultConfig()

  const session = await getUserSession();

  if (!session)
    redirect("/login" as any);

  if (session.user.banned)
    redirect("/banned" as any);

  return (
    <UserConfigProvider config={userConfig}>
      <div className="h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden">
        <div className="flex h-full">
          {/* Fixed Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 h-full">
            <AppHeader initialSession={session} />
            <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
              <LayoutTransitions>
                {children}
              </LayoutTransitions>
            </div>
          </div>
        </div>
        <ImpersonationIndicator />
      </div>
    </UserConfigProvider>
  );
}

