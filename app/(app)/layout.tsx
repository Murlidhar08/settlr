import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Lib
import { getUserSession } from "@/lib/auth/auth";
import { isSetupRequired } from "@/lib/setup";

// Components
import { ImpersonationIndicator } from "@/components/auth/impersonation-indicator";
import { LayoutTransitions } from "@/components/layout-transitions";
import DesktopNav from "@/components/navbar/desktop-nav";
import { UserConfigProvider } from "@/components/providers/user-config-provider";
import { getDefaultConfig, getUserConfig } from "@/lib/user-config";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Check if setup is needed
  if (await isSetupRequired()) {
    redirect("/setup" as any);
  }

  // User Config
  let userConfig = await getUserConfig()
  userConfig = userConfig ?? getDefaultConfig()

  // Get session on the server
  const session = await getUserSession();

  if (session.user.banned)
    redirect("/banned" as any);

  return (
    <UserConfigProvider config={userConfig}>
      <div className="h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden">
        <div className="flex h-full">
          <DesktopNav />

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overflow-x-hidden">
            <LayoutTransitions>
              {children}
            </LayoutTransitions>
          </div>
        </div>

        {/* Only when admin is impersonating */}
        <ImpersonationIndicator />
      </div>
    </UserConfigProvider >
  );
}

