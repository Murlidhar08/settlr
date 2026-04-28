import { BuildVersion } from "@/components/auth/build-version";
import { ThemeToggle } from "@/components/theme-toggle";
import { isSetupRequired } from "@/lib/setup";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || "";

  // Check if setup is needed
  if (pathname !== "/setup" && await isSetupRequired()) {
    redirect("/setup" as any);
  }

  // If setup is NOT needed and user is trying to access /setup, redirect to login
  if (pathname === "/setup" && !await isSetupRequired()) {
    redirect("/login" as any);
  }
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="min-h-screen flex items-center justify-center">
        {children}
      </div>
      <BuildVersion />
    </div>
  );
}
