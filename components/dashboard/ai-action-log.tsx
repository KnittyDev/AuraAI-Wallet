"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LuTerminal, LuArrowUpRight, LuArrowDownLeft, LuActivity, LuCpu } from "react-icons/lu";
import { useLanguage } from "@/context/language-context";

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
  const { language, t } = useLanguage();

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
            <h3 className="text-lg font-bold text-white tracking-tight">{t("actionLog.title")}</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium">{t("actionLog.subtitle")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{t("actionLog.liveMonitoring")}</span>
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
                className="p-4 rounded-xl border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.03] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group/item"
              >
                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                  <div className={`shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${action.action_type === 'long' ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
                    }`}>
                    {action.action_type === 'long' ? <LuArrowUpRight className="h-4 w-4" /> : <LuArrowDownLeft className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-white/40">[{new Date(action.created_at).toLocaleTimeString(language === "tr" ? "tr-TR" : "en-US", { hour12: false })}]</span>
                      <span className="text-white font-bold">{action.asset_code}/USDT</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-widest ${action.action_type === 'long' ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
                        }`}>
                        {t(`marketData.${action.action_type}`)}
                      </span>
                    </div>
                    <div className="text-[10px] text-white/20 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span>{t("investments.pdf.logHeaders.entry").toUpperCase()}: <span className="text-white/40">${Number(action.entry_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></span>
                      {action.status === 'closed' && (
                        <>
                          <span className="hidden sm:inline">|</span>
                          <span>{t("investments.pdf.logHeaders.exit").toUpperCase()}: <span className="text-white/40">${Number(action.exit_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                  {action.status === 'open' ? (
                    <div className="flex items-center gap-2 text-cyan-400">
                      <LuActivity className="h-3 w-3 animate-pulse shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{t("actionLog.monitoring")}</span>
                    </div>
                  ) : (
                    <div className={`font-bold text-sm sm:text-xs ${Number(action.profit_usd) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {Number(action.profit_usd) >= 0 ? "+" : ""}{Number(action.profit_usd).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                    </div>
                  )}
                  <div className="text-[9px] text-white/10 uppercase tracking-widest mt-0 sm:mt-1">
                    {action.status === 'open' ? t("actionLog.activePosition") : t("actionLog.strategyComplete")}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl">
              <LuActivity className="h-8 w-8 text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold">{t("actionLog.scanningMarkets")}</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">
        <span>{t("actionLog.engineVersion")}</span>
      </div>
    </section>
  );
}
