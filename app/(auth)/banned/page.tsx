"use client";

// Packages
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Lib
import { authClient } from "@/lib/auth/auth-client";
import { envClient } from "@/lib/env.client";

// Components
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function BannedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ banned?: boolean | null, banReason?: string | null, id?: string } | null>(null);

  // Priority: DB reason (if session exists) > URL reason (for failed logins) > generic fallback
  const displayReason = user?.banReason || searchParams.get("reason") || "Your account has been flagged for violating our terms of service.";

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data) {
        if (!session.data.user.banned) {
          router.push("/dashboard");
        } else {
          setUser(session.data.user);
        }
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md space-y-8 text-center">
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
          </div>
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row select-none bg-background overflow-hidden">
      
      {/* LEFT SIDE */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col justify-between w-full lg:w-1/2 px-6 sm:px-12 lg:px-20 py-8 relative z-10"
      >
        {/* LOGO + BRAND */}
        <motion.div
          variants={itemVariants as any}
          className="flex items-center gap-4 mb-8 group cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-lg group-hover:bg-primary/20 transition-colors" />
            <Image
              src="/images/logo/light_logo.svg"
              alt={envClient.NEXT_PUBLIC_APP_NAME}
              loading="eager"
              width={48}
              height={48}
              className="relative z-10 dark:hidden group-hover:rotate-12 transition-transform duration-500"
            />
            <Image
              src="/images/logo/dark_logo.svg"
              alt={envClient.NEXT_PUBLIC_APP_NAME}
              loading="eager"
              width={48}
              height={48}
              className="relative z-10 hidden dark:block group-hover:rotate-12 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col gap-0">
            <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-br from-foreground to-foreground/70 leading-none">
              {envClient.NEXT_PUBLIC_APP_NAME}
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">
              Finance
            </p>
          </div>
        </motion.div>

        {/* CENTER CONTENT AREA */}
        <div className="flex flex-col justify-center max-w-md mx-auto w-full py-12 lg:py-0">
          <motion.div variants={itemVariants as any} className="mb-8">
            <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mb-6 ring-8 ring-destructive/5 animate-pulse">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-3 text-destructive">
              Account Suspended
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Your access to the platform has been restricted due to a violation of our policies or security concerns.
            </p>
          </motion.div>

          <motion.div variants={itemVariants as any} className="space-y-6">
            <div className="bg-muted/30 border border-muted-foreground/10 p-6 rounded-[2rem] relative overflow-hidden group hover:bg-muted/40 transition-colors duration-500">
              <div className="absolute top-0 right-0 w-24 h-24 bg-destructive/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-3 ml-1">
                Reason for Suspension
              </h3>
              <p className="text-foreground text-lg font-medium leading-relaxed">
                {displayReason}
              </p>
            </div>

            <p className="text-sm text-muted-foreground font-medium px-2 leading-relaxed">
              If you believe this is a mistake, please reach out to our team at{" "}
              <a href="mailto:support@settlr.app" className="text-primary hover:underline font-bold">
                support@settlr.app
              </a>
              {" "}with your Reference ID.
            </p>

            <Link href="/login" onClick={async () => await authClient.signOut()} className="block">
              <Button 
                variant="outline" 
                className="relative rounded-2xl h-14 w-full text-lg font-bold border-muted-foreground/20 hover:bg-muted/50 transition-all duration-300 active:scale-[0.98] group"
              >
                <LogOut className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                Return to Login
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* FOOTER */}
        <motion.div variants={itemVariants as any} className="mt-12 text-center lg:text-left">
          {user?.id && (
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">
              REF ID: {user.id.slice(-12).toUpperCase()}
            </p>
          )}
        </motion.div>
      </motion.div>

      {/* RIGHT PANEL - Consistent with Login/Signup */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex w-1/2 p-12 items-center justify-center bg-linear-to-br from-destructive via-destructive/90 to-destructive/80 relative overflow-hidden rounded-l-[4rem] shadow-2xl"
      >
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 text-center px-12 text-white">
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-56 h-56 bg-white/5 backdrop-blur-3xl rounded-[4rem] flex flex-col items-center justify-center border border-white/10 shadow-2xl mx-auto mb-10 group relative"
          >
            <div className="absolute inset-0 bg-white/5 rounded-[4rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Image
              src="/images/logo/dark_logo.svg"
              alt={envClient.NEXT_PUBLIC_APP_NAME}
              loading="eager"
              width={140}
              height={140}
              className="relative z-10 group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl brightness-0 invert"
            />
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold mb-6 tracking-tight text-white"
          >
            Security is absolute.
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/90 leading-relaxed text-lg max-w-md mx-auto font-medium"
          >
            At {envClient.NEXT_PUBLIC_APP_NAME}, we maintain a safe environment for all our users. Restricted access ensures your data remains protected from unauthorized activities.
          </motion.p>
        </div>
      </motion.div>

    </div>
  );
}
