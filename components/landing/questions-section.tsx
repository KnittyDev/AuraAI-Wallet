"use client";

import { useState } from "react";

type QuestionItem = {
  question: string;
  answer: string;
};

const questions: QuestionItem[] = [
  {
    question: "What is Aura?",
    answer:
      "Aura is an AI-native autonomous trading platform that helps you manage portfolios, execute trades, and track performance with minimal manual work.",
  },
  {
    question: "Is Aura free to use?",
    answer:
      "Yes. You can start with the Free plan. For advanced autonomous capabilities and unlimited operations, you can upgrade to the $15 Pro plan.",
  },
  {
    question: "How does automated trading work?",
    answer:
      "You set your preferences and strategy boundaries, then Aura continuously evaluates market conditions and executes trades automatically.",
  },
  {
    question: "Can I withdraw funds instantly?",
    answer:
      "Instant withdrawals are available on Pro. Free plan users can make one withdrawal every 3 days.",
  },
  {
    question: "Does Aura provide buy and sell suggestions?",
    answer:
      "Yes. Aura provides AI-powered suggestions and can also run auto buy/auto sell flows based on your selected plan.",
  },
  {
    question: "Can Aura run 24/7?",
    answer:
      "Yes. Pro users get full autonomous 24/7 trade execution and management.",
  },
];

export function QuestionsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className="mt-16 w-full max-w-6xl"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 760px" }}
    >
      <h2 className="mb-6 text-left text-4xl font-semibold text-white md:text-6xl">
        Questions?
      </h2>

      <div className="space-y-2.5">
        {questions.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <article
              key={item.question}
              className="rounded-3xl border border-white/15 bg-[#1a1c22]/90 px-6 py-5 text-left backdrop-blur-sm"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <span className="text-2xl font-medium text-white">{item.question}</span>
                <span
                  className={`text-2xl leading-none text-white/80 transition-transform duration-300 ${
                    isOpen ? "rotate-45" : "rotate-0"
                  }`}
                >
                  +
                </span>
              </button>

              <div
                className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="max-w-5xl text-lg text-white/65">{item.answer}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
