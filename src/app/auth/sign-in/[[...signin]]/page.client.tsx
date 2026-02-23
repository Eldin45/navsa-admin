"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, QrCode } from "lucide-react";

import { Button } from "~/ui/primitives/button";
import { Card, CardContent } from "~/ui/primitives/card";
import { Input } from "~/ui/primitives/input";
import { Label } from "~/ui/primitives/label";
import { Separator } from "~/ui/primitives/separator";

type ForgotPasswordStep = "email" | "reset" | null;

export function SignInPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password states
  const [forgotPasswordStep, setForgotPasswordStep] =
    useState<ForgotPasswordStep>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [pinId, setPinId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        const errorMessage =
          result.error === "CredentialsSignin"
            ? "Invalid email or password"
            : result.error === "AccessDenied"
              ? "Your account is not authorized"
              : "Login failed. Please try again";

        setError(errorMessage);
      } else if (result?.url) {
        const callbackUrl = new URL(result.url).searchParams.get("callbackUrl");
        router.push(callbackUrl || "/dashboard");
      } else {
        setError("Login successful but no redirect URL found");
        router.push("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber) {
      setError("Please enter your registered phone number");
      return;
    }

    setForgotPasswordLoading(true);

    try {
      const response = await fetch("../../../api/passwordRec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
        }),
      });

      const data: any = await response.json(); // Await and parse the JSON response

      if (!response.ok) {
        // If response status is not 2xx, throw an error with the message from backend
        throw new Error(data.error || "Failed to send PIN");
      }

      // Success case - PIN sent successfully
      setForgotPasswordStep("reset");
      setError(""); // Clear any previous errors

      // You might want to store the pinId for verification in the next step
      if (data.pinId) {
        // Store pinId in state or context for the verification step
        setPinId(data.pinId);
      }
    } catch (err) {
      // Use the error message from the backend or a fallback
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to send PIN. Please try again.";
      setError(errorMessage);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!pin || !newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setForgotPasswordLoading(true);

    try {
      const response = await fetch("../../../api/verifyOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pin,
          password: newPassword,
          token: pinId,
          phone: phoneNumber,
        }),
      });

      const data: any = await response.json();

      console.log("Reset password response:", data);

      // Check both response.ok AND the success flag from your backend
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to reset password");
      }

      // Only proceed if both response is ok AND success is true
      if (response.ok && data.success) {
        // Success - return to login
        setForgotPasswordStep(null);
        setPhoneNumber("");
        setPin("");
        setNewPassword("");
        setConfirmPassword("");
        setPinId("");

        // Show success message
        alert(
          "Password reset successful! Please sign in with your new password.",
        );
      }
    } catch (err) {
      console.error("Password reset error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to reset password. Please check your PIN and try again.";
      setError(errorMessage);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const closeForgotPassword = () => {
    setForgotPasswordStep(null);
    setPhoneNumber("");
    setPin("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  // Render Forgot Password Form
  if (forgotPasswordStep) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <div className="space-y-4 text-center">
            <Link
              className="flex items-center space-x-2 text-2xl font-extrabold tracking-tight text-primary transition-transform duration-300 hover:scale-105"
              href="/"
            >
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white">
                <QrCode className="h-5 w-5" />
              </div>
              <span>Qreta</span>
            </Link>
            <h2 className="text-3xl font-bold">
              {forgotPasswordStep === "email"
                ? "Reset Your Password"
                : "Create New Password"}
            </h2>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {forgotPasswordStep === "email"
                ? "Enter your registered phone number to receive a reset PIN"
                : "Enter the PIN sent to your phone and create a new password"}
            </p>
          </div>

          <Card className="border-none shadow-sm">
            <CardContent className="pt-6">
              <form
                onSubmit={
                  forgotPasswordStep === "email"
                    ? handleForgotPassword
                    : handlePasswordReset
                }
                className="space-y-4"
              >
                {forgotPasswordStep === "email" ? (
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Registered Phone Number</Label>
                    <Input
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="08064875411"
                      required
                      type="tel"
                    />
                  </div>
                ) : (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="pin">Reset PIN</Label>
                      <Input
                        id="pin"
                        value={pin}
                        onChange={(e) =>
                          setPin(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="Enter 6-digit PIN"
                        required
                        type="text"
                        maxLength={6}
                        pattern="\d{6}"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          type={showNewPassword ? "text" : "password"}
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground hover:text-foreground"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        type="password"
                        minLength={6}
                      />
                    </div>
                  </>
                )}

                {error && (
                  <div
                    className={`text-sm font-medium ${
                      error.includes("successful")
                        ? "text-green-600"
                        : "text-destructive"
                    }`}
                  >
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeForgotPassword}
                    className="flex-1"
                  >
                    Back to Login
                  </Button>
                  <Button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="flex-1"
                  >
                    {forgotPasswordLoading
                      ? "Processing..."
                      : forgotPasswordStep === "email"
                        ? "Send PIN"
                        : "Reset Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Original Login Form
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="space-y-4 text-center">
          <Link
            className="flex items-center space-x-2 text-2xl font-extrabold tracking-tight text-primary transition-transform duration-300 hover:scale-105"
            href="/"
          >
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white">
              <QrCode className="h-5 w-5" />
            </div>
            <span>Qreta</span>
          </Link>
          <h2 className="text-3xl font-bold">Sign In</h2>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Welcome back to Qreta. Let's get you back to business.
          </p>
        </div>

        <Card className="border-none shadow-sm">
          <CardContent className="pt-2">
            <form className="space-y-4" onSubmit={handleEmailLogin}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordStep("email")}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <div className="text-sm font-medium text-destructive">
                  {error}
                </div>
              )}
              <Button className="w-full" disabled={loading} type="submit">
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                className="text-primary underline-offset-4 hover:underline"
                href="/auth/sign-up"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
