"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, ShieldAlert, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 } as any,
  },
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const result = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (result.error) {
        setError(result.error.message || "Failed to send reset email");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background select-none overflow-hidden">

      {/* LEFT PANEL */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col w-full lg:w-1/2 px-6 sm:px-12 lg:px-20 py-8 relative z-10"
      >

        {/* Back */}
        <motion.button
          variants={itemVariants}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-12 group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </motion.button>

        {/* Center Card */}
        <div className="flex flex-col justify-center max-w-md mx-auto w-full flex-1">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <motion.div variants={itemVariants}>
                  <h1 className="text-4xl font-bold tracking-tight mb-3">
                    Forgot Password?
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    No worries — we’ll send you instructions to reset it.
                  </p>
                </motion.div>

                <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative group">
                    <Input
                      type="email"
                      placeholder="Email Address"
                      className="h-14 rounded-2xl pl-4 pr-12 transition-all duration-300 bg-muted/30 border-muted-foreground/10 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5" />
                  </div>

                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20 flex items-center gap-3"
                      >
                        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    className="relative rounded-2xl h-14 w-full text-lg font-bold shadow-xl shadow-primary/10 hover:shadow-primary/25 transition-all duration-300 active:scale-[0.98]"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Sending...
                      </div>
                    ) : "Send Reset Link"}
                  </Button>

                  <div className="text-center">
                    <Link
                      href="/login"
                      className="text-primary font-bold hover:text-primary/80 transition-colors"
                    >
                      Return to Login
                    </Link>
                  </div>
                </motion.form>
              </motion.div>
            ) : (
              /* SUCCESS STATE */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8 text-center"
              >
                <div className="flex justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                    className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center shadow-inner"
                  >
                    <ShieldCheck className="w-12 h-12 text-primary" />
                  </motion.div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-3xl font-bold tracking-tight">Check your email</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-sm mx-auto">
                    If an account exists with <strong>{email}</strong>, a reset link
                    has been sent. Follow the instructions to set a new password.
                  </p>
                </div>

                <Button
                  className="rounded-2xl h-14 w-full font-bold text-lg shadow-xl shadow-primary/10"
                  onClick={() => router.push("/login")}
                >
                  Back to Login
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-48 h-56 bg-white/10 backdrop-blur-3xl rounded-[3rem] flex flex-col items-center justify-center border border-white/20 shadow-2xl mx-auto mb-10 group"
          >
            <ShieldAlert className="w-20 h-20 text-white group-hover:scale-110 transition-transform duration-300" />
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold mb-6 tracking-tight text-white"
          >
            Password recovery made simple.
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/90 leading-relaxed text-lg max-w-md mx-auto font-medium"
          >
            Settlr ensures secure & seamless identity recovery while keeping
            your bookkeeping data protected.
          </motion.p>
        </div>
      </motion.div>

    </div>
  );
}
