"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { resetPassword } from "@/lib/auth-client";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenValue = searchParams.get("token");
    if (!tokenValue) {
      setError("Invalid or expired password reset token.");
    } else {
      setToken(tokenValue);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!token) {
      setError("Invalid reset token.");
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword({
        token,
        newPassword: password,
      });

      if (result.error) {
        setError(result.error.message || "Failed to reset password.");
      } else {
        setSuccessMsg("Password successfully reset! Redirecting...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Try again.");
      console.error(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background select-none">

      {/* LEFT PANEL */}
      <div className="relative flex flex-col justify-center w-full lg:w-1/2 px-6 sm:px-12 lg:px-20 py-10">

        {/* Back Button */}
        <button
          onClick={() => router.push("/login")}
          className="absolute top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="max-w-md mx-auto w-full mt-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Reset Your Password
          </h2>

          <p className="text-muted-foreground mb-8 hidden sm:block">
            Enter and confirm your new password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* New Password */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                className="h-12 rounded-xl pr-10 pl-4 focus:ring-2 focus:ring-primary/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!token}
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

            {/* Confirm Password */}
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                className="h-12 rounded-xl pr-10 pl-4 focus:ring-2 focus:ring-primary/50"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={!token}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
              >
                {showConfirm ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Success */}
            {successMsg && (
              <div className="rounded-lg bg-emerald-100 border border-emerald-300 p-3 text-sm text-emerald-700">
                {successMsg}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !token}
              className="rounded-full h-12 w-full text-base font-semibold hover:scale-[1.02] active:scale-[0.97] transition duration-150"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>

            <Button variant="outline" className="rounded-full h-12 w-full">
              <Link href="/login">Back to Login</Link>
            </Button>
          </form>
        </div>
      </div>

      {/* RIGHT PANEL (DESKTOP ONLY) */}
      <div className="
        hidden lg:flex w-1/2 p-10 items-center justify-center
        bg-linear-to-br from-primary to-primary/80 text-white relative overflow-hidden
        rounded-l-[3rem]
      ">
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm animate-pulse" />
        <div className="relative z-10 text-center px-10">
          <div className="w-40 h-48 bg-white/10 backdrop-blur-lg rounded-3xl flex flex-col items-center justify-center border border-white/20 shadow-xl mx-auto mb-6 hover:scale-[1.03] transition duration-200">
            <Lock className="w-14 h-14 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Secure Reset</h2>
          <p className="text-white/80 leading-relaxed text-sm max-w-md mx-auto">
            Your password reset process is protected and encrypted for safety.
          </p>
        </div>
      </div>
    </div>
  );
}
