"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Wallet, Mail, EyeOff, Eye, ShieldCheck, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

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

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    authClient.getSession()
      .then((session) => {
        if (session.data) router.push("/dashboard");
      });
  }, [router])

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        email,
        name,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Signup failed");
      } else {
        toast.success("Registration successful! Please check your email for a link to confirm your account.")
        router.push("/login");
      }
    } catch (err) {
      setError("An error occurred during signup");
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
        className="flex flex-col justify-between w-full lg:w-1/2 px-6 sm:px-12 lg:px-20 py-8 relative z-10"
      >

        {/* LOGO TOP */}
        <motion.div variants={itemVariants as any} className="flex items-center gap-3 mb-6 group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
            <Wallet className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">Settlr</h1>
        </motion.div>

        {/* CENTER Form */}
        <div className="flex flex-col justify-center max-w-md mx-auto w-full py-12 lg:py-0">
          <motion.div variants={itemVariants as any} className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Join Settlr
            </h2>
            <p className="text-muted-foreground text-lg">
              Create an account to start managing your finances.
            </p>
          </motion.div>

          <motion.form variants={itemVariants as any} onSubmit={handleSubmit} className="space-y-5">

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
              {/* Name */}
              <div className="relative group">
                <Input
                  type="text"
                  placeholder="Full Name"
                  className="h-14 rounded-2xl pl-4 pr-12 transition-all duration-300 bg-muted/30 border-muted-foreground/10 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5" />
              </div>

              {/* Email */}
              <div className="relative group">
                <Input
                  type="email"
                  placeholder="Email"
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

              {/* Confirm Password */}
              <div className="relative group">
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="h-14 rounded-2xl pl-4 pr-12 transition-all duration-300 bg-muted/30 border-muted-foreground/10 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors group-focus-within:text-primary"
                >
                  {showConfirm ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              disabled={loading}
              type="submit"
              className="relative rounded-2xl h-14 w-full text-lg font-bold shadow-xl shadow-primary/10 hover:shadow-primary/25 transition-all duration-300 active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : "Create Account"}
            </Button>
          </motion.form>
        </div>

        {/* bottom link */}
        <motion.p variants={itemVariants as any} className="text-center text-muted-foreground mt-12 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
            Sign In
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
            Welcome to Settlr
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/90 leading-relaxed text-lg max-w-md mx-auto font-medium"
          >
            Start managing your bookkeeping securely and collaboratively with ease.
          </motion.p>
        </div>
      </motion.div>

    </div>
  );
}