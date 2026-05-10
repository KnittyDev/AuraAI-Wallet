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

const selfServiceItems = [
  { icon: LuKey, title: "Reset Password", desc: "Recover your master key safely", href: "/dashboard/settings" },
  { icon: LuShieldCheck, title: "2FA Management", desc: "Enable or disable Authenticator", href: "/dashboard/settings" },
  { icon: LuWallet, title: "Crypto Deposit Issue", desc: "Track unconfirmed transactions", href: "/dashboard/settings/support/new-ticket" },
  { icon: LuCreditCard, title: "Withdrawal Status", desc: "Check stuck or pending withdrawals", href: "/dashboard/transactions" },
  { icon: LuFileText, title: "Export Data", desc: "Download your portfolio reports", href: "/dashboard/settings" },
  { icon: LuSmartphone, title: "Device Management", desc: "Manage authorized sessions", href: "/dashboard/settings" },
];

const topQuestions = [
  {
    q: "Do I need Identity Verification (KYC)?",
    a: "Currently, Aura Wallet prioritizes privacy. Most core features are available without KYC. However, to access higher withdrawal limits or premium enterprise features, verification may be required."
  },
  {
    q: "How do I deposit crypto into my Aura Wallet?",
    a: "Navigate to the 'Deposit' page from your dashboard, select the asset (e.g., BTC, ETH, USDT) and the network. A unique wallet address and QR code will be generated for you to send funds to."
  },
  {
    q: "Why is my withdrawal suspended?",
    a: "Withdrawals may be temporarily held for 24 hours following a password change, 2FA reset, or if our security system detects unusual login patterns. This is to protect your funds from unauthorized access."
  },
  {
    q: "How does Aura AI execute trading strategies?",
    a: "Our neural engine analyzes real-time market sentiment, social signals, and technical indicators across 40+ exchanges to execute high-probability 'Long' or 'Short' positions automatically."
  },
  {
    q: "What happens if my strategy loses money?",
    a: "If you lose money with AuraAI, and provided your investment plan has not yet ended and is still active, AuraAI will do everything in its power to recover those losses; however, even in that case, if you still incur a loss, between 15% and 30% of your loss (for investments of €500 or more) will be refunded to you."
  },
];

const guideItems = [
  {
    q: "What is Aura Wallet?",
    a: "Aura is a next-generation non-custodial wallet integrated with a powerful AI trading engine, allowing you to manage assets and grow wealth autonomously."
  },
  {
    q: "Tracking Performance",
    a: "You can view real-time ROI, P&L curves, and asset distribution directly on your 'Investment Dashboard' with millisecond accuracy."
  },
  {
    q: "AI Action Logs",
    a: "Every trade made by the AI is logged with entry price, exit price, and rationale. You can view these in the 'Execution Feed' section."
  },
];

export default function SupportCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openGuide, setOpenGuide] = useState<number | null>(null);

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
  const showTicketsCard = searchQuery.length > 1 && keywords.some(k => k.includes(searchQuery.toLowerCase()));

  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      <DashboardSidebar currentPath="/dashboard/settings" />

      <section className="relative z-10 flex-1 px-4 py-8 md:px-10 overflow-y-auto">
        <div className="mx-auto max-w-6xl pb-24">

          {/* Header & Search */}
          <div className="text-center mt-8 mb-16 space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold tracking-tight text-white"
            >
              Welcome to <br />
              Aura Help Center
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
                  placeholder="Search for articles, guides, or issues..."
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
                  <h2 className="text-2xl font-bold text-white">Self-Service</h2>
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
                  <h2 className="text-2xl font-bold text-white">FAQ & Guides</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Top Questions */}
                    {filteredFaqs.length > 0 && (
                      <div className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                          <LuLifeBuoy className="h-5 w-5 text-white/60" />
                          Top Questions
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
                            Aura Wallet Guide
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

                  {/* Right Column (Show if not searching or if search matches something related to security/AI) */}
                  {(!searchQuery || searchQuery.toLowerCase().includes("security") || searchQuery.toLowerCase().includes("ai") || searchQuery.toLowerCase().includes("trading")) && (
                    <div className="space-y-6">
                      {/* Security & Verification */}
                      <div className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-bold text-white flex items-center gap-3">
                            <LuShieldCheck className="h-5 w-5 text-white/60" />
                            Security & Verification
                          </h3>
                        </div>
                        <div className="space-y-4">
                          <div className="text-sm text-white/70 py-1 border-b border-white/5 pb-3">Identity verification ensures high-tier security and unlocks premium institutional limits.</div>
                          <div className="text-sm text-white/70 py-1 border-b border-white/5 pb-3">Lost your 2FA? Use your master recovery key or contact support with KYC proof.</div>
                          <div className="text-sm text-white/70 py-1 border-b border-white/5 pb-3">Enable anti-phishing codes in settings to verify every email from Aura.</div>
                        </div>
                      </div>

                      {/* AI Trading Tutorial */}
                      <Link href="/dashboard/settings/support/ai-tutorial" className="block">
                        <div className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl relative overflow-hidden group hover:bg-white/[0.05] transition-all">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] rounded-full -mr-10 -mt-10 group-hover:bg-white/10 transition-colors" />
                          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                            <LuZap className="h-5 w-5 text-white/60" />
                            AI Trading Tutorial
                          </h3>
                          <div className="space-y-4 relative z-10">
                            <div className="text-sm text-white/70 py-1 border-b border-white/5 pb-3">Step 1: Deposit funds. Step 2: Choose a risk profile. Step 3: Aura handles the rest.</div>
                            <div className="text-sm text-white/70 py-1 border-b border-white/5 pb-3">Aggressive: High reward, high volatility. Growth: Balanced long-term wealth.</div>
                            <div className="flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white transition-colors py-2 mt-2">
                              View full tutorial <LuArrowRight className="h-4 w-4" />
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
                <h2 className="text-2xl font-bold text-white mb-6">Need More Support?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Chat Support */}
                  <Link href="/dashboard/settings/support/tickets" className="block">
                    <div className={`p-8 rounded-[2.5rem] border transition-all flex items-center justify-between group h-full ${
                      showTicketsCard ? 'border-cyan-500/50 bg-cyan-500/5 ring-4 ring-cyan-500/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.05]'
                    }`}>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">My Support Tickets</h3>
                        <p className="text-sm text-white/40 max-w-[250px] mb-6">
                          View your previous conversations or open a ticket to get help from our 24/7 team.
                        </p>
                        <div className="inline-flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">
                          View Tickets <LuArrowRight className="h-4 w-4" />
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
                      <h3 className="text-lg font-bold text-white mb-2">Product Feedback</h3>
                      <p className="text-sm text-white/40 max-w-[250px] mb-6">
                        Help us improve Aura Wallet. Share your ideas, suggestions, or bug reports.
                      </p>
                      <Link href="#" className="inline-flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest hover:text-white transition-colors">
                        Share Feedback <LuArrowRight className="h-4 w-4" />
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
                <h3 className="text-xl font-bold text-white mb-2">No results for &quot;{searchQuery}&quot;</h3>
                <p className="text-white/40 text-sm max-w-xs mx-auto mb-8">Try using different keywords or check out our FAQ categories below.</p>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-widest transition-colors"
                >
                  Clear Search
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>
    </main>
  );
}
