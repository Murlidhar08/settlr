import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Lib
import { getUserSession } from "@/lib/auth/auth";
import { isSetupRequired } from "@/lib/setup";

// Components
import { ImpersonationIndicator } from "@/components/auth/impersonation-indicator";
import { LayoutTransitions } from "@/components/layout-transitions";
import { NavBar } from "@/components/navbar/nav-bar";
import { UserConfigProvider } from "@/components/providers/user-config-provider";
import { UserStatus } from "@/lib/generated/prisma/enums";
import { getDefaultConfig, getUserConfig } from "@/lib/user-config";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Check if setup is needed
  if (await isSetupRequired()) {
    redirect("/setup" as any);
  }

  // User Config
  const userConfig = await getUserConfig() ?? getDefaultConfig()
  const session = await getUserSession();
  if (!session?.user) {
    redirect("/login" as any);
  }
  const status = session.user.status;

  // Handle Redirection based on status
  if (session.user.banned) redirect("/banned");
  if (status === UserStatus.pendingapproval) redirect("/pending-approval");
  if (status === UserStatus.suspended) redirect("/suspended");

  return (
    <UserConfigProvider config={userConfig}>
      <div className="h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden">
        <div className="flex h-full">
          <NavBar />

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

