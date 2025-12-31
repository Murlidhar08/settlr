// Packages
import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"

// Style
import "./globals.css";
import { getUserSession } from "@/lib/auth";
import { ThemeMode } from "@/lib/generated/prisma/enums";
import { ThemeProvider } from "@/components/theme-provider";

const nunitoSans = Nunito_Sans({ variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Settlr",
  description: "Settlr for managing personal finance",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const data = await getUserSession();
  const theme = data?.user?.settings?.theme ?? ThemeMode.AUTO;

  return (
    <html lang="en" className={nunitoSans.variable} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background ${theme}`}>
        <ThemeProvider theme={theme}>
          {children}

          {/* Toast Container */}
          <Toaster
            position="top-right"
            expand={false}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
