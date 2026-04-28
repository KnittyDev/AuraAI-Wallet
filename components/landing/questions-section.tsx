"use client";

import { useState } from "react";

type QuestionItem = {
  question: string;
  answer: string;
};

const questions: QuestionItem[] = [
  {
    question: "What exactly is Aura AI?",
    answer:
      "Aura is an AI-native autonomous trading and portfolio management platform. It uses advanced language models and real-time market data to execute complex investment strategies, manage risk, and optimize your crypto holdings without requiring manual intervention.",
  },
  {
    question: "How does the AI make trading decisions?",
    answer:
      "Aura AI leverages the Claude Opus 4.7 model, utilizing advanced artificial intelligence specifically trained in the domains of investment and cryptocurrency. The system continuously analyzes real-time news, social sentiment, on-chain data, and live market streams. It autonomously executes trades based on its assessment of these signals to optimize performance in line with your risk profile.",
  },
  {
    question: "Is my capital secure with Aura?",
    answer:
      "Security is our top priority. Aura uses institutional-grade encryption for all data and API connections. We never have direct access to withdraw your funds from connected exchanges; the system only has 'Trade' and 'View' permissions. Additionally, we use multi-sig cold storage for any assets held within the Aura ecosystem.",
  },
  {
    question: "Which assets and exchanges are supported?",
    answer:
      "Aura currently supports all major cryptocurrencies including BTC, ETH, SOL, and USDT. We provide seamless integration with top-tier exchanges like Binance, Coinbase, and Kraken, as well as direct on-chain execution for decentralized protocols.",
  },
  {
    question: "How does the Pro plan differ from the Free plan?",
    answer:
      "While the Free plan allows you to explore basic portfolio tracking and manual AI suggestions, the Pro plan ($15/mo) unlocks 24/7 fully autonomous trading, instant withdrawals, advanced risk guardrails, and priority execution on all strategies.",
  },
  {
    question: "How does Aura handle extreme market volatility?",
    answer:
      "Aura includes 'Neural Risk Guards' that monitor market stress 24/7. In the event of a flash crash or extreme volatility, the AI can automatically move assets to stables, tighten stop-losses, or hedge positions using shorts to protect your capital from significant drawdowns.",
  },
  {
    question: "Are there any hidden fees per trade?",
    answer:
      "No. Aura does not charge any percentage-based commissions or hidden spreads on your trades. You only pay your monthly subscription fee (if on Pro) and the standard transaction fees charged by the underlying exchanges or blockchain networks.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer:
      "Yes. You can downgrade or cancel your Pro subscription at any time with a single click. There are no long-term contracts or cancellation fees.",
  },
  {
    question: "Why is there a monthly subscription fee?",
    answer:
      "Operating a 24/7 autonomous AI requires significant compute resources. Your subscription directly covers the high cost of Claude Opus 4.7 tokens (which Aura 'burns' as it analyzes data), high-frequency market data streams, and the secure cloud infrastructure required to execute trades with millisecond latency across global markets.",
  },
];

export function QuestionsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className="mt-16 w-full max-w-6xl"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 760px" }}
    >
      <div className="mb-6 text-left">
        <h2 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">Questions?</h2>
        <p className="mt-2 text-sm text-white/60 md:text-base">
          Everything you need to know before you start.
        </p>
      </div>

      <div className="space-y-2.5">
        {questions.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <article
              key={item.question}
              className={`rounded-3xl border px-6 py-5 text-left backdrop-blur-sm transition-colors ${isOpen
                  ? "border-white/30 bg-gradient-to-r from-[#1d2030]/95 to-[#1a1c22]/95"
                  : "border-white/12 bg-[#171922]/88"
                }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <span className="text-xl font-medium text-white md:text-3xl">{item.question}</span>
                <span
                  className={`text-2xl leading-none transition-transform duration-300 ${isOpen ? "rotate-45 text-white" : "rotate-0 text-white/75"
                    }`}
                >
                  +
                </span>
              </button>

              <div
                className={`grid overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div className="overflow-hidden">
                  <p className="max-w-5xl text-base text-white/65 md:text-xl">{item.answer}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
