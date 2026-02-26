// Packages
import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import type { Viewport } from 'next'
import { ThemeProvider } from "next-themes";

// Style
import "./globals.css";

// Lib
import { envClient } from "@/lib/env.client";

// Components
import { ConfirmProvider } from "@/components/providers/confirm-provider";
import AppIconsMetaTags from "@/components/app-icons-metatags";
import NextTopLoader from 'nextjs-toploader';
import QueryProvider from "@/components/providers/query-provider";


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
    { media: '(prefers-color-scheme: light)', color: 'white' },
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
    title: envClient.NEXT_PUBLIC_APP_NAME,
  },
  icons: {
    icon: [
      { url: "images/logo/maskable_icon_x192.png", sizes: "192x192", type: "image/png" },
      { url: "images/logo/maskable_icon_x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "images/logo/maskable_icon_x192.png",
  },
};


export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={nunitoSans.variable} suppressHydrationWarning>
      <head>
        <AppIconsMetaTags />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader
            color="oklch(0.541 0.281 293.009)"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px oklch(0.541 0.281 293.009),0 0 5px oklch(0.541 0.281 293.009)"
          />
          <ConfirmProvider>
            <QueryProvider>
              {children}
            </QueryProvider>

            {/* Toast Container */}
            <Toaster
              position="top-right"
              expand={false}
            />
          </ConfirmProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


