// Packages
import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import type { Viewport } from 'next'

// Style
import "./globals.css";

// Lib
import { getUserSession } from "@/lib/auth";
import { ThemeMode } from "@/lib/generated/prisma/enums";
import { ThemeProvider } from "@/components/theme-provider";
import { envClient } from "@/lib/env.client";

const nunitoSans = Nunito_Sans({
  variable: '--font-sans',
  subsets: ["latin"]
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'cyan' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export const metadata: Metadata = {
  title: envClient.NEXT_PUBLIC_APP_NAME,
  description: envClient.NEXT_PUBLIC_APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Settlr",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/icon-192x192.png",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const data = await getUserSession();
  const theme = data?.session.userSettings.theme ?? ThemeMode.LIGHT;

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
