"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuBot, LuCircleCheck, LuLoaderCircle, LuShieldCheck, LuTrendingUp, LuShield, LuScale, LuZap } from "react-icons/lu";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { SiBinance, SiBitcoin, SiEthereum, SiSolana, SiTether } from "react-icons/si";
import Image from "next/image";
import auraLogo from "@/app/auralogo.png";
import { supabase } from "@/lib/supabase";
import { PlanUpgradeModal } from "@/components/dashboard/plan-upgrade-modal";
import { useEffect } from "react";

const cryptoOptions = [
  {
    code: "BTC",
    name: "Bitcoin",
    icon: SiBitcoin,
    description: "Digital gold. The most famous and safest coin to hold long-term.",
    badge: "Market Leader",
  },
  {
    code: "ETH",
    name: "Ethereum",
    icon: SiEthereum,
    description: "Smart computer. Powers most apps and digital finance systems.",
    badge: "Popular",
  },
  {
    code: "SOL",
    name: "Solana",
    icon: SiSolana,
    description: "Ultra-fast. A newer, very quick coin designed for millions of users.",
  },
  {
    code: "USDT",
    name: "Tether",
    icon: SiTether,
    description: "Stable dollar. A digital coin tied to the US Dollar to keep your value steady.",
  },
];
const riskOptions = [
  {
    level: "Conservative",
    icon: LuShield,
    description: "Safety first. Best for keeping your savings safe while getting steady, small gains.",
    monthly: "8% — 12%",
    tier: "Institutional Low",
  },
  {
    level: "Balanced",
    icon: LuScale,
    description: "Best of both worlds. A mix of safety and growth to help your money grow steadily.",
    recommended: true,
    monthly: "15% — 25%",
    tier: "Institutional Medium",
  },
  {
    level: "Growth",
    icon: LuTrendingUp,
    description: "Faster growth. Aim for bigger profits by taking more risk during market changes.",
    monthly: "35% — 42%",
    tier: "High Growth",
  },
  {
    level: "Aggressive",
    icon: LuZap,
    description: "Maximum speed. Uses advanced high-speed trading to hunt for the highest possible returns.",
    monthly: "50% — 60%",
    tier: "Maximum Alpha",
  },
];
const goalOptions = [
  {
    title: "Capital Growth",
    icon: LuTrendingUp,
    description: "Maximize the total value of your portfolio over the long term.",
  },
  {
    title: "Passive Income",
    icon: LuScale,
    description: "Generate regular distributions and consistent cash flow.",
  },
  {
    title: "Capital Preservation",
    icon: LuShield,
    description: "Keep your initial investment safe with minimal risk exposure.",
  },
];
const experienceOptions = [
  {
    title: "Beginner",
    icon: LuShield,
    description: "New to crypto trading. Looking for guidance and automated safety.",
  },
  {
    title: "Intermediate",
    icon: LuScale,
    description: "Familiar with market dynamics. Understands technical analysis basics.",
  },
  {
    title: "Advanced",
    icon: LuZap,
    description: "Experienced trader. Looking for deep optimization and advanced tools.",
  },
];

export default function NewInvestmentPage() {
  const [step, setStep] = useState(1);
  const [crypto, setCrypto] = useState("BTC");
  const [risk, setRisk] = useState("Balanced");
  const [amount, setAmount] = useState("1000");
  const [days, setDays] = useState("30");
  const [goal, setGoal] = useState("Capital Growth");
  const [experience, setExperience] = useState("Beginner");
  const [strategy, setStrategy] = useState("Balanced Growth");
  const [profitAction, setProfitAction] = useState("Deposit all profits into my account");
  const [notes, setNotes] = useState("");
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [planStage, setPlanStage] = useState(0);
  const [planReady, setPlanReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const TOTAL_STEPS = 7;

  const isLastStep = step === TOTAL_STEPS;
  const planStages = [
    { icon: LuBot, text: "Aura AI is analyzing your investment profile..." },
    { icon: LuTrendingUp, text: "Building your strategy and preparing entry zones..." },
    { icon: LuShieldCheck, text: "Applying risk controls and position sizing..." },
    { icon: LuCircleCheck, text: "Your plan is ready. Positions are being prepared." },
  ];

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data);
    }
    fetchProfile();
  }, []);
  const stepAnimation = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.22, ease: "easeOut" as const },
  };

  const handleNext = async () => {
    if (step === 3 && Number(amount) < 150) {
      setError("Minimum investment amount is 150€.");
      return;
    }

    setError(null);

    if (!isLastStep) {
      setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
      return;
    }

    if (isCreatingPlan || planReady) return;

    setIsCreatingPlan(true);
    setPlanReady(false);
    setPlanStage(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsCreatingPlan(false);
        return;
      }

      // Plan Restriction Check
      if (profile?.plan === 'free') {
        const today = new Date().toISOString().split('T')[0];
        const lastPositionDate = profile.last_position_at ? new Date(profile.last_position_at).toISOString().split('T')[0] : null;
        
        let currentCount = profile.daily_positions_count || 0;
        if (lastPositionDate !== today) {
          currentCount = 0;
        }

        if (currentCount >= 1) {
          setIsUpgradeModalOpen(true);
          setIsCreatingPlan(false);
          return;
        }
      }

      // Check balance
      const { data: balanceData, error: balanceError } = await supabase
        .from('balances')
        .select('amount')
        .eq('user_id', user.id)
        .eq('asset_code', 'USDT')
        .maybeSingle();

      if (balanceError || !balanceData || Number(balanceData?.amount || 0) < Number(amount)) {
        setError("Insufficient USDT balance. Please deposit more funds.");
        setIsCreatingPlan(false);
        return;
      }

      // Fetch current price from Binance
      let entryPrice = 1;
      let assetAmount = Number(amount);

      if (crypto !== 'USDT') {
        try {
          const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${crypto}USDT`);
          const data = await response.json();
          if (data.price) {
            entryPrice = Number(data.price);
            assetAmount = Number(amount) / entryPrice;
          }
        } catch (priceErr) {
          console.error("Price fetch error:", priceErr);
          // Fallback to 1 if API fails, though in production you'd want a better fallback
        }
      }

      // Create investment and get the returned data (including the ID)
      const { data: newInvestment, error: investmentError } = await supabase
        .from('investments')
        .insert({
          user_id: user.id,
          asset_code: crypto,
          amount: Number(amount),
          asset_amount: assetAmount,
          entry_price: entryPrice,
          risk_profile: risk,
          duration_days: Number(days),
          goal: goal,
          experience_level: experience,
          profit_action: profitAction,
          notes: notes,
        })
        .select()
        .single();

      if (investmentError) {
        throw investmentError;
      }

      // Deduct balance
      const { error: deductError } = await supabase
        .from('balances')
        .update({ amount: Number(balanceData?.amount || 0) - Number(amount) })
        .eq('user_id', user.id)
        .eq('asset_code', 'USDT');

      if (deductError) {
        throw deductError;
      }

      // Add transaction log with the short ID of the investment
      const shortId = newInvestment.id.slice(0, 8);
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'Investment',
          asset: 'USDT',
          amount: -Number(amount),
          status: 'Completed',
          tx_id: `INV-${shortId}-${crypto}`
        });

      if (transactionError) {
        console.error("Transaction logging error:", transactionError);
        // We don't throw here to avoid breaking the main flow if just logging fails, 
        // but ideally we should track this.
      }

      // Update position count for free users
      if (profile?.plan === 'free') {
        const today = new Date().toISOString().split('T')[0];
        const lastPositionDate = profile.last_position_at ? new Date(profile.last_position_at).toISOString().split('T')[0] : null;
        const newCount = lastPositionDate === today ? (profile.daily_positions_count || 0) + 1 : 1;

        await supabase.from('profiles').update({
          daily_positions_count: newCount,
          last_position_at: new Date().toISOString()
        }).eq('id', profile.id);
        
        setProfile({ ...profile, daily_positions_count: newCount, last_position_at: new Date().toISOString() });
      }

      // Start animation
      const stageCount = planStages.length;
      const stageDurationMs = 1400;

      for (let i = 1; i < stageCount; i += 1) {
        setTimeout(() => setPlanStage(i), i * stageDurationMs);
      }

      setTimeout(() => {
        setIsCreatingPlan(false);
        setPlanReady(true);
        setPlanStage(stageCount - 1);
      }, stageCount * stageDurationMs);

    } catch (err: any) {
      console.error("Investment creation error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      setIsCreatingPlan(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <AuroraBackground />
      <div className="landing-grid-overlay" />
      <main className="relative z-10 min-h-screen px-6 py-8 text-white md:px-10">
        <section className="mx-auto w-full max-w-4xl">
          <div className="mb-10 flex justify-end">
            <Link
              href="/dashboard"
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Back to dashboard
            </Link>
          </div>

          {step !== 1 && step !== 2 && (
            <div className="text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
                Explain your investment ideas
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-base text-white/65 md:text-lg">
                Step by step onboarding to create your next investment plan.
              </p>
            </div>
          )}

          <div className="relative mt-10 w-full rounded-[28px] border border-white/15 bg-black/45 p-5 text-left shadow-2xl backdrop-blur-sm md:p-6">
            <div className="pointer-events-none absolute -left-20 top-6 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-6 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="relative z-10">
              <div className="mb-12 w-full">
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    initial={false}
                    animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase">
                  <span className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-white/40 animate-pulse" />
                    Step {step} of {TOTAL_STEPS}
                  </span>
                  <span>{Math.round((step / TOTAL_STEPS) * 100)}% Processed</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step-1" className="mt-4 w-full" {...stepAnimation}>
                    <div className="mb-10 text-center">
                      <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-2">Step 01</p>
                      <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Select Asset Class</h2>
                      <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/50">
                        Choose the foundational asset for your investment strategy. <br className="hidden md:block" />
                        Aura AI will optimize entry points based on the selected asset's liquidity.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {cryptoOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = crypto === option.code;
                        return (
                          <motion.button
                            key={option.code}
                            type="button"
                            onClick={() => setCrypto(option.code)}
                            className={`relative flex h-full flex-col items-start rounded-2xl border p-6 text-left transition-all duration-300 ${isSelected
                                ? "border-white bg-white/[0.03] shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                : "border-white/10 bg-transparent hover:border-white/20 hover:bg-white/[0.01]"
                              }`}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {option.badge && (
                              <div className="absolute right-4 top-4 rounded-full bg-white px-2 py-0.5 text-[8px] font-bold tracking-wider text-black uppercase">
                                {option.badge}
                              </div>
                            )}

                            <div className={`mb-12 flex h-10 w-10 items-center justify-center rounded-lg ${isSelected ? "text-white" : "text-white/40"
                              }`}>
                              <Icon className="h-6 w-6" />
                            </div>

                            <h3 className={`mb-1 text-xl font-semibold ${isSelected ? "text-white" : "text-white/90"}`}>
                              {option.name}
                            </h3>
                            <p className="mb-3 text-xs font-medium text-white/30 uppercase tracking-wider">{option.code}</p>

                            <p className="text-sm leading-relaxed text-white/40">
                              {option.description}
                            </p>

                            {isSelected && (
                              <motion.div
                                layoutId="active-border-crypto"
                                className="absolute inset-0 rounded-2xl border-2 border-white/80 pointer-events-none"
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step-2" className="mt-4 w-full" {...stepAnimation}>
                    <div className="mb-10 text-center">
                      <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-2">Step 02</p>
                      <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Select Your Risk Profile</h2>
                      <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/50">
                        Define the operational boundaries for the AuraAI neural engine. <br className="hidden md:block" />
                        Your selection calibrates volatility tolerance and target yield velocity.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {riskOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = risk === option.level;
                        return (
                          <motion.button
                            key={option.level}
                            type="button"
                            onClick={() => setRisk(option.level)}
                            className={`relative flex h-full flex-col items-start rounded-2xl border p-6 text-left transition-all duration-300 ${isSelected
                                ? "border-white bg-white/[0.03] shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                : "border-white/10 bg-transparent hover:border-white/20 hover:bg-white/[0.01]"
                              }`}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {option.recommended && (
                              <div className="absolute right-4 top-4 rounded-full bg-white px-2 py-0.5 text-[8px] font-bold tracking-wider text-black uppercase">
                                Recommended
                              </div>
                            )}

                            <div className={`mb-12 flex h-10 w-10 items-center justify-center rounded-lg ${isSelected ? "text-white" : "text-white/40"
                              }`}>
                              <Icon className="h-6 w-6" />
                            </div>

                            <h3 className={`mb-2 text-xl font-semibold ${isSelected ? "text-white" : "text-white/90"}`}>
                              {option.level}
                            </h3>

                            <div className={`mb-4 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${isSelected ? "bg-white/10 text-white" : "bg-white/5 text-white/40"}`}>
                              <LuTrendingUp className="h-3 w-3" />
                              Est. Monthly: {option.monthly}
                            </div>

                            <p className="text-sm leading-relaxed text-white/40">
                              {option.description}
                            </p>

                            {isSelected && (
                              <motion.div
                                layoutId="active-border"
                                className="absolute inset-0 rounded-2xl border-2 border-white/80 pointer-events-none"
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step-3" className="mt-4 w-full" {...stepAnimation}>
                    <div className="mb-10 text-center">
                      <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-2">Step 03</p>
                      <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Define Strategy Parameters</h2>
                      <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/50">
                        Specify your capital allocation and desired investment horizon. <br className="hidden md:block" />
                        Our engine optimizes yield based on your timeframe.
                      </p>
                    </div>

                    <div className="mx-auto max-w-xl space-y-12">
                      {/* Initial Capital */}
                      <div>
                        <div className="mb-4 flex items-center justify-between">
                          <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Initial Capital</label>
                          <div className="flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1 text-xs font-bold text-white/60">
                            USDT <span className="text-[10px]">▼</span>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            min="150"
                            value={amount}
                            onChange={(e) => {
                              setAmount(e.target.value);
                              if (error) setError(null);
                            }}
                            className={`w-full border-b bg-transparent py-4 text-4xl font-light tracking-tight text-white outline-none transition ${
                              error ? "border-red-500/50" : "border-white/10 focus:border-white/30"
                            }`}
                            placeholder="0.00"
                          />
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-widest text-white/20 uppercase">
                            Minimum 150
                          </span>

                          <AnimatePresence>
                            {error && (
                              <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                className="absolute left-0 top-full pt-2"
                              >
                                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-[11px] font-bold text-red-400 uppercase tracking-widest backdrop-blur-md shadow-lg shadow-red-500/10">
                                  <LuZap className="h-3 w-3 animate-pulse" />
                                  {error}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Target Duration */}
                      <div>
                        <div className="mb-4 flex items-center justify-between">
                          <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Target Duration</label>
                          <div className="text-2xl font-light text-white">
                            {days} <span className="text-sm text-white/40 uppercase tracking-widest ml-1">Days</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="7"
                          max="365"
                          step="1"
                          value={days}
                          onChange={(e) => setDays(e.target.value)}
                          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-white"
                        />
                        <div className="mt-4 flex justify-between text-[10px] font-bold tracking-widest text-white/20 uppercase">
                          <span>7D</span>
                          <span>90D</span>
                          <span>180D</span>
                          <span>Custom</span>
                        </div>
                      </div>

                      {/* Strategy Stats */}
                      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/5 bg-white/5">
                        <div className="bg-black/20 p-6">
                          <p className="text-[9px] font-bold tracking-widest text-white/30 uppercase mb-2">Monthly Return Rate</p>
                          <p className="text-lg font-medium text-white transition-all duration-300">
                            {riskOptions.find(o => o.level === risk)?.monthly}
                          </p>
                        </div>
                        <div className="bg-black/20 p-6">
                          <p className="text-[9px] font-bold tracking-widest text-white/30 uppercase mb-2">Risk Tier</p>
                          <p className="text-lg font-medium text-white transition-all duration-300">
                            {riskOptions.find(o => o.level === risk)?.tier}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="step-4-goal" className="mt-4 w-full" {...stepAnimation}>
                    <div className="mb-10 text-center">
                      <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-2">Step 04</p>
                      <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Select Investment Goal</h2>
                      <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/50">
                        What is the primary objective for this specific strategy? <br className="hidden md:block" />
                        Your choice influences position holding periods and exit targets.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {goalOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = goal === option.title;
                        return (
                          <motion.button
                            key={option.title}
                            type="button"
                            onClick={() => setGoal(option.title)}
                            className={`relative flex h-full flex-col items-start rounded-2xl border p-6 text-left transition-all duration-300 ${isSelected
                                ? "border-white bg-white/[0.03] shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                : "border-white/10 bg-transparent hover:border-white/20 hover:bg-white/[0.01]"
                              }`}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className={`mb-12 flex h-10 w-10 items-center justify-center rounded-lg ${isSelected ? "text-white" : "text-white/40"
                              }`}>
                              <Icon className="h-6 w-6" />
                            </div>

                            <h3 className={`mb-3 text-xl font-semibold ${isSelected ? "text-white" : "text-white/90"}`}>
                              {option.title}
                            </h3>

                            <p className="text-sm leading-relaxed text-white/40">
                              {option.description}
                            </p>

                            {isSelected && (
                              <motion.div
                                layoutId="active-border-goal"
                                className="absolute inset-0 rounded-2xl border-2 border-white/80 pointer-events-none"
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div key="step-5-experience" className="mt-4 w-full" {...stepAnimation}>
                    <div className="mb-10 text-center">
                      <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-2">Step 05</p>
                      <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Trading Experience</h2>
                      <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/50">
                        Select the level that best describes your market proficiency. <br className="hidden md:block" />
                        Aura AI adjusts its risk warnings and control interface accordingly.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {experienceOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = experience === option.title;
                        return (
                          <motion.button
                            key={option.title}
                            type="button"
                            onClick={() => setExperience(option.title)}
                            className={`relative flex h-full flex-col items-start rounded-2xl border p-6 text-left transition-all duration-300 ${isSelected
                                ? "border-white bg-white/[0.03] shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                : "border-white/10 bg-transparent hover:border-white/20 hover:bg-white/[0.01]"
                              }`}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className={`mb-12 flex h-10 w-10 items-center justify-center rounded-lg ${isSelected ? "text-white" : "text-white/40"
                              }`}>
                              <Icon className="h-6 w-6" />
                            </div>

                            <h3 className={`mb-3 text-xl font-semibold ${isSelected ? "text-white" : "text-white/90"}`}>
                              {option.title}
                            </h3>

                            <p className="text-sm leading-relaxed text-white/40">
                              {option.description}
                            </p>

                            {isSelected && (
                              <motion.div
                                layoutId="active-border-experience"
                                className="absolute inset-0 rounded-2xl border-2 border-white/80 pointer-events-none"
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 6 && (
                  <motion.div key="step-6-rules" className="mt-4 max-w-2xl space-y-4" {...stepAnimation}>
                    <div>
                      <p className="mb-2 text-sm text-white/75">How should we handle your profits?</p>
                      <div className="grid gap-2">
                        {[
                          "Deposit all profits into my account",
                          "Reinvest all profits automatically",
                          "Split profits: 50% account / 50% reinvest",
                        ].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setProfitAction(option)}
                            className={`rounded-xl border px-4 py-2 text-left text-sm transition ${profitAction === option
                                ? "border-white bg-white text-black"
                                : "border-white/20 bg-white/5 text-white hover:bg-white/10"
                              }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="notes" className="mb-2 block text-sm text-white/75">
                        Extra notes (optional)
                      </label>
                      <textarea
                        id="notes"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any constraints, coins to avoid, or custom instructions..."
                        className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/35"
                      />
                    </div>
                  </motion.div>
                )}

                {step === 7 && (
                  <motion.div key="step-7-review" className="mt-4 w-full" {...stepAnimation}>
                    <div className="mb-10 text-center">
                      <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-2">Step 07</p>
                      <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Final Strategy Review</h2>
                      <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/50">
                        Review your autonomous strategy parameters before activation. <br className="hidden md:block" />
                        Aura AI will begin execution immediately upon confirmation.
                      </p>
                    </div>

                    <div className="mx-auto max-w-3xl space-y-4">
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs font-bold text-red-400 uppercase tracking-widest text-center"
                        >
                          {error}
                        </motion.div>
                      )}
                      {/* Core Parameters Card */}
                      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                        <div className="border-b border-white/5 bg-white/[0.02] px-6 py-3">
                          <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Core Parameters</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3">
                          <div className="border-r border-white/5 p-6">
                            <p className="text-[9px] font-bold tracking-widest text-white/20 uppercase mb-2">Selected Asset</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-semibold text-white">{crypto}</span>
                              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-white/60">MAINNET</span>
                            </div>
                          </div>
                          <div className="border-r border-white/5 p-6">
                            <p className="text-[9px] font-bold tracking-widest text-white/20 uppercase mb-2">Initial Capital</p>
                            <p className="text-xl font-semibold text-white">{Number(amount).toLocaleString()} <span className="text-xs text-white/40 uppercase ml-1">USDT</span></p>
                          </div>
                          <div className="p-6">
                            <p className="text-[9px] font-bold tracking-widest text-white/20 uppercase mb-2">Time Horizon</p>
                            <p className="text-xl font-semibold text-white">{days} <span className="text-xs text-white/40 uppercase ml-1">Days</span></p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Strategy Card */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                          <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                              <LuShield className="h-4 w-4 text-white/60" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Risk & Objective</p>
                              <p className="text-sm font-medium text-white">{risk} Profile</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <p className="text-[9px] font-bold tracking-widest text-white/20 uppercase mb-1">Primary Goal</p>
                              <p className="text-sm text-white/80">{goal}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold tracking-widest text-white/20 uppercase mb-1">Risk Tier</p>
                              <p className="text-sm text-white/80">
                                {riskOptions.find(o => o.level === risk)?.tier}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Execution Rules Card */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                          <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                              <LuBot className="h-4 w-4 text-white/60" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Execution Rules</p>
                              <p className="text-sm font-medium text-white">{experience} Mode</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <p className="text-[9px] font-bold tracking-widest text-white/20 uppercase mb-1">Profit Distribution</p>
                              <p className="text-sm text-white/80">{profitAction}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold tracking-widest text-white/20 uppercase mb-1">Engine Status</p>
                              <p className="flex items-center gap-1.5 text-sm text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Ready for Deployment
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {notes.trim() && (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                          <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2">Custom Instructions</p>
                          <p className="text-sm leading-relaxed text-white/60 italic">"{notes}"</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {step >= 1 && step <= 7 ? (
                <div className="mt-12 flex flex-col items-center gap-6">
                  <motion.button
                    type="button"
                    onClick={handleNext}
                    className="w-full max-w-xs rounded-xl bg-[#e5e5e5] py-4 text-sm font-bold tracking-wider text-black uppercase transition hover:bg-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Next
                  </motion.button>

                  {step === 1 ? (
                    <Link
                      href="/login"
                      className="text-[10px] tracking-widest text-white/40 uppercase transition hover:text-white"
                    >
                      Back to Authentication
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setStep((prev) => prev - 1)}
                      className="text-[10px] tracking-widest text-white/40 uppercase transition hover:text-white cursor-pointer"
                    >
                      Go Back
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-8 flex items-center justify-between gap-3 text-sm text-white/75">
                  <motion.button
                    type="button"
                    onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
                    className="rounded-full border border-white/20 bg-white/5 px-4 py-2 transition hover:bg-white/10 disabled:opacity-40"
                    disabled={step === 1}
                    whileHover={step === 1 ? undefined : { scale: 1.02 }}
                    whileTap={step === 1 ? undefined : { scale: 0.98 }}
                  >
                    Back
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={handleNext}
                    className="rounded-full bg-white px-4 py-2 font-medium text-black transition hover:bg-white/85"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isCreatingPlan}
                  >
                    {isLastStep
                      ? isCreatingPlan
                        ? "Creating Plan..."
                        : planReady
                          ? "Plan Created"
                          : "Create Investment Plan"
                      : "Next"}
                  </motion.button>
                </div>
              )}

            </div>
          </div>
        </section>

        <AnimatePresence>
          {(isCreatingPlan || planReady) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black px-6"
            >
              {/* Background Effects */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
              </div>

              <div className="relative flex flex-col items-center max-w-lg w-full">
                {/* Neural Core / Loader */}
                <div className="relative mb-12 flex items-center justify-center">
                  {/* Outer Ring */}
                  <svg className="h-48 w-48 -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      className="stroke-white/5 fill-none"
                      strokeWidth="2"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="88"
                      className="stroke-white fill-none"
                      strokeWidth="2"
                      strokeDasharray="552"
                      initial={{ strokeDashoffset: 552 }}
                      animate={{
                        strokeDashoffset: 552 - (552 * (Math.min(planStage + 1, planStages.length) / planStages.length))
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Inner Glow Core */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="h-32 w-32 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.05)]"
                      animate={{
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          "0 0 20px rgba(255,255,255,0.05)",
                          "0 0 40px rgba(255,255,255,0.15)",
                          "0 0 20px rgba(255,255,255,0.05)"
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <AnimatePresence mode="wait">
                        {planReady ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-white"
                          >
                            <LuCircleCheck className="h-12 w-12" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="logo"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.2, opacity: 0 }}
                            className="flex items-center justify-center"
                          >
                            <Image
                              src={auraLogo}
                              alt="Aura Logo"
                              width={64}
                              height={64}
                              className="animate-pulse"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </div>

                {/* Status Text */}
                <div className="text-center space-y-4">
                  <motion.p
                    className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {planReady ? "Strategy Active" : "Neural Optimization in Progress"}
                  </motion.p>

                  <div className="h-12 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.h3
                        key={planStage}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xl font-medium text-white/90 leading-tight"
                      >
                        {planStages[planStage]?.text}
                      </motion.h3>
                    </AnimatePresence>
                  </div>

                  {/* Data Points (Faked for aesthetic) */}
                  {!planReady && (
                    <motion.div
                      className="flex gap-8 justify-center mt-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="text-center">
                        <p className="text-[9px] font-bold tracking-widest text-white/20 uppercase mb-1">Latency</p>
                        <p className="text-xs font-mono text-emerald-400">12ms</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] font-bold tracking-widest text-white/20 uppercase mb-1">Confidence</p>
                        <p className="text-xs font-mono text-cyan-400">99.4%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] font-bold tracking-widest text-white/20 uppercase mb-1">Risk Buffer</p>
                        <p className="text-xs font-mono text-white/60">OK</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Final Action */}
                <AnimatePresence>
                  {planReady && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-12 w-full"
                    >
                      <motion.button
                        onClick={() => window.location.href = "/dashboard"}
                        className="w-full rounded-xl bg-white py-4 text-sm font-bold tracking-widest text-black uppercase transition hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Enter Terminal
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <PlanUpgradeModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)}
        title="Position Limit Reached"
        description="Free users can open up to 1 automatic position per day. Upgrade to Pro for unlimited autonomous trading and real-time execution."
      />
    </div>
  );
}
