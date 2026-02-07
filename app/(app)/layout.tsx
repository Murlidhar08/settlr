// Components
import { redirect } from "next/navigation";

// Lib
import { getUserSession } from "@/lib/auth";

// Components
import { Sidebar } from "@/components/sidebar";
import { getDefaultConfig, getUserConfig } from "@/lib/user-config";
import { UserConfigProvider } from "@/components/providers/user-config-provider";
import { LayoutTransitions } from "@/components/layout-transitions";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // User Config
  let userConfig = await getUserConfig()
  userConfig = userConfig ?? getDefaultConfig()

  const session = await getUserSession();

  if (!session)
    redirect("/login");

  return (
    <UserConfigProvider config={userConfig}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <div className="flex min-h-screen">
          {/* Fixed Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <LayoutTransitions>
            {children}
          </LayoutTransitions>
        </div>
      </div>
    </UserConfigProvider>
  );
}

