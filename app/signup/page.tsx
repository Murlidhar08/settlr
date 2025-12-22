"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wallet, Mail, EyeOff, Eye, ShieldCheck, User } from "lucide-react";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();

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
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred during signup");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background select-none">

      {/* LEFT PANEL */}
      <div className="flex flex-col justify-between w-full lg:w-1/2 px-6 sm:px-12 lg:px-20 py-8">

        {/* LOGO TOP */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
            <Wallet className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Settlr</h1>
        </div>

        {/* CENTER Form */}
        <div className="flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="mb-8 md:mb-4">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Create your account
            </h2>
            <p className="text-muted-foreground hidden sm:block">
              Sign up using email:
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Full Name"
                className="h-12 rounded-xl pl-4 pr-10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Email */}
            <div className="relative">
              <Input
                type="email"
                placeholder="Email"
                className="h-12 rounded-xl pl-4 pr-10"
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
                className="h-12 rounded-xl pl-4 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                className="h-12 rounded-xl pl-4 pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
              >
                {showConfirm ? <Eye /> : <EyeOff />}
              </button>
            </div>

            <Button
              disabled={loading}
              type="submit"
              className="rounded-full h-12 w-full font-semibold hover:scale-[1.02] active:scale-[0.97] transition"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </div>

        {/* bottom link */}
        <p className="text-center text-sm mt-10">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="hidden lg:flex w-1/2 p-10 items-center justify-center bg-linear-to-br from-primary to-primary/80 text-white relative overflow-hidden rounded-l-[3rem]">
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm animate-pulse" />
        <div className="relative z-10 text-center px-10">
          <div className="w-40 h-48 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center border border-white/20 shadow-xl mx-auto mb-6 hover:scale-[1.03] transition">
            <ShieldCheck className="w-14 h-14 text-white" />
          </div>

          <h2 className="text-3xl font-bold mb-3">Welcome to Settlr</h2>
          <p className="text-white/80 text-sm max-w-md mx-auto leading-relaxed">
            Start managing your bookkeeping securely and collaboratively with ease.
          </p>
        </div>
      </div>
    </div>
  );
}
