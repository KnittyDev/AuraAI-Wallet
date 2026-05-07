"use client";

import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { LuMonitor } from "react-icons/lu";
import { LandingHeader } from "@/components/landing/landing-header";
import Link from "next/link";
import Image from "next/image";


import auralogo from "@/app/auralogo.png";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2FA State
  const [show2FA, setShow2FA] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [totpLoading, setTotpLoading] = useState(false);
  const [totpError, setTotpError] = useState<string | null>(null);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      }
    }
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Check if 2FA is enabled
    const userId = authData.user?.id;
    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("totp_enabled")
        .eq("id", userId)
        .single();

      if (profile?.totp_enabled) {
        setPendingUserId(userId);
        setShow2FA(true);
        setLoading(false);
        return;
      }
    }

    router.push("/dashboard");
  };

  const handleTOTPVerify = async () => {
    if (!pendingUserId || totpCode.length !== 6) return;
    setTotpLoading(true);
    setTotpError(null);

    const res = await fetch("/api/auth/totp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "validate", user_id: pendingUserId, token: totpCode }),
    });
    const data = await res.json();

    if (data.valid) {
      router.push("/dashboard");
    } else {
      setTotpError(data.error || "Invalid code. Please try again.");
      setTotpCode("");
    }
    setTotpLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white flex flex-col overflow-hidden">
      {/* Sticky Navigation */}
      <div className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <LandingHeader />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Auth Flow */}
        <div className="flex-1 flex flex-col px-8 md:px-16 lg:px-24 py-12 z-10 overflow-y-auto">


        <div className="max-w-md w-full my-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-6 leading-[1.1]">
              Invest fast, <br />
              <span className="text-white/40">grow faster.</span>
            </h1>
            <p className="text-white/50 text-lg mb-10">
              Analyze in chat, invest with Aura. The intelligence engine for modern portfolios.
            </p>

            <div className="space-y-4">
              {/* Login Card */}
              <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl">
                <button 
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-black border border-white/10 rounded-2xl py-3.5 hover:bg-white/5 transition-all group"
                >
                  <FcGoogle className="h-5 w-5" />
                  <span className="text-sm font-semibold">Continue with Google</span>
                </button>

                <div className="relative my-8 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5"></div>
                  </div>
                  <span className="relative bg-[#0F0F0F] px-4 text-[10px] font-bold uppercase tracking-widest text-white/20">OR</span>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20"
                    />
                  </div>
                  <div>
                    <input 
                      type="password" 
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20"
                    />
                  </div>

                  {error && <p className="text-red-400 text-xs px-1">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center bg-white text-black rounded-2xl py-3.5 text-sm font-bold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Signing in..." : "Continue with email"}
                  </button>
                </form>

                <p className="mt-6 text-center text-[10px] text-white/30">
                  By continuing, you acknowledge Aura's <Link href="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</Link>.
                </p>
              </div>

              <p className="mt-8 text-center text-sm text-white/50">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-white font-bold hover:underline underline-offset-4 transition-all">
                  Create one
                </Link>
              </p>

              <button className="w-full flex items-center justify-center gap-2 py-4 text-white/30 hover:text-white transition-all text-xs font-bold uppercase tracking-widest mt-4">
                <LuMonitor className="h-4 w-4" />
                Download desktop app
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Product Showcase */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative bg-[#0D0D0D]">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-2xl px-12"
        >
          {/* Main Visual Card - Product Showcase GIF */}
          <div className="rounded-[3rem] border border-white/10 bg-[#111] shadow-2xl overflow-hidden aspect-[4/3] relative group">
            <Image 
              src="/login-visual.gif" 
              alt="Aura AI Product Showcase" 
              fill 
              className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              unoptimized // Important for GIFs
            />
            
            {/* Subtle Overlay to match brand */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Decorative Floaters */}
          <div className="absolute -top-12 -right-12 h-32 w-32 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-12 -left-12 h-40 w-40 bg-purple-500/10 rounded-full blur-3xl" />
        </motion.div>
      </div>

      {/* Mobile background elements */}
      <div className="lg:hidden absolute inset-0 -z-10 bg-gradient-to-b from-[#0A0A0A] to-cyan-500/5" />
      </div>

      {/* ── 2FA Verification Overlay ── */}
      <AnimatePresence>
        {show2FA && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-md rounded-[2.5rem] border border-white/10 bg-zinc-900 p-8 md:p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 h-64 w-64 bg-cyan-500/10 blur-[80px] rounded-full" />
              <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-purple-500/10 blur-[80px] rounded-full" />

              <div className="relative z-10 space-y-8">
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                    <svg className="h-8 w-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Two-Factor Verification</h2>
                  <p className="text-sm text-white/40">
                    Enter the 6-digit code from your authenticator app to continue.
                  </p>
                </div>

                <div className="flex justify-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    className="w-64 text-center text-4xl font-mono font-bold tracking-[0.5em] bg-white/[0.03] border border-white/10 rounded-2xl py-5 text-white outline-none focus:border-cyan-500/50 transition-all placeholder:text-white/10"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleTOTPVerify()}
                  />
                </div>

                <p className="text-[10px] text-center text-white/20 font-medium">
                  Code refreshes every 30 seconds
                </p>

                {totpError && (
                  <div className="p-4 rounded-2xl text-xs font-bold bg-red-400/10 text-red-400 border border-red-400/20 text-center">
                    {totpError}
                  </div>
                )}

                <button
                  onClick={handleTOTPVerify}
                  disabled={totpLoading || totpCode.length !== 6}
                  className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {totpLoading ? "Verifying..." : "Verify & Continue"}
                </button>

                <button
                  onClick={() => { setShow2FA(false); supabase.auth.signOut(); }}
                  className="w-full text-center text-xs font-bold text-white/20 hover:text-white/60 transition-colors uppercase tracking-widest"
                >
                  Cancel Login
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

