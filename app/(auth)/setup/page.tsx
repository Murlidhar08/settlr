"use client";

// Lib
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { envClient } from "@/lib/env.client";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Mail, User, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { setupAdmin } from "@/actions/auth/setup";

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

export default function SetupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      await setupAdmin(formData);
      toast.success("Setup completed successfully! Please login with your new credentials.");
    } catch (err: any) {
      setError(err.message || "Setup failed");
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
              Initial Setup
            </p>
          </div>
        </motion.div>

        {/* CENTER Form */}
        <div className="flex flex-col justify-center max-w-md mx-auto w-full py-12 lg:py-0">
          <motion.div variants={itemVariants as any} className="mb-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4" />
              Administrator Setup
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Configure Your Instance
            </h2>
            <p className="text-muted-foreground text-lg">
              Create the first administrator account to start using {envClient.NEXT_PUBLIC_APP_NAME}.
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
                  placeholder="Administrator Name"
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
                  placeholder="Administrator Email"
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
                  placeholder="Master Password"
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
                  placeholder="Confirm Master Password"
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
                  Setting up instance...
                </div>
              ) : "Finish Setup"}
            </Button>
          </motion.form>
        </div>

        <motion.p variants={itemVariants as any} className="text-center text-muted-foreground mt-12 font-medium">
          Self-hosted instance of {envClient.NEXT_PUBLIC_APP_NAME}
        </motion.p>
      </motion.div>

      {/* RIGHT PANEL */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex w-1/2 p-12 items-center justify-center bg-linear-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden rounded-l-[4rem] shadow-2xl"
      >
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
            Complete the Setup
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/90 leading-relaxed text-lg max-w-md mx-auto font-medium"
          >
            You are just one step away from having your own private financial management system.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
