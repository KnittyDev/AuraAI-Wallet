"use client";

import { useState } from "react";
import { useLanguage } from "@/context/language-context";

type QuestionItem = {
  question: string;
  answer: string;
};

export function QuestionsSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const questionsList: QuestionItem[] = t("faq.items");

  return (
    <section
      className="mt-16 w-full max-w-6xl"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 760px" }}
    >
      <div className="mb-6 text-left">
        <h2 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">{t("faq.title")}</h2>
        <p className="mt-2 text-sm text-white/60 md:text-base">
          {t("faq.subtitle")}
        </p>
      </div>

      <div className="space-y-2.5">
        {questionsList.map((item, index) => {
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

