"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LuTerminal, LuArrowUpRight, LuArrowDownLeft, LuActivity, LuCpu } from "react-icons/lu";

interface AiAction {
  id: string;
  asset_code: string;
  action_type: 'long' | 'short';
  entry_price: number;
  exit_price?: number;
  profit_usd?: number;
  status: 'open' | 'closed';
  created_at: string;
}

interface AiActionLogProps {
  actions: AiAction[];
}

export function AiActionLog({ actions }: AiActionLogProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-md relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
        <LuCpu className="h-32 w-32 text-white" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <LuTerminal className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">AuraAI Engine Log</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium">Autonomous Execution Stream</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live Monitoring</span>
        </div>
      </div>

      <div className="space-y-3 font-mono text-xs">
        <AnimatePresence mode="popLayout">
          {actions.length > 0 ? (
            actions.map((action, i) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-xl border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.03] transition-colors flex items-center justify-between group/item"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${action.action_type === 'long' ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
                    }`}>
                    {action.action_type === 'long' ? <LuArrowUpRight className="h-4 w-4" /> : <LuArrowDownLeft className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white/40">[{new Date(action.created_at).toLocaleTimeString([], { hour12: false })}]</span>
                      <span className="text-white font-bold">{action.asset_code}/USDT</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-widest ${action.action_type === 'long' ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
                        }`}>
                        {action.action_type}
                      </span>
                    </div>
                    <div className="text-[10px] text-white/20">
                      ENTRY: <span className="text-white/40">${Number(action.entry_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      {action.status === 'closed' && (
                        <>
                          <span className="mx-2">|</span>
                          EXIT: <span className="text-white/40">${Number(action.exit_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {action.status === 'open' ? (
                    <div className="flex items-center gap-2 text-cyan-400">
                      <LuActivity className="h-3 w-3 animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Monitoring...</span>
                    </div>
                  ) : (
                    <div className={`font-bold ${Number(action.profit_usd) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {Number(action.profit_usd) >= 0 ? "+" : ""}{Number(action.profit_usd).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                    </div>
                  )}
                  <div className="text-[9px] text-white/10 uppercase tracking-widest mt-1">
                    {action.status === 'open' ? "Active Position" : "Strategy Complete"}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl">
              <LuActivity className="h-8 w-8 text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold">Scanning Markets for Opportunity...</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">
        <span>Engine Version: 2.4.0-AuraAI with Claude Opus 4.7 Max</span>
      </div>
    </section>
  );
}
