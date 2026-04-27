"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuBot, LuCircleCheck, LuLoaderCircle, LuShieldCheck, LuTrendingUp } from "react-icons/lu";
import { SiBinance, SiBitcoin, SiEthereum, SiSolana, SiTether } from "react-icons/si";

const cryptoOptions = [
  { code: "BTC", icon: SiBitcoin },
  { code: "ETH", icon: SiEthereum },
  { code: "SOL", icon: SiSolana },
  { code: "BNB", icon: SiBinance },
  { code: "USDT", icon: SiTether },
];
const riskOptions = [
  { level: "Low", monthlyReturn: "+4% to +7%", note: "Lower volatility, steady pace" },
  { level: "Medium", monthlyReturn: "+8% to +14%", note: "Balanced risk/reward profile" },
  { level: "High", monthlyReturn: "+15% to +28%", note: "Higher upside, higher drawdown risk" },
];
const goalOptions = ["Capital Growth", "Passive Income", "Capital Preservation"];
const experienceOptions = ["Beginner", "Intermediate", "Advanced"];
const strategyOptions = ["Safe", "Aggressive", "Balanced Growth"];

export default function NewInvestmentPage() {
  const [step, setStep] = useState(1);
  const [crypto, setCrypto] = useState("BTC");
  const [risk, setRisk] = useState("Medium");
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

  const TOTAL_STEPS = 8;
  const isLastStep = step === TOTAL_STEPS;
  const planStages = [
    { icon: LuBot, text: "Aura AI is analyzing your investment profile..." },
    { icon: LuTrendingUp, text: "Building your strategy and preparing entry zones..." },
    { icon: LuShieldCheck, text: "Applying risk controls and position sizing..." },
    { icon: LuCircleCheck, text: "Your plan is ready. Positions are being prepared." },
  ];
  const stepAnimation = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.22, ease: "easeOut" as const },
  };

  const handleNext = () => {
    if (!isLastStep) {
      setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
      return;
    }

    if (isCreatingPlan || planReady) return;

    setIsCreatingPlan(true);
    setPlanReady(false);
    setPlanStage(0);

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
  };

  return (
    <main className="min-h-screen bg-black px-6 py-8 text-white md:px-10">
      <section className="mx-auto w-full max-w-4xl">
        <div className="mb-10 flex justify-end">
          <Link
            href="/dashboard"
            className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Explain your investment ideas
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-white/65 md:text-lg">
            Step by step onboarding to create your next investment plan.
          </p>
        </div>

        <div className="relative mt-10 w-full rounded-[28px] border border-white/15 bg-black/45 p-5 text-left shadow-2xl backdrop-blur-sm md:p-6">
          <div className="pointer-events-none absolute -left-20 top-6 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-6 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-white/55">Step {step} / {TOTAL_STEPS}</p>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((dot) => (
                  <span
                    key={dot}
                    className={`h-1.5 w-5 rounded-full ${
                      dot <= step ? "bg-white/85" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>

          <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step-1" className="mt-4 max-w-2xl" {...stepAnimation}>
              <p className="mb-3 text-lg font-medium text-white">Which crypto do you want to invest in?</p>
              <div className="max-w-sm space-y-2">
                {cryptoOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                  <motion.button
                    key={option.code}
                    type="button"
                    onClick={() => setCrypto(option.code)}
                    className={`flex w-full items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm transition ${
                      crypto === option.code
                        ? "border-white bg-white text-black"
                        : "border-white/20 bg-white/5 text-white hover:bg-white/10"
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{option.code}</span>
                  </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step-2" className="mt-4 max-w-2xl" {...stepAnimation}>
              <p className="mb-3 text-lg font-medium text-white">What is your risk level?</p>
              <div className="flex flex-wrap gap-2">
                {riskOptions.map((option) => (
                  <motion.button
                    key={option.level}
                    type="button"
                    onClick={() => setRisk(option.level)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      risk === option.level
                        ? "border-white bg-white text-black"
                        : "border-white/20 bg-white/5 text-white hover:bg-white/10"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option.level}
                  </motion.button>
                ))}
              </div>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                {riskOptions.map((option) => (
                  <div
                    key={`${option.level}-detail`}
                    className={`rounded-xl border p-3 ${
                      risk === option.level
                        ? "border-white/35 bg-white/10"
                        : "border-white/12 bg-white/5"
                    }`}
                  >
                    <p className="text-sm font-medium text-white">{option.level} risk</p>
                    <p className="mt-1 text-lg font-semibold text-emerald-300">
                      {option.monthlyReturn}
                    </p>
                    <p className="mt-1 text-xs text-white/60">30-day principal gain estimate</p>
                    <p className="mt-1 text-xs text-white/50">{option.note}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step-3" className="mt-4 max-w-2xl" {...stepAnimation}>
              <label htmlFor="amount" className="mb-3 block text-lg font-medium text-white">
                How much do you want to invest? (USD)
              </label>
              <input
                id="amount"
                type="number"
                min="10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-base text-white outline-none placeholder:text-white/45 focus:border-white/35"
                placeholder="1000"
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step-4" className="mt-4 max-w-2xl" {...stepAnimation}>
              <label htmlFor="days" className="mb-3 block text-lg font-medium text-white">
                For how many days?
              </label>
              <p className="mb-2 text-sm text-amber-300/90">
                Note: We do not recommend plans shorter than 30 days.
              </p>
              <input
                id="days"
                type="number"
                min="1"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-base text-white outline-none placeholder:text-white/45 focus:border-white/35"
                placeholder="30"
              />
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step-5-goal" className="mt-4 max-w-2xl" {...stepAnimation}>
              <p className="mb-3 text-lg font-medium text-white">What is your primary investment goal?</p>
              <div className="flex flex-wrap gap-2">
                {goalOptions.map((option) => (
                  <motion.button
                    key={option}
                    type="button"
                    onClick={() => setGoal(option)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      goal === option
                        ? "border-white bg-white text-black"
                        : "border-white/20 bg-white/5 text-white hover:bg-white/10"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div key="step-6-profile" className="mt-4 max-w-2xl space-y-4" {...stepAnimation}>
              <div>
                <p className="mb-3 text-lg font-medium text-white">Your trading experience</p>
                <div className="flex flex-wrap gap-2">
                  {experienceOptions.map((option) => (
                    <motion.button
                      key={option}
                      type="button"
                      onClick={() => setExperience(option)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        experience === option
                          ? "border-white bg-white text-black"
                          : "border-white/20 bg-white/5 text-white hover:bg-white/10"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-lg font-medium text-white">Preferred strategy</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {strategyOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setStrategy(option)}
                      className={`rounded-xl border px-4 py-2 text-sm text-left transition ${
                        strategy === option
                          ? "border-white bg-white text-black"
                          : "border-white/20 bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 7 && (
            <motion.div key="step-7-rules" className="mt-4 max-w-2xl space-y-4" {...stepAnimation}>
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
                      className={`rounded-xl border px-4 py-2 text-left text-sm transition ${
                        profitAction === option
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

          {step === 8 && (
            <motion.div
              key="step-8"
              className="mt-4 max-w-2xl rounded-2xl border border-white/15 bg-white/5 p-4"
              {...stepAnimation}
            >
              <p className="text-lg font-medium text-white">Review your plan</p>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li>Crypto: <span className="font-medium text-white">{crypto}</span></li>
                <li>Risk level: <span className="font-medium text-white">{risk}</span></li>
                <li>Investment amount: <span className="font-medium text-white">${amount}</span></li>
                <li>Duration: <span className="font-medium text-white">{days} days</span></li>
                <li>Goal: <span className="font-medium text-white">{goal}</span></li>
                <li>Experience: <span className="font-medium text-white">{experience}</span></li>
                <li>Strategy: <span className="font-medium text-white">{strategy}</span></li>
                <li>Profit action: <span className="font-medium text-white">{profitAction}</span></li>
                {notes.trim() && (
                  <li>
                    Notes: <span className="font-medium text-white">{notes}</span>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
          </AnimatePresence>

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

          </div>
        </div>
      </section>

      <AnimatePresence>
        {(isCreatingPlan || planReady) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="w-full max-w-3xl rounded-3xl border border-white/20 bg-[#090b11]/95 p-6 shadow-2xl md:p-8"
            >
              <div className="flex items-start gap-3">
                {isCreatingPlan ? (
                  <LuLoaderCircle className="mt-0.5 h-6 w-6 animate-spin text-cyan-300" />
                ) : (
                  <LuCircleCheck className="mt-0.5 h-6 w-6 text-emerald-300" />
                )}
                <div>
                  <p className="text-2xl font-semibold text-white">
                    {isCreatingPlan
                      ? "Aura AI is creating your investment plan"
                      : "Aura AI completed your investment plan"}
                  </p>
                  <div className="mt-3 rounded-2xl border border-white/15 bg-white/[0.03] px-4 py-3">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={`${planStage}-${isCreatingPlan ? "loading" : "done"}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="text-base text-white/85"
                      >
                        {planStages[planStage]?.text}
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-xs text-white/55">
                      <span>Progress</span>
                      <span>
                        {Math.min(planStage + 1, planStages.length)} / {planStages.length}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300"
                        initial={{ width: "0%" }}
                        animate={{
                          width: `${
                            (Math.min(planStage + 1, planStages.length) / planStages.length) * 100
                          }%`,
                        }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
