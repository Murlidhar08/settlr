"use client";

// Packages
import { useEffect, useState } from "react";
import { Wallet, Mail, EyeOff, Eye, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Lib
import { authClient, signIn, signInWithDiscord, signInWithGoogle } from "@/lib/auth-client";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
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

  return (
    <div className="min-h-screen flex flex-col lg:flex-row select-none">

      {/* LEFT SIDE */}
      <div className="flex flex-col justify-between w-full lg:w-1/2 px-6 sm:px-12 lg:px-20 py-8">

        {/* LOGO + BRAND – Always at top */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
            <Wallet className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Settlr</h1>
        </div>

        {/* CENTER FORM AREA */}
        <div className="flex flex-col justify-center max-w-md mx-auto w-full">

          <div className="mb-8 md:mb-4">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Login to your account
            </h2>

            <p className="text-muted-foreground hidden sm:block">
              Welcome back! Select a method to sign in:
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Input
                type="email"
                placeholder="Email"
                className="h-12 rounded-xl pl-4 pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/50 active:scale-[0.99]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Password */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="h-12 rounded-xl pl-4 pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/50 active:scale-[0.99]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>

            {/* Forgot */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline hover:opacity-90 transition"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="relative rounded-full h-12 w-full text-base font-semibold hover:scale-[1.02] active:scale-[0.97] transition-all duration-150"
            >
              {loading ? "Signing in..." : "Sign In"}
              {lastLogin === "email" && (
                <Badge variant={"outline"} className="absolute bg-white -top-3 -right-1">Last used</Badge>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-muted-foreground/40 to-transparent" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              or sign in with
            </span>
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-muted-foreground/40 to-transparent" />
          </div>

          {/* Social Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={handleGoogle}
              variant="outline"
              className="relative rounded-full h-12 px-6 flex items-center gap-2 hover:scale-[1.03] active:scale-[0.97] transition"
            >
              <Image src="/google.svg" alt="Google" width={20} height={20} />
              <span className="hidden md:block">Sign in with Google</span>

              {lastLogin === "google" && (
                <Badge className="absolute -top-3 -right-1">Last used</Badge>
              )}
            </Button>

            <Button
              onClick={handleDiscordLogin}
              variant="outline"
              className="relative rounded-full h-12 px-6 flex items-center gap-2 hover:scale-[1.03] active:scale-[0.97] transition"
            >
              <Image src="/discord.svg" alt="Discord" width={20} height={20} />
              <span className="hidden md:block">Sign in with Discord</span>

              {lastLogin === "discord" && (
                <Badge className="absolute -top-3 -right-1">Last used</Badge>
              )}
            </Button>
          </div>
        </div>

        {/* SIGN UP — Always at bottom */}
        <p className="text-center text-sm mt-10">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="hidden lg:flex w-1/2 p-10 items-center justify-center bg-linear-to-br from-primary to-primary/80 text-white relative overflow-hidden rounded-l-[3rem]">
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm animate-pulse" />
        <div className="relative z-10 text-center px-10">
          <div className="w-40 h-48 bg-white/10 backdrop-blur-lg rounded-3xl flex flex-col items-center justify-center border border-white/20 shadow-xl mx-auto mb-6 hover:scale-[1.03] transition-transform duration-200">
            <ShieldCheck className="w-14 h-14 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Secure. Reliable. Simple.</h2>
          <p className="text-white/80 leading-relaxed text-sm max-w-md mx-auto">
            Settlr ensures enterprise-grade identity protection while keeping your bookkeeping experience intuitive.
          </p>
        </div>
      </div>
    </div>
  );
}
