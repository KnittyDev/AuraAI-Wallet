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
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
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
    </div>
  );
}

