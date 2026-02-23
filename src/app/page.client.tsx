"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Mail, 
  Shield,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Phone
} from "lucide-react";
import Image from "next/image";

// Utility function for merging Tailwind classes
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

type ForgotPasswordStep = "phone" | "reset" | null;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Forgot password states
  const [forgotPasswordStep, setForgotPasswordStep] = useState<ForgotPasswordStep>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [pinId, setPinId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");

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
        
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem("navsa_remember_email", email);
        } else {
          localStorage.removeItem("navsa_remember_email");
        }
        
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
    setForgotPasswordSuccess("");

    if (!phoneNumber) {
      setError("Please enter your registered phone number");
      return;
    }

    // Validate phone number format (Nigerian format)
    const phoneRegex = /^(0[7-9][0-1]\d{8})$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Please enter a valid Nigerian phone number (e.g., 08012345678)");
      return;
    }

    setForgotPasswordLoading(true);

    try {
      const response = await fetch("/api/auth/password-recovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send PIN");
      }

      // Success case - PIN sent successfully
      setForgotPasswordStep("reset");
      setForgotPasswordSuccess("PIN has been sent to your phone!");
      
      // Store pinId for verification in the next step
      if (data.pinId) {
        setPinId(data.pinId);
      }
      
      // Clear error if any
      setError("");

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send PIN. Please try again.";
      setError(errorMessage);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setForgotPasswordSuccess("");

    if (!pin || !newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (pin.length !== 6) {
      setError("PIN must be 6 digits");
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
      const response = await fetch("/api/auth/reset-password", {
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

      const data = await response.json();

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
        setShowNewPassword(false);

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
    setForgotPasswordSuccess("");
  };

  // Load remembered email on component mount
  useState(() => {
    const rememberedEmail = localStorage.getItem("navsa_remember_email");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  });

  // Render Forgot Password Form
  if (forgotPasswordStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] via-white to-[#f1f8e9] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid-[#2e7d32]/[0.02] bg-[length:60px_60px]" />
        
        <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4 p-3">
              <Image
                src="/uploads/NITDA.png"
                alt="NITDA Logo"
                width={80}
                height={80}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              <span className="text-[#2e7d32]">NAVSA</span>
              <span className="text-gray-700"> Cooperative</span>
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Password Recovery
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {forgotPasswordStep === "phone" ? "Reset Your Password" : "Create New Password"}
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                {forgotPasswordStep === "phone" 
                  ? "Enter your registered phone number to receive a reset PIN" 
                  : "Enter the 6-digit PIN sent to your phone and create a new password"}
              </p>

              {/* Success Message */}
              {forgotPasswordSuccess && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-4 mb-6">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-green-800">{forgotPasswordSuccess}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={forgotPasswordStep === "phone" ? handleForgotPassword : handlePasswordReset} className="space-y-6">
                {forgotPasswordStep === "phone" ? (
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Registered Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 11))}
                        placeholder="08012345678"
                        required
                        type="tel"
                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent transition-all duration-200 bg-gray-50"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                        6-Digit Reset PIN
                      </label>
                      <div className="relative">
                        <input
                          id="pin"
                          value={pin}
                          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          placeholder="123456"
                          required
                          type="text"
                          pattern="\d{6}"
                          className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent transition-all duration-200 bg-gray-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          type={showNewPassword ? "text" : "password"}
                          className="appearance-none block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent transition-all duration-200 bg-gray-50"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          type="password"
                          className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent transition-all duration-200 bg-gray-50"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeForgotPassword}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2e7d32] transition-all duration-200"
                  >
                    Back to Login
                  </button>
                  <button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className={cn(
                      "flex-1 px-4 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#2e7d32] hover:bg-[#1b5e20] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2e7d32] transition-all duration-200",
                      forgotPasswordLoading && "opacity-75 cursor-not-allowed"
                    )}
                  >
                    {forgotPasswordLoading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2 inline" />
                        Processing...
                      </>
                    ) : forgotPasswordStep === "phone" ? (
                      "Send PIN"
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{" "}
                  <button
                    onClick={closeForgotPassword}
                    className="font-medium text-[#2e7d32] hover:text-[#1b5e20] transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Login Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] via-white to-[#f1f8e9] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-[#2e7d32]/[0.02] bg-[length:60px_60px]" />
      
      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo Section */}
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4 p-3">
            <Image
              src="/uploads/NITDA.png"
              alt="NITDA Logo"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            <span className="text-[#2e7d32]">NAVSA</span>
            <span className="text-gray-700"> Admin</span>
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            National Adopted Village for Smart Agriculture
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleEmailLogin}>
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to your account</h2>
                <p className="text-sm text-gray-600">
                  Enter your credentials to access the NAVSA platform
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent transition-all duration-200 bg-gray-50"
                    placeholder="admin@navsa.ng"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordStep("phone")}
                    className="text-sm font-medium text-[#2e7d32] hover:text-[#1b5e20] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent transition-all duration-200 bg-gray-50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#2e7d32] focus:ring-[#2e7d32] border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#2e7d32] hover:bg-[#1b5e20] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2e7d32] transition-all duration-200",
                    loading && "opacity-75 cursor-not-allowed"
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <User className="h-5 w-5 mr-2" />
                      Sign in
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Bottom Links */}
            <div className="mt-8 text-center">
              <p className="mt-2 text-xs text-gray-500">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="text-[#2e7d32] hover:text-[#1b5e20] transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#2e7d32] hover:text-[#1b5e20] transition-colors">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          {/* Support Information */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
              <Shield className="h-4 w-4" />
              <span>Need help? </span>
              <Link 
                href="/support" 
                className="font-medium text-[#2e7d32] hover:text-[#1b5e20] transition-colors"
              >
                Contact Support
              </Link>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              © {new Date().getFullYear()} NAVSA. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .bg-grid-\[#2e7d32\] {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgba(46, 125, 50, 0.02)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
        
        /* Custom focus styles */
        input:focus, button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
        }
        
        /* Smooth transitions */
        * {
          transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }
      `}</style>
    </div>
  );
}