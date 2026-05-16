"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuZap, LuCheck, LuX, LuLoader } from "react-icons/lu";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface PlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function PlanUpgradeModal({ isOpen, onClose, title, description }: PlanUpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"selection" | "confirm" | "insufficient" | "success" | "trial_confirm">("selection");
  const [hasUsedTrial, setHasUsedTrial] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from("profiles")
          .select("has_used_trial, plan")
          .eq("id", user.id)
          .single();
        
        if (data) {
          setHasUsedTrial(data.has_used_trial ?? false);
        }
      };
      fetchProfile();
    }
  }, [isOpen]);

  const handleStartTrial = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const now = new Date();
      const expiryDate = new Date(now.getTime() + (4 * 24 * 60 * 60 * 1000)); // Exactly 4 days

      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ 
          plan: 'pro',
          subscription_period_end: expiryDate.toISOString(),
          subscription_status: 'active',
          has_used_trial: true
        })
        .eq('id', user.id);

      if (updateProfileError) throw updateProfileError;

      setStep("success");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error("Trial error:", error);
      alert(error.message || "An unexpected error occurred while starting trial.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Check balance
      const { data: balanceData, error: balanceError } = await supabase
        .from('balances')
        .select('amount')
        .eq('user_id', user.id)
        .eq('asset_code', 'USDT')
        .maybeSingle();

      if (balanceError) throw balanceError;

      const currentBalance = Number(balanceData?.amount || 0);

      if (currentBalance < 15) {
        setStep("insufficient");
        return;
      }

      // 1. Deduct balance
      const { error: updateBalanceError } = await supabase
        .from('balances')
        .update({ amount: currentBalance - 15 })
        .eq('user_id', user.id)
        .eq('asset_code', 'USDT');

      if (updateBalanceError) throw updateBalanceError;

      // 2. Update profile plan
      const now = new Date();
      const expiryDate = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)); // Exactly 90 days

      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ 
          plan: 'pro',
          subscription_period_end: expiryDate.toISOString(),
          subscription_status: 'active'
        })
        .eq('id', user.id);

      if (updateProfileError) {
        console.error("Profile update error:", updateProfileError);
        throw updateProfileError;
      }

      // 3. Log transaction
      await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'Trade',
        asset: 'USDT',
        amount: -15,
        status: 'Completed',
        tx_id: `UPGRADE-PRO-${Math.random().toString(36).substring(7).toUpperCase()}`
      });

      setStep("success");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error("Upgrade error:", error);
      alert(error.message || "An unexpected error occurred during upgrade.");
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "A limited but powerful automated portfolio experience for new users.",
      features: [
        "2 AI Questions / day",
        "1 Auto Position / day",
        "Basic Wallet Access",
        "Weekly performance reports",
        "1 withdrawal every 3 days"
      ],
      cta: "Current Plan",
      highlighted: false,
      disabled: true,
      action: () => {}
    },
    {
      name: "Pro",
      price: "$15 / 3 months",
      description: "Full autonomous mode: AI manages trades 24/7. Billed every 3 months.",
      features: [
        "Unlimited AI Support",
        "Unlimited Auto Trading",
        "Capital Protection: 15% Loss Recovery",
        "Instant withdrawals",
        "Detailed performance analytics",
        "24/7 autonomous trade execution"
      ],
      cta: "Upgrade to Pro",
      highlighted: true,
      disabled: false,
      action: () => setStep("confirm")
    }
  ];

  const handleClose = () => {
    setStep("selection");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] bg-[#050505] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent flex flex-col"
          >
            {/* Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
            
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 h-8 w-8 md:h-9 md:w-9 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all z-20"
            >
              <LuX className="h-4 w-4 md:h-4 md:w-4" />
            </button>

            <div className="p-5 md:p-6 flex-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {step === "selection" && (
                  <motion.div
                    key="selection"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="text-center mb-4 md:mb-5 mt-2 md:mt-0">
                      <div className="inline-flex h-8 w-8 md:h-8 md:w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500 mb-2 md:mb-3 border border-red-500/20 animate-pulse">
                        <LuZap className="h-4 w-4 md:h-4 md:w-4" />
                      </div>
                      <h2 className="text-xl md:text-3xl font-bold text-white mb-1.5 md:mb-2 tracking-tight px-4">
                        {title || "Upgrade Your Strategy"}
                      </h2>
                      <p className="text-white/40 max-w-lg mx-auto text-xs md:text-sm leading-relaxed px-2">
                        {description || "Unlock the full potential of Aura AI with our professional investment tools and capital protection."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                      {plans.map((plan) => (
                        <article
                          key={plan.name}
                          className={`relative rounded-[1.5rem] md:rounded-xl border p-5 text-left backdrop-blur-sm flex flex-col h-full transition-all duration-500 ${
                            plan.highlighted
                              ? "border-white/25 bg-white/[0.03] shadow-[0_0_40px_rgba(255,255,255,0.02)] md:scale-[1.01] z-10"
                              : "border-white/10 bg-white/[0.01]"
                          }`}
                        >
                          {plan.highlighted && (
                            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-white text-black rounded-full text-[9px] font-bold uppercase tracking-[0.2em] shadow-lg">
                              Recommended
                            </div>
                          )}

                          <div className="mb-4">
                            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{plan.name}</p>
                            <p className="text-2xl md:text-2xl font-bold text-white mb-1">{plan.price}</p>
                            <p className="text-[10px] md:text-xs text-white/50 leading-relaxed min-h-[28px]">{plan.description}</p>
                          </div>

                          <ul className="space-y-2 md:space-y-2 mb-5 flex-1">
                            {plan.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 md:gap-2.5">
                                <span
                                  className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full mt-[1px] ${
                                    plan.highlighted
                                      ? "bg-red-500/20 text-red-400"
                                      : "bg-white/10 text-white/40"
                                  }`}
                                >
                                  <LuCheck className="h-2.5 w-2.5 md:h-2.5 md:w-2.5" />
                                </span>
                                <span className={`text-[11px] md:text-xs leading-snug ${
                                  feature.includes("Capital Protection") 
                                    ? "font-bold text-emerald-400" 
                                    : "text-white/70"
                                }`}>
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>

                          {plan.highlighted && !plan.disabled && (
                            <div className="flex flex-col gap-2 mt-auto pt-4">
                              <button
                                type="button"
                                disabled={isLoading}
                                onClick={plan.action}
                                className="w-full rounded-lg py-2.5 bg-white text-black hover:bg-white/90 text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                              >
                                {isLoading ? <LuLoader className="h-3 w-3 animate-spin" /> : plan.cta}
                              </button>
                              
                              {!hasUsedTrial && (
                                <button
                                  type="button"
                                  disabled={isLoading}
                                  onClick={() => setStep("trial_confirm")}
                                  className="w-full rounded-lg py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-[9px] md:text-[10px] font-bold tracking-widest uppercase transition-all duration-300"
                                >
                                  Start 4-Day Free Trial
                                </button>
                              )}

                              <p className="text-center mt-1 text-[8px] md:text-[9px] text-white/30 font-medium">
                                15 USDT will be deducted from your balance
                              </p>
                            </div>
                          )}

                          {!plan.highlighted && (
                              <button
                                type="button"
                                disabled={plan.disabled}
                                className="w-full rounded-lg py-2.5 border border-white/10 bg-white/5 text-white/40 text-[10px] md:text-xs font-bold tracking-widest uppercase cursor-default"
                              >
                                {plan.cta}
                              </button>
                          )}
                        </article>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === "trial_confirm" && (
                  <motion.div
                    key="trial_confirm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="max-w-md mx-auto text-center py-4"
                  >
                    <div className="mx-auto h-16 w-16 rounded-[1.5rem] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-4 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                      <LuZap className="h-6 w-6 text-emerald-400 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Activate Trial</h2>
                    <p className="text-white/40 text-sm mb-6 leading-relaxed px-4">
                      Get full access to all Pro features for <span className="text-emerald-400 font-bold">4 days</span>. No charges will be made. You can only use this once.
                    </p>
                    <div className="flex flex-col gap-3 px-2">
                      <button
                        onClick={handleStartTrial}
                        disabled={isLoading}
                        className="w-full py-3.5 rounded-xl bg-emerald-500 text-white font-bold text-sm tracking-widest uppercase hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                      >
                        {isLoading ? <LuLoader className="h-4 w-4 animate-spin" /> : "Start My Free Trial"}
                      </button>
                      <button
                        onClick={() => setStep("selection")}
                        className="w-full py-3.5 rounded-xl border border-white/10 text-white/60 font-bold text-sm tracking-widest uppercase hover:bg-white/5 transition-all"
                      >
                        Go Back
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === "confirm" && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="max-w-md mx-auto text-center py-4"
                  >
                    <div className="mx-auto h-16 w-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center border border-white/10 mb-4 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                      <LuZap className="h-6 w-6 text-white animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Confirm Upgrade</h2>
                    <p className="text-white/40 text-sm mb-6 leading-relaxed px-4">
                      You are about to upgrade to the Pro Plan. <span className="text-white font-bold">15 USDT</span> will be deducted from your balance for a 3-month subscription.
                    </p>
                    <div className="flex flex-col gap-3 px-2">
                      <button
                        onClick={handleUpgrade}
                        disabled={isLoading}
                        className="w-full py-3.5 rounded-xl bg-white text-black font-bold text-sm tracking-widest uppercase hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                      >
                        {isLoading ? <LuLoader className="h-4 w-4 animate-spin" /> : "Confirm & Pay 15 USDT"}
                      </button>
                      <button
                        onClick={() => setStep("selection")}
                        className="w-full py-3.5 rounded-xl border border-white/10 text-white/60 font-bold text-sm tracking-widest uppercase hover:bg-white/5 transition-all"
                      >
                        Go Back
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === "insufficient" && (
                  <motion.div
                    key="insufficient"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto text-center py-4"
                  >
                    <div className="mx-auto h-16 w-16 rounded-[1.5rem] bg-red-500/10 flex items-center justify-center border border-red-500/20 mb-4 transform -rotate-6">
                      <LuX className="h-6 w-6 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Insufficient Balance</h2>
                    <p className="text-white/40 text-sm mb-6 leading-relaxed px-4">
                      You need at least <span className="text-white font-bold">15 USDT</span> to upgrade to the Pro Plan. Your current balance is not enough.
                    </p>
                    <div className="flex flex-col gap-3 px-2">
                      <button
                        onClick={() => router.push("/dashboard/deposit")}
                        className="w-full py-3.5 rounded-xl bg-red-500 text-white font-bold text-sm tracking-widest uppercase hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                      >
                        Deposit Funds
                      </button>
                      <button
                        onClick={() => setStep("selection")}
                        className="w-full py-3.5 rounded-xl border border-white/10 text-white/60 font-bold text-sm tracking-widest uppercase hover:bg-white/5 transition-all"
                      >
                        Try Again
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto text-center py-4"
                  >
                    <div className="mx-auto h-16 w-16 rounded-[1.5rem] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-4 animate-bounce">
                      <LuCheck className="h-6 w-6 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Upgrade Successful!</h2>
                    <p className="text-white/40 text-sm mb-6 leading-relaxed px-4">
                      Welcome to <span className="text-emerald-400 font-bold">Aura Pro</span>. Your features have been unlocked. The page will reload in a moment.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-4 flex flex-col items-center gap-2">
                <p className="text-[8px] md:text-[9px] text-white/20 font-bold uppercase tracking-[0.2em]">
                  Secure Payment Gateway
                </p>
                <div className="flex items-center gap-4 opacity-20 grayscale scale-90">
                  <span className="text-[9px] font-bold text-white">PayID19</span>
                  <span className="text-[9px] font-bold text-white">OxaPay</span>
                  <span className="text-[9px] font-bold text-white">Binance</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
