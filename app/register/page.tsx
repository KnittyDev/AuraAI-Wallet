"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { LuMonitor } from "react-icons/lu";
import { LandingHeader } from "@/components/landing/landing-header";
import Link from "next/link";
import Image from "next/image";


import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 6) score++;
    if (pass.length > 10) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;
    return score || 1;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
          username: isAnonymous ? username : null,
          is_anonymous: isAnonymous,
        }
      },
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
        <div className="flex-1 flex flex-col px-8 md:px-16 lg:px-24 py-12 z-10 overflow-y-auto font-outfit">


          <div className="max-w-md w-full my-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-6 leading-[1.1]">
                Join the future, <br />
                <span className="text-white/40">start today.</span>
              </h1>
              <p className="text-white/50 text-lg mb-10">
                Create your account and let Aura manage your institutional-grade portfolio.
              </p>

              <div className="space-y-4">
                {/* Register Card */}
                <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl">
                  <button 
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-black border border-white/10 rounded-2xl py-3.5 hover:bg-white/5 transition-all group"
                  >
                    <FcGoogle className="h-5 w-5" />
                    <span className="text-sm font-semibold">Join with Google</span>
                  </button>

                  <div className="relative my-8 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/5"></div>
                    </div>
                    <span className="relative bg-[#0F0F0F] px-4 text-[10px] font-bold uppercase tracking-widest text-white/20">OR</span>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <AnimatePresence mode="wait">
                      {!isAnonymous ? (
                        <motion.div
                          key="full-name"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required={!isAnonymous}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20"
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="username"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <input
                            type="text"
                            placeholder="Public Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required={isAnonymous}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className="flex flex-col gap-3 py-2">
                       <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            className="w-5 h-5 rounded-lg bg-white/5 border border-white/10 appearance-none checked:bg-white checked:border-white transition-all cursor-pointer relative after:content-['✓'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-black after:text-xs after:opacity-0 checked:after:opacity-100"
                          />
                          <span className="text-sm text-white/60 group-hover:text-white transition-colors">I want to be an anonymous investor</span>
                       </label>
                    </div>

                    <div>
                      <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20"
                      />
                      
                      {/* Password Strength Indicator */}
                      {password.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="px-1 space-y-2"
                        >
                          <div className="flex gap-1.5 h-1">
                            {[1, 2, 3, 4].map((level) => {
                              const strength = calculateStrength(password);
                              return (
                                <div 
                                  key={level}
                                  className={`flex-1 rounded-full transition-all duration-500 ${
                                    level <= strength 
                                      ? strength === 1 ? 'bg-red-500' :
                                        strength === 2 ? 'bg-orange-500' :
                                        strength === 3 ? 'bg-yellow-500' : 'bg-emerald-500'
                                      : 'bg-white/5'
                                  }`}
                                />
                              );
                            })}
                          </div>
                          <p className={`text-[9px] font-bold uppercase tracking-widest ${
                            calculateStrength(password) === 1 ? 'text-red-500/60' :
                            calculateStrength(password) === 2 ? 'text-orange-500/60' :
                            calculateStrength(password) === 3 ? 'text-yellow-500/60' : 'text-emerald-500/60'
                          }`}>
                            {calculateStrength(password) === 1 && "Weak Password"}
                            {calculateStrength(password) === 2 && "Fair Security"}
                            {calculateStrength(password) === 3 && "Good Password"}
                            {calculateStrength(password) === 4 && "Strong / Secure"}
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {error && <p className="text-red-400 text-xs px-1">{error}</p>}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center bg-white text-black rounded-2xl py-3.5 text-sm font-bold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                      {loading ? "Creating account..." : "Create Account"}
                    </button>
                  </form>

                  <p className="mt-6 text-center text-[10px] text-white/30">
                    By signing up, you acknowledge Aura's <Link href="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</Link> and <Link href="/terms" className="underline hover:text-white transition-colors">Terms</Link>.
                  </p>
                </div>

                <p className="mt-8 text-center text-sm text-white/50">
                  Already have an account?{" "}
                  <Link href="/login" className="text-white font-bold hover:underline underline-offset-4 transition-all">
                    Sign in
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
                src="/register-visual.gif"
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
