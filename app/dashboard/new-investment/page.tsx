"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SiBinance, SiBitcoin, SiEthereum, SiSolana, SiTether } from "react-icons/si";

const cryptoOptions = [
  { code: "BTC", icon: SiBitcoin },
  { code: "ETH", icon: SiEthereum },
  { code: "SOL", icon: SiSolana },
  { code: "BNB", icon: SiBinance },
  { code: "USDT", icon: SiTether },
];
const riskOptions = ["Low", "Medium", "High"];

export default function NewInvestmentPage() {
  const [step, setStep] = useState(1);
  const [crypto, setCrypto] = useState("BTC");
  const [risk, setRisk] = useState("Medium");
  const [amount, setAmount] = useState("1000");
  const [days, setDays] = useState("30");

  const isLastStep = step === 5;
  const stepAnimation = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.22, ease: "easeOut" as const },
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
              <p className="text-sm text-white/55">Step {step} / 5</p>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((dot) => (
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
                    key={option}
                    type="button"
                    onClick={() => setRisk(option)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      risk === option
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
            <motion.div
              key="step-5"
              className="mt-4 max-w-2xl rounded-2xl border border-white/15 bg-white/5 p-4"
              {...stepAnimation}
            >
              <p className="text-lg font-medium text-white">Review your plan</p>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li>Crypto: <span className="font-medium text-white">{crypto}</span></li>
                <li>Risk level: <span className="font-medium text-white">{risk}</span></li>
                <li>Investment amount: <span className="font-medium text-white">${amount}</span></li>
                <li>Duration: <span className="font-medium text-white">{days} days</span></li>
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
              onClick={() => setStep((prev) => Math.min(prev + 1, 5))}
              className="rounded-full bg-white px-4 py-2 font-medium text-black transition hover:bg-white/85"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLastStep ? "Finish" : "Next"}
            </motion.button>
          </div>
          </div>
        </div>
      </section>
    </main>
  );
}
