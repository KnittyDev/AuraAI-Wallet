"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import {
  LuSearch,
  LuKey,
  LuShieldCheck,
  LuSmartphone,
  LuCreditCard,
  LuFileText,
  LuLifeBuoy,
  LuHeadphones,
  LuMessageSquare,
  LuBookOpen,
  LuChevronRight,
  LuZap,
  LuWallet,
  LuArrowRight,
  LuMail
} from "react-icons/lu";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/context/language-context";

export default function SupportCenterPage() {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openGuide, setOpenGuide] = useState<number | null>(null);

  const selfServiceItems = [
    { icon: LuKey, title: t("support.selfServiceItems.resetPassword.title"), desc: t("support.selfServiceItems.resetPassword.desc"), href: "/dashboard/settings" },
    { icon: LuShieldCheck, title: t("support.selfServiceItems.twoFactor.title"), desc: t("support.selfServiceItems.twoFactor.desc"), href: "/dashboard/settings" },
    { icon: LuWallet, title: t("support.selfServiceItems.depositIssue.title"), desc: t("support.selfServiceItems.depositIssue.desc"), href: "/dashboard/settings/support/new-ticket" },
    { icon: LuCreditCard, title: t("support.selfServiceItems.withdrawalStatus.title"), desc: t("support.selfServiceItems.withdrawalStatus.desc"), href: "/dashboard/transactions" },
    { icon: LuFileText, title: t("support.selfServiceItems.exportData.title"), desc: t("support.selfServiceItems.exportData.desc"), href: "/dashboard/settings" },
    { icon: LuSmartphone, title: t("support.selfServiceItems.deviceManagement.title"), desc: t("support.selfServiceItems.deviceManagement.desc"), href: "/dashboard/settings" },
  ];

  const topQuestions = (t("support.faqList") || []) as { q: string; a: string }[];
  const guideItems = (t("support.guidesList") || []) as { q: string; a: string }[];
  const securityList = (t("support.securityList") || []) as string[];
  const tutorialList = (t("support.tutorialList") || []) as string[];

  const filteredSelfService = selfServiceItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaqs = topQuestions.filter(item => 
    item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGuides = guideItems.filter(item => 
    item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Special check for "support" or "ticket" keywords to highlight the tickets section
  const keywords = ["support", "ticket", "bilet", "yardım", "destek", "müşteri"];
  const showTicketsCard = searchQuery.length > 1 && keywords.some(k => searchQuery.toLowerCase().includes(k));

  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-x-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      <DashboardSidebar currentPath="/dashboard/settings" />

      <section className="relative z-10 flex-1 px-4 py-8 md:px-10 overflow-y-auto lg:ml-72 min-w-0 max-w-[100vw]">
        <div className="mx-auto max-w-6xl pb-24">

          {/* Header & Search */}
          <div className="text-center mt-8 mb-16 space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold tracking-tight text-white"
            >
              {t("support.title1")} <br />
              {t("support.title2")}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-2xl mx-auto relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-white/[0.03] border border-white/10 rounded-full px-6 py-4 backdrop-blur-xl transition-colors focus-within:border-cyan-500/50 focus-within:bg-white/[0.05]">
                <LuSearch className="h-6 w-6 text-white/40 mr-4" />
                <input
                  type="text"
                  placeholder={t("support.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-white placeholder:text-white/30 w-full text-lg"
                />
              </div>
            </motion.div>
          </div>

          <AnimatePresence mode="popLayout">
            {/* Self-Service Section */}
            {filteredSelfService.length > 0 && (
              <motion.div
                key="self-service"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-16"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">{t("support.selfService")}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSelfService.map((item, i) => (
                    <Link href={item.href} key={i} className="block">
                      <div className="p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer group relative overflow-hidden h-full">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-colors" />
                        <div className="relative z-10 flex items-start gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/20 transition-colors shrink-0">
                            <item.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-white font-bold mb-1 group-hover:text-white transition-colors">{item.title}</h3>
                            <p className="text-xs text-white/40">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* FAQ Section */}
            {(filteredFaqs.length > 0 || filteredGuides.length > 0) && (
              <motion.div
                key="faq-guides"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-16"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">{t("support.faqGuides")}</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Top Questions */}
                    {filteredFaqs.length > 0 && (
                      <div className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                          <LuLifeBuoy className="h-5 w-5 text-white/60" />
                          {t("support.topQuestions")}
                        </h3>
                        <div className="space-y-4">
                          {filteredFaqs.map((item, i) => (
                            <div key={i} className="border-b border-white/5 last:border-0 pb-4 last:pb-0">
                              <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="flex items-start gap-4 group w-full text-left"
                              >
                                <span className="flex items-center justify-center h-5 w-5 rounded bg-white/5 text-[10px] font-bold text-white/40 shrink-0 mt-0.5 group-hover:bg-white/10 transition-colors">
                                  {i + 1}
                                </span>
                                <span className="text-sm text-white/70 group-hover:text-white transition-colors flex-1">
                                  {item.q}
                                </span>
                                <LuChevronRight className={`h-4 w-4 text-white/20 transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
                              </button>
                              <AnimatePresence>
                                {openFaq === i && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <p className="text-xs text-white/40 mt-3 ml-9 leading-relaxed">
                                      {item.a}
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Aura Wallet Guide */}
                    {filteredGuides.length > 0 && (
                      <div className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-bold text-white flex items-center gap-3">
                            <LuBookOpen className="h-5 w-5 text-white/60" />
                            {t("support.walletGuide")}
                          </h3>
                        </div>
                        <div className="space-y-4">
                          {filteredGuides.map((item, i) => (
                            <div key={i} className="border-b border-white/5 last:border-0 pb-4 last:pb-0">
                              <button
                                onClick={() => setOpenGuide(openGuide === i ? null : i)}
                                className="w-full text-left flex items-center justify-between group"
                              >
                                <span className="text-sm text-white/70 group-hover:text-white transition-colors">{item.q}</span>
                                <LuChevronRight className={`h-4 w-4 text-white/20 transition-transform ${openGuide === i ? "rotate-90" : ""}`} />
                              </button>
                              <AnimatePresence>
                                {openGuide === i && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <p className="text-xs text-white/40 mt-3 leading-relaxed italic">
                                      {item.a}
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  {(!searchQuery || searchQuery.toLowerCase().includes("security") || searchQuery.toLowerCase().includes("ai") || searchQuery.toLowerCase().includes("trading")) && (
                    <div className="space-y-6">
                      {/* Security & Verification */}
                      <div className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-bold text-white flex items-center gap-3">
                            <LuShieldCheck className="h-5 w-5 text-white/60" />
                            {t("support.securityVerification")}
                          </h3>
                        </div>
                        <div className="space-y-4">
                          {securityList.map((sec, i) => (
                            <div key={i} className="text-sm text-white/70 py-1 border-b border-white/5 last:border-0 pb-3 last:pb-0">
                              {sec}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI Trading Tutorial */}
                      <Link href="/dashboard/settings/support/ai-tutorial" className="block">
                        <div className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl relative overflow-hidden group hover:bg-white/[0.05] transition-all">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] rounded-full -mr-10 -mt-10 group-hover:bg-white/10 transition-colors" />
                          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                            <LuZap className="h-5 w-5 text-white/60" />
                            {t("support.aiTutorial")}
                          </h3>
                          <div className="space-y-4 relative z-10">
                            {tutorialList.map((tut, i) => (
                              <div key={i} className="text-sm text-white/70 py-1 border-b border-white/5 pb-3">
                                {tut}
                              </div>
                            ))}
                            <div className="flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white transition-colors py-2 mt-2">
                              {t("support.viewFullTutorial")} <LuArrowRight className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Need More Support Section */}
            {(!searchQuery || showTicketsCard) && (
              <motion.div
                key="need-more-support"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">{t("support.needMoreSupport")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Chat Support */}
                  <Link href="/dashboard/settings/support/tickets" className="block">
                    <div className={`p-8 rounded-[2.5rem] border transition-all flex items-center justify-between group h-full ${
                      showTicketsCard ? 'border-cyan-500/50 bg-cyan-500/5 ring-4 ring-cyan-500/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.05]'
                    }`}>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">{t("support.myTickets")}</h3>
                        <p className="text-sm text-white/40 max-w-[250px] mb-6">
                          {t("support.myTicketsDesc")}
                        </p>
                        <div className="inline-flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">
                          {t("support.viewTickets")} <LuArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                      <div className={`h-20 w-20 rounded-full flex items-center justify-center shrink-0 border transition-all group-hover:scale-110 ${
                        showTicketsCard ? 'bg-cyan-500/20 border-cyan-500/30' : 'bg-white/5 border-white/10'
                      }`}>
                        <LuHeadphones className={`h-8 w-8 ${showTicketsCard ? 'text-cyan-400' : 'text-white/60'}`} />
                      </div>
                    </div>
                  </Link>

                  {/* Product Feedback */}
                  <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-all flex items-center justify-between group">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{t("support.feedback")}</h3>
                      <p className="text-sm text-white/40 max-w-[250px] mb-6">
                        {t("support.feedbackDesc")}
                      </p>
                      <Link href="#" className="inline-flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest hover:text-white transition-colors">
                        {t("support.shareFeedback")} <LuArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                    <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-110 transition-transform">
                      <LuMessageSquare className="h-8 w-8 text-white/60" />
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* Empty Search State */}
            {searchQuery && filteredSelfService.length === 0 && filteredFaqs.length === 0 && filteredGuides.length === 0 && !showTicketsCard && (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <div className="h-24 w-24 rounded-full bg-white/5 border border-dashed border-white/10 flex items-center justify-center mx-auto mb-6 text-white/10">
                  <LuSearch className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t("support.noResults")} &quot;{searchQuery}&quot;</h3>
                <p className="text-white/40 text-sm max-w-xs mx-auto mb-8">{t("support.noResultsDesc")}</p>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-widest transition-colors"
                >
                  {t("support.clearSearch")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>
    </main>
  );
}
