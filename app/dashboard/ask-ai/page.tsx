"use client";

import { useState, useRef, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuSend,
  LuMessageSquare,
  LuUser,
  LuSparkles,
  LuTrendingUp,
  LuWallet,
  LuHistory
} from "react-icons/lu";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/lib/supabase";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export default function AskAIPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I am Aura, your AI investment assistant. I've analyzed your current portfolio and I'm ready to help. How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [balanceRes, invRes, profitRes] = await Promise.all([
        supabase.from('balances').select('*').eq('user_id', user.id).eq('asset_code', 'USDT').single(),
        supabase.from('investments').select('*').eq('user_id', user.id).eq('status', 'active'),
        supabase.from('ai_actions').select('*').eq('user_id', user.id)
      ]);

      const allActions = profitRes.data || [];
      const totalProfit = allActions.reduce((acc, p) => acc + Number(p.profit_usd || 0), 0) || 0;
      
      const stats = {
        openLongs: allActions.filter(a => a.status === 'open' && a.action_type === 'long').length,
        openShorts: allActions.filter(a => a.status === 'open' && a.action_type === 'short').length,
        closedLongs: allActions.filter(a => a.status === 'closed' && a.action_type === 'long').length,
        closedShorts: allActions.filter(a => a.status === 'closed' && a.action_type === 'short').length,
        totalTrades: allActions.length
      };

      setUserData({
        availableUSDT: balanceRes.data?.amount || 0,
        investments: invRes.data || [],
        totalProfit: totalProfit.toFixed(2),
        tradeStats: stats,
        lastUpdated: new Date().toISOString()
      });
    }
    fetchUserData();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Prepare context for the AI
    const context = userData ? `
    USER DATA CONTEXT:
    - Available Balance: ${userData.availableUSDT} USDT
    - Total Realized Profit: ${userData.totalProfit} USDT
    - Active Investments: ${userData?.investments?.map((inv: any) => 
      `${inv.asset_code}: $${inv.amount} (${inv.risk_profile} risk)`
    ).join(", ") || "None"}
    - Trade Statistics:
      * Total Trades: ${userData?.tradeStats?.totalTrades || 0}
      * Open Positions: ${userData?.tradeStats?.openLongs || 0} Long, ${userData?.tradeStats?.openShorts || 0} Short
      * Closed Positions: ${userData?.tradeStats?.closedLongs || 0} Long, ${userData?.tradeStats?.closedShorts || 0} Short
    ` : "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [
            { role: "system", content: `You are AuraAI, a premium investment assistant. Use the following user data to answer questions accurately: ${context}` },
            ...messages, 
            userMessage
          ] 
        }),
      });

      const data = await response.json();
      if (data.content) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "I'm sorry, I encountered an error. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    { text: "Analyze my portfolio", icon: LuTrendingUp },
    { text: "Market outlook for SOL", icon: LuSparkles },
    { text: "Balance breakdown", icon: LuWallet },
    { text: "Recent trade history", icon: LuHistory },
  ];

  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      <DashboardSidebar currentPath="/dashboard/ask-ai" />

      <section className="relative z-10 flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="px-6 py-6 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden shadow-lg shadow-cyan-500/10">
              <Image src="/auralogo.png" alt="Aura Logo" width={40} height={40} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Ask Aura AI</h1>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Online & Analyzing</span>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-8 md:px-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 max-w-[90%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`h-8 w-8 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center ${m.role === "user"
                        ? "bg-white/10 border border-white/20 text-white"
                        : "bg-black"
                      }`}>
                      {m.role === "user" ? <LuUser className="h-4 w-4" /> : <Image src="/auralogo.png" alt="Aura" width={32} height={32} />}
                    </div>

                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm overflow-hidden prose prose-invert prose-sm max-w-none ${m.role === "user"
                        ? "bg-white text-black font-medium rounded-tr-none"
                        : "bg-white/5 border border-white/10 backdrop-blur-sm text-white/90 rounded-tl-none"
                      }`}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          table: ({ node, ...props }) => (
                            <div className="overflow-x-auto my-4 rounded-xl border border-white/10">
                              <table className="min-w-full divide-y divide-white/10" {...props} />
                            </div>
                          ),
                          th: ({ node, ...props }) => (
                            <th className="bg-white/5 px-4 py-2 text-left text-xs font-bold uppercase tracking-wider" {...props} />
                          ),
                          td: ({ node, ...props }) => (
                            <td className="px-4 py-2 border-t border-white/5" {...props} />
                          ),
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-4 space-y-1" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-4 space-y-1" {...props} />,
                          h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2 text-cyan-400" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-md font-bold mb-2 text-cyan-400" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-2 text-cyan-400" {...props} />,
                          blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-cyan-500/50 pl-4 italic text-white/60 my-4" {...props} />,
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>


            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-black overflow-hidden flex items-center justify-center animate-pulse">
                    <Image src="/auralogo.png" alt="Aura" width={32} height={32} />
                  </div>

                  <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full animate-bounce" />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="px-4 py-6 md:px-10 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q.text)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/60 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <q.icon className="h-3 w-3" />
                    {q.text}
                  </button>
                ))}
              </div>
            )}

            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask Aura about your investments..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all group-hover:bg-white/[0.08]"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-white text-black flex items-center justify-center hover:bg-cyan-400 transition-all disabled:opacity-50 disabled:hover:bg-white"
              >
                <LuSend className="h-5 w-5" />
              </button>
            </div>
            <p className="text-[10px] text-center text-white/20 uppercase tracking-widest font-bold">
              Powered by Claude 4.7 Sonnet & Aura Neural Engine
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
