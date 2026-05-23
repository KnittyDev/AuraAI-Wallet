"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LuShieldCheck, LuSparkles, LuMoon, LuZap, LuArrowUpRight, LuTrendingUp } from "react-icons/lu";
import { useLanguage } from "@/context/language-context";

export function FeatureShowcaseSection() {
  const { t } = useLanguage();
  const [position, setPosition] = useState<"yes" | "no">("yes");

  const FEATURES = [
    {
      title: t("features.prediction.title"),
      description: t("features.prediction.description"),
      type: "prediction",
      button: t("features.prediction.button")
    },
    {
      title: t("features.ai.title"),
      description: t("features.ai.description"),
      type: "ai",
      button: t("features.ai.button")
    },
    {
      title: t("features.sleep.title"),
      description: t("features.sleep.description"),
      type: "sleep",
      button: t("features.sleep.button")
    },
    {
      title: t("features.risk.title"),
      description: t("features.risk.description"),
      type: "risk",
      button: t("features.risk.button")
    }
  ];

  return (
    <section className="mt-16 md:mt-32 w-full max-w-6xl mx-auto px-4 space-y-24 md:space-y-32 mb-32">
      {FEATURES.map((feature, idx) => {
        const isEven = idx % 2 === 0;
        
        return (
          <div key={feature.title} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content Side */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`text-center lg:text-left space-y-6 md:space-y-8 ${!isEven ? "lg:order-2" : ""}`}
            >
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                  {feature.title}
                </h2>
                <p className="text-base md:text-lg text-white/50 leading-relaxed max-w-md mx-auto lg:mx-0">
                  {feature.description}
                </p>
              </div>

              <button className="px-8 py-3 rounded-full bg-black border border-white/20 text-white font-bold text-sm hover:bg-white hover:text-black transition-all duration-300">
                {feature.button}
              </button>
            </motion.div>

            {/* Interactive UI Side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`relative ${!isEven ? "lg:order-1" : ""}`}
            >
              <div className="w-full max-w-[500px] mx-auto lg:aspect-[4/3] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 lg:p-12 flex flex-col items-center justify-center relative shadow-2xl border border-white/10 bg-white/[0.02] backdrop-blur-3xl overflow-hidden">
                
                {/* Specific UI for each feature type */}
                {feature.type === 'prediction' && (
                  <div className="w-full space-y-5">
                    <div className="hidden lg:block bg-white/5 rounded-2xl p-5 md:p-7 border border-white/5 relative overflow-hidden group">
                      <div className="relative z-10 space-y-5">
                        <div className="flex items-center justify-between gap-3">
                          <div className="space-y-1 min-w-0">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{t("features.prediction.status")}</p>
                            <h4 className="text-base md:text-xl font-bold text-white leading-tight">{t("features.prediction.trading")}</h4>
                          </div>
                          {/* Premium Toggle Switch */}
                          <div 
                            onClick={() => setPosition(position === 'yes' ? 'no' : 'yes')}
                            className={`shrink-0 w-12 h-7 md:w-14 md:h-8 rounded-full p-1 cursor-pointer transition-colors duration-500 ${position === 'yes' ? 'bg-emerald-500' : 'bg-white/10'}`}
                          >
                            <motion.div 
                              animate={{ x: position === 'yes' ? 20 : 0 }}
                              className="w-5 h-5 md:w-6 md:h-6 bg-white rounded-full shadow-lg"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className={`h-1.5 w-1.5 rounded-full ${position === 'yes' ? 'bg-emerald-500 animate-pulse' : 'bg-white/20'}`} />
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${position === 'yes' ? 'text-emerald-400' : 'text-white/30'}`}>
                              {position === 'yes' ? t("features.prediction.active") : t("features.prediction.standby")}
                            </span>
                          </div>
                          
                          <div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                animate={{ x: position === 'yes' ? ["-100%", "100%"] : "-100%" }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="h-full w-1/3 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-black flex items-center justify-center text-white shrink-0">
                          <LuTrendingUp size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-black font-bold text-sm">{t("features.prediction.profit")}</p>
                          <p className="text-black/40 text-[10px] uppercase font-bold tracking-widest">{t("features.prediction.live")}</p>
                        </div>
                      </div>
                      <span className="text-xl md:text-2xl font-bold text-emerald-600 shrink-0">+$12,450</span>
                    </div>
                  </div>
                )}

                {feature.type === 'ai' && (
                  <div className="w-full space-y-4 md:space-y-6">
                    <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3 md:p-4 border border-white/5">
                      <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                        <LuSparkles className="text-emerald-400 h-4 w-4 md:h-5 md:w-5" />
                      </div>
                      <div className="flex-1 space-y-1 md:space-y-1.5">
                        <div className="h-1.5 w-full bg-white/10 rounded-full" />
                        <div className="h-1.5 w-2/3 bg-white/5 rounded-full" />
                      </div>
                    </div>
                    <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 space-y-3 md:space-y-4 shadow-2xl">
                      <div className="flex items-center justify-between">
                        <span className="text-black font-bold text-xs md:text-sm tracking-tight">{t("features.ai.strategy")}</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </div>
                      <div className="space-y-1.5 md:space-y-2">
                        <div className="h-2 w-full bg-black/5 rounded-full" />
                        <div className="h-2 w-3/4 bg-black/5 rounded-full" />
                      </div>
                      <div className="pt-2 md:pt-4 flex justify-between items-end">
                        <span className="text-xl md:text-2xl font-bold text-black">+24.5%</span>
                        <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-black flex items-center justify-center text-white"><LuArrowUpRight size={12} /></div>
                      </div>
                    </div>
                  </div>
                )}

                {feature.type === 'sleep' && (
                  <div className="w-full relative">
                    <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 space-y-4 md:space-y-6 shadow-2xl">
                      <div className="flex items-center gap-3 md:gap-4 mb-1 md:mb-2">
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-black flex items-center justify-center text-white text-[10px] md:text-xs font-bold border border-white/10 shrink-0">A</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-black font-bold text-xs md:text-sm tracking-tight truncate">{t("features.sleep.success")}</p>
                          <p className="text-black/40 text-[8px] md:text-[10px] font-bold uppercase tracking-widest truncate">{t("features.sleep.mode")}</p>
                        </div>
                        <LuMoon className="text-emerald-500 h-4 w-4 md:h-5 md:w-5 shrink-0" />
                      </div>
                      <div className="bg-black/5 rounded-xl md:rounded-2xl p-4 md:p-5 flex justify-between items-center border border-black/5">
                        <span className="text-black/60 text-xs md:text-sm font-medium">{t("features.sleep.profit")}</span>
                        <span className="text-emerald-600 font-bold text-base md:text-lg">+$420.00</span>
                      </div>
                    </div>
                  </div>
                )}

                {feature.type === 'risk' && (
                  <div className="w-full space-y-3 md:space-y-4">
                    <div className="bg-emerald-500/5 rounded-xl md:rounded-2xl p-3 md:p-4 border border-emerald-500/10 flex items-center gap-2 md:gap-3">
                      <LuShieldCheck className="text-emerald-400 h-4 w-4 md:h-5 md:w-5 shrink-0" />
                      <span className="text-[9px] md:text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{t("features.risk.guard")}</span>
                    </div>
                    <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 space-y-4 md:space-y-6 shadow-2xl">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-black/40 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">{t("features.risk.stability")}</p>
                          <p className="text-3xl md:text-4xl font-bold text-black tracking-tighter">99.9%</p>
                        </div>
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <LuTrendingUp className="text-emerald-600 h-5 w-5 md:h-6 md:w-6" />
                        </div>
                      </div>
                      <div className="h-12 md:h-16 w-full flex items-end p-1 md:p-2 gap-1 md:gap-1.5">
                        {[40, 70, 45, 90, 65, 80, 100, 85, 95].map((h, i) => (
                          <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-[1px] md:rounded-t-sm" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Subtle Neutral Glows */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 blur-[100px] rounded-full pointer-events-none" />
            </motion.div>
          </div>
        );
      })}
    </section>
  );
}

