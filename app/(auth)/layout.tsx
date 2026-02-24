import { ThemeToggle } from "@/components/theme-toggle";
import { BuildVersion } from "@/components/auth/build-version";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
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
