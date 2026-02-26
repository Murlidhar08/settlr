"use client";

// Packages
import { useEffect, useState } from "react";
import { Mail, EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Lib
import { authClient, signIn, signInWithDiscord, signInWithGoogle } from "@/lib/auth-client";
import { envClient } from "@/lib/env.client";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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

interface LoginFormProps {
  providers: {
    google: boolean;
    discord: boolean;
  };
}

export default function LoginForm({ providers }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lastLogin, setLastLogin] = useState("");

  // Redirect to dashboard
  useEffect(() => {
    authClient.getSession()
      .then((session) => {
        if (session.data)
          router.push("/dashboard");
      });

    // Last Login Method
    setLastLogin(authClient.getLastUsedLoginMethod() || "");
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({ email, password });
      if (result.error) setError(result.error.message || "Sign in failed");
      else router.push("/dashboard");
    } catch (err) {
      setError("An error occurred during sign in");
      console.error(err)
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await signInWithGoogle();
  };

  const handleDiscordLogin = async () => {
    await signInWithDiscord();
  }

  const hasSocialLogin = providers.google || providers.discord;

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
              width={48}
              height={48}
              className="relative z-10 dark:hidden group-hover:rotate-12 transition-transform duration-500"
            />
            <Image
              src="/images/logo/dark_logo.svg"
              alt={envClient.NEXT_PUBLIC_APP_NAME}
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

        {/* CENTER FORM AREA */}
        <div className="flex flex-col justify-center max-w-md mx-auto w-full py-12 lg:py-0">

          <motion.div variants={itemVariants as any} className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Welcome Back
            </h2>
            <p className="text-muted-foreground text-lg">
              Sign in to manage your finances.
            </p>
          </motion.div>

          <motion.form variants={itemVariants as any} onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20 flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {/* Email */}
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

              {/* Password */}
              <div className="relative group">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="h-14 rounded-2xl pl-4 pr-12 transition-all duration-300 bg-muted/30 border-muted-foreground/10 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors group-focus-within:text-primary"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="relative rounded-2xl h-14 w-full text-lg font-bold shadow-xl shadow-primary/10 hover:shadow-primary/25 transition-all duration-300 active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : "Sign In"}
              {lastLogin === "email" && (
                <Badge variant="secondary" className="absolute -top-3 -right-2 px-3 py-1 bg-background border-primary/20 text-primary shadow-sm">Last used</Badge>
              )}
            </Button>
          </motion.form>

          {hasSocialLogin && (
            <>
              <motion.div variants={itemVariants as any} className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted-foreground/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-4 text-muted-foreground font-medium tracking-widest">
                    Continue with
                  </span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants as any} className={`grid ${providers.google && providers.discord ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                {providers.google && (
                  <Button
                    onClick={handleGoogle}
                    variant="outline"
                    className="relative rounded-2xl h-14 px-6 flex items-center justify-center gap-3 hover:bg-muted/50 border-muted-foreground/10 transition-all duration-300 active:scale-[0.98]"
                  >
                    <Image src="/google.svg" alt="Google" width={22} height={22} />
                    <span className="font-semibold">Google</span>
                    {lastLogin === "google" && (
                      <Badge variant="secondary" className="absolute -top-3 -right-2 px-3 py-1 bg-background border-primary/20 text-primary shadow-sm">Last used</Badge>
                    )}
                  </Button>
                )}

                {providers.discord && (
                  <Button
                    onClick={handleDiscordLogin}
                    variant="outline"
                    className="relative rounded-2xl h-14 px-6 flex items-center justify-center gap-3 hover:bg-muted/50 border-muted-foreground/10 transition-all duration-300 active:scale-[0.98]"
                  >
                    <Image src="/discord.svg" alt="Discord" width={22} height={22} />
                    <span className="font-semibold">Discord</span>
                    {lastLogin === "discord" && (
                      <Badge variant="secondary" className="absolute -top-3 -right-2 px-3 py-1 bg-background border-primary/20 text-primary shadow-sm">Last used</Badge>
                    )}
                  </Button>
                )}
              </motion.div>
            </>
          )}
        </div>

        {/* SIGN UP */}
        <motion.p variants={itemVariants as any} className="text-center text-muted-foreground mt-12">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-primary hover:text-primary/80 transition-colors">
            Sign Up
          </Link>
        </motion.p>
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
              width={140}
              height={140}
              className="relative z-10 group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
            />
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold mb-6 tracking-tight text-white"
          >
            Secure. Reliable. Simple.
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/90 leading-relaxed text-lg max-w-md mx-auto font-medium"
          >
            {envClient.NEXT_PUBLIC_APP_NAME} ensures enterprise-grade identity protection while keeping your bookkeeping experience intuitive.
          </motion.p>
        </div>
      </motion.div>

    </div>
  );
}
