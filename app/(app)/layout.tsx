// Components
import { redirect } from "next/navigation";

// Lib
import { getUserSession } from "@/lib/auth";

// Components
import { Sidebar } from "@/components/sidebar";
import { AppHeader } from "@/components/app-header";
import { getDefaultConfig, getUserConfig } from "@/lib/user-config";
import { UserConfigProvider } from "@/components/providers/user-config-provider";
import { LayoutTransitions } from "@/components/layout-transitions";
import { ImpersonationIndicator } from "@/components/auth/impersonation-indicator";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // User Config
  let userConfig = await getUserConfig()
  userConfig = userConfig ?? getDefaultConfig()

  const session = await getUserSession();

  if (!session)
    redirect("/login");

  return (
    <UserConfigProvider config={userConfig}>
      <div className="h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden">
        <div className="flex h-full">
          {/* Fixed Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 h-full">
            <AppHeader />
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

