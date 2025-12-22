"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signInWithGoogle } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wallet, Mail, EyeOff, Eye, ArrowRight } from "lucide-react";

import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Signin failed");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred during signin");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  }

  const handleDiscordLogin = async () => {
    console.log("Pending Discord login");
  }

  return (
    <>
      {/* <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Button onClick={handleGoogleLogin} className="w-full">
                Login With Google
              </Button>
            </form>
          </CardContent>
          <div className="mt-4 space-y-2 text-center text-sm">
            <Link
              href="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot your password?
            </Link>
            <div>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </Card>
      </div> */}

      {/* Here is the updated code */}
      <div className="flex flex-col min-h-screen bg-background">
        {/* Top Header */}
        <header className="flex-none p-4 pb-0">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="text-sm font-medium text-primary cursor-pointer hover:underline">
              Need help?
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary animate-pulse">
              <Wallet className="w-10 h-10" />
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 flex flex-col justify-end w-full max-w-md mx-auto px-4 pb-8">
          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              Manage your cash flow simply.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-lg p-1 shadow-sm border bg-card">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <form className="flex flex-col gap-4 p-4">
              {/* Email */}
              <div>
                <label className="text-sm font-medium mb-1.5 ml-1 block">
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    className="h-14 pl-4 pr-12 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium mb-1.5 ml-1 block">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="h-14 pl-4 pr-12 rounded-xl"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end pt-1">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Sign In */}
              <Button
                className="mt-4 h-14 rounded-full text-lg font-semibold gap-2 active:scale-[0.98] transition-all"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Sign In"}
                {/* <ArrowRight className="w-5 h-5" /> */}
              </Button>
            </form>
          </div>

          {/* Social Section */}
          <div className="mt-8 flex flex-col items-center gap-6">
            <div className="flex gap-4 w-full justify-center">
              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="flex-1 max-w-40 h-12 rounded-full gap-2"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuADxaxlW3Zvs5yU9wgTWrV1DNSdwumtOyJ90BSoq4xYElsS8VuHrbq5BkqHmdNXhgd0iEuqjbgDEcTKHLUytZtiPNUTchu1qevb_48Fkt9HbsQg2g-5-gX5gsF5UXjVgtxMYtyrZAXUujx7d-BmnGaVQi2ccJs7PU5cGcHc_VDYOKFATD3hmP8R1nHac_rhcxfBySjq_QqVik7lvFdCbVFBlFcaza9Kl75qCjIJumxV5kOf3-4swK26azcSnA4NQf55SVfl2_Nv5K8R"
                  alt="Google"
                  width={20}
                  height={20}
                />
                <span className="text-sm font-medium">Google</span>
              </Button>

              <Button
                onClick={handleDiscordLogin}
                variant="outline"
                className="flex-1 max-w-40 h-12 rounded-full gap-2"
              >
                <svg
                  className="w-5 h-5 text-[#5865F2]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317..." />
                </svg>
                <span className="text-sm font-medium">Discord</span>
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
