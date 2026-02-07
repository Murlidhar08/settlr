"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { TotpForm } from "./components/totp-form";
import { BackupCodeTab } from "./components/backup-code-tab";
import { ShieldCheck, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function TwoFactorPage() {
  const router = useRouter();
  const [showBackup, setShowBackup] = useState(false);

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data) router.push("/dashboard");
    });
  }, [router]);

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background select-none overflow-hidden text-foreground">

      {/* LEFT PANEL */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col justify-between w-full lg:w-1/2 px-6 sm:px-12 lg:px-20 py-8 relative z-10"
      >

        {/* LOGO */}
        <motion.div
          variants={itemVariants as any}
          className="flex items-center gap-3 mb-6 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
            <Wallet className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">Settlr</h1>
        </motion.div>

        {/* CENTER CARD */}
        <div className="flex flex-col justify-center max-w-md mx-auto w-full flex-1">
          <div className="space-y-8">
            <motion.div variants={itemVariants as any}>
              <h2 className="text-4xl font-bold tracking-tight mb-3">
                {showBackup ? "Backup Access" : "Security Check"}
              </h2>
              <p className="text-muted-foreground text-lg">
                {showBackup
                  ? "Enter one of your emergency recovery codes to sign in."
                  : "Your account is protected with two-factor authentication."}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants as any}
              className="bg-card p-1 sm:p-8 rounded-[2.5rem] border shadow-sm backdrop-blur-sm overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {!showBackup ? (
                  <motion.div
                    key="totp"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <TotpForm />

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-muted-foreground/10" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <button
                          onClick={() => setShowBackup(true)}
                          className="bg-background px-4 py-2 rounded-full text-muted-foreground font-bold tracking-widest border shadow-xs hover:bg-muted transition-colors"
                        >
                          Or use backup code
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="backup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <BackupCodeTab />

                    <div className="text-center">
                      <button
                        onClick={() => setShowBackup(false)}
                        className="text-primary font-bold hover:underline"
                      >
                        Back to App Code
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>


        {/* FOOTER */}
        <motion.div
          variants={itemVariants as any}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          Need help? <a href="#" className="font-bold text-primary hover:text-primary/80 transition-colors">Contact Support</a>
        </motion.div>
      </motion.div>

      {/* RIGHT PANEL */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex w-1/2 p-12 items-center justify-center bg-linear-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden rounded-l-[4rem] shadow-2xl"
      >
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 text-center px-12 text-white">
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-48 h-56 bg-white/10 backdrop-blur-3xl rounded-[3rem] flex flex-col items-center justify-center border border-white/20 shadow-2xl mx-auto mb-10 group"
          >
            <ShieldCheck className="w-20 h-20 text-white group-hover:scale-110 transition-transform duration-300" />
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold mb-6 tracking-tight text-white"
          >
            Extra Layer of Security
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/90 leading-relaxed text-lg max-w-md mx-auto font-medium"
          >
            By enabling 2FA, you ensure that only you can access your account, even if someone else knows your password.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}


