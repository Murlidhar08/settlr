"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Mail, ShieldAlert, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen flex flex-col lg:flex-row bg-background select-none">

      {/* LEFT PANEL */}
      <div className="flex flex-col w-full lg:w-1/2 px-6 sm:px-12 lg:px-20 py-8 relative">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Center Card */}
        <div className="flex flex-col justify-center max-w-md mx-auto w-full mt-20">
          {!success ? (
            <div className="space-y-6 animate-fade-in">

              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Forgot password?
              </h1>

              <p className="text-muted-foreground text-sm">
                No worries — we’ll send you instructions to reset it.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="relative">
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="
                      h-12 rounded-xl pl-4 pr-10
                      transition-all duration-200
                      focus:ring-2 focus:ring-primary/50 active:scale-[0.99]
                    "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>

                {error && (
                  <Alert className="border-destructive/40 bg-destructive/10 text-destructive text-sm">
                    <ShieldAlert className="w-4 h-4 mr-2" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="rounded-full h-12 w-full font-semibold hover:scale-[1.02] active:scale-[0.97] transition"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>

                <div className="text-center text-sm">
                  <Link
                    href="/login"
                    className="text-primary font-medium hover:underline"
                  >
                    Return to Login
                  </Link>
                </div>
              </form>
            </div>
          ) : (
            /* SUCCESS STATE */
            <div className="space-y-6 text-center animate-fade-in">

              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
              </div>

              <h2 className="text-xl font-semibold">Check your email</h2>

              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                If an account exists with <strong>{email}</strong>, a reset link
                has been sent. Follow the instructions to set a new password.
              </p>

              <Button
                className="rounded-full h-12 w-full font-semibold"
                onClick={() => router.push("/login")}
              >
                Back to Login
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="hidden lg:flex w-1/2 p-10 items-center justify-center bg-linear-to-br from-primary to-primary/80 text-white">
        <div className="text-center max-w-md space-y-4">
          <h2 className="text-3xl font-bold">
            Forgot passwords happen. That&apos;s why we&apos;re here.
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Settlr ensures secure & seamless identity recovery while keeping
            your data protected.
          </p>
        </div>
      </div>
    </div>
  );
}
