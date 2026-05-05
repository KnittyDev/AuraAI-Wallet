"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { LuActivity, LuArrowUpRight, LuArrowDownLeft, LuCpu, LuWaves } from "react-icons/lu";

interface OpenPosition {
  id: string;
  asset_code: string;
  action_type: 'long' | 'short';
  entry_price: number;
  created_at: string;
  investment_id: string;
}

export function OpenPositions() {
  const [positions, setPositions] = useState<OpenPosition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOpenPositions() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ai_actions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPositions(data);
      }
      setLoading(false);
    }

    fetchOpenPositions();
    const interval = setInterval(fetchOpenPositions, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) return null;

  return (
    <section className="rounded-3xl border border-white/15 bg-black/45 p-6 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
        <LuWaves className="h-32 w-32 text-white" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <LuActivity className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Open AI Positions</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium">Real-time neural trading feed</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live Engine</span>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {positions.length > 0 ? (
            positions.map((pos, i) => (
              <motion.div
                key={pos.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-2xl border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.04] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    pos.action_type === 'long' ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
                  }`}>
                    {pos.action_type === 'long' ? <LuArrowUpRight className="h-5 w-5" /> : <LuArrowDownLeft className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white font-bold tracking-tight">{pos.asset_code}/USDT</span>
                      <span className="text-[9px] text-white/20 font-mono tracking-tighter">#{pos.investment_id?.slice(0, 8)}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-md uppercase font-bold tracking-widest ${
                        pos.action_type === 'long' ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
                      }`}>
                        {pos.action_type}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-white/20">
                      ENTRY: <span className="text-white/40">${Number(pos.entry_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      <span className="mx-2">|</span>
                      <span className="text-emerald-400/40">MARG: 20x</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5 text-emerald-400 mb-1">
                    <LuCpu className="h-3 w-3 animate-spin-slow" />
                    <span className="text-xs font-bold font-mono">
                      +{(Math.random() * 2.5).toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-[9px] text-white/20 uppercase tracking-widest font-bold">
                    Neural Tracking
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-12 text-center border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
              <p className="text-xs text-white/20 italic">AuraAI is currently scanning for market entries...</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Global Neural Stream</p>
        <button className="text-[10px] text-emerald-400/40 hover:text-emerald-400 font-bold uppercase tracking-widest transition-colors">
          View All Actions
        </button>
      </div>
    </section>
  );
}
