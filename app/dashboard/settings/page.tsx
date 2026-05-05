"use client";

import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import {
  LuSettings,
  LuBell,
  LuShield,
  LuUser,
  LuGlobe,
  LuCpu,
  LuSmartphone,
  LuMail,
  LuCheck,
  LuZap,
  LuWallet,
  LuChevronRight,
  LuKey,
  LuMonitor,
  LuArrowUpRight
} from "react-icons/lu";
import { useState } from "react";

interface SettingCardProps {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  icon: any;
  accentColor: string;
}

function SettingCard({ label, description, enabled, onToggle, icon: Icon, accentColor }: SettingCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="relative overflow-hidden p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-${accentColor}/5 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-${accentColor}/10 transition-colors`} />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all shadow-2xl ${enabled ? `bg-white text-black border-white` : "bg-white/5 text-white/20 border-white/10"
            }`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="max-w-[200px]">
            <h4 className="text-sm font-bold text-white mb-1.5">{label}</h4>
            <p className="text-[11px] text-white/30 leading-relaxed font-medium">{description}</p>
          </div>
        </div>

        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${enabled ? "bg-emerald-500" : "bg-white/10"
            }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xl ring-0 transition duration-300 ease-in-out ${enabled ? "translate-x-5" : "translate-x-0"
              }`}
          />
        </button>
      </div>
    </motion.div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifyTradeOpen: true,
    notifyTradeClose: true,
    notifyInvestmentComplete: true,
    notifyDeposit: true,
    notifyWithdraw: true,
    twoFactor: false,
    emailMarketing: false,
    autoReinvest: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      <DashboardSidebar currentPath="/dashboard/settings" />

      <section className="relative z-10 flex-1 px-6 py-8 md:px-10 overflow-y-auto">
        <div className="mx-auto max-w-6xl">

          {/* Top Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-8 rounded-[3rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent)]" />

            <div className="flex items-center gap-6 relative z-10">
              <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-zinc-800 to-black p-0.5 border border-white/10">
                <div className="h-full w-full rounded-[1.9rem] bg-black flex items-center justify-center overflow-hidden">
                  <LuUser className="h-10 w-10 text-white/20" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Account Control</h1>
                <p className="text-white/40 text-sm font-medium">Manage your neural identities and preferences.</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">Aura Elite</span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-white/40 border border-white/10 uppercase tracking-widest">Verified Account</span>
                </div>
              </div>
            </div>

            <button className="relative z-10 px-8 py-4 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-[0_10px_40px_rgba(255,255,255,0.2)]">
              Export Profile Data
            </button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">

            {/* Left Column: Notifications & Activity */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center gap-3 px-4">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-white/30">System Notifications</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SettingCard
                  label="Position Entry"
                  description="Real-time alerts when AuraAI executes a market entry."
                  enabled={settings.notifyTradeOpen}
                  onToggle={() => toggleSetting('notifyTradeOpen')}
                  icon={LuZap}
                  accentColor="yellow"
                />
                <SettingCard
                  label="Position Exit"
                  description="Instant reporting on closed positions and realized P&L."
                  enabled={settings.notifyTradeClose}
                  onToggle={() => toggleSetting('notifyTradeClose')}
                  icon={LuArrowUpRight}
                  accentColor="emerald"
                />
                <SettingCard
                  label="Investment Maturity"
                  description="Notified when strategy duration ends and funds settle."
                  enabled={settings.notifyInvestmentComplete}
                  onToggle={() => toggleSetting('notifyInvestmentComplete')}
                  icon={LuCheck}
                  accentColor="blue"
                />
                <SettingCard
                  label="Wallet Movements"
                  description="Confirmations for every deposit and withdrawal request."
                  enabled={settings.notifyDeposit}
                  onToggle={() => toggleSetting('notifyDeposit')}
                  icon={LuWallet}
                  accentColor="purple"
                />
              </div>

              <div className="mt-12 space-y-4">
                <div className="flex items-center gap-3 px-4">
                  <div className="h-2 w-2 rounded-full bg-cyan-400" />
                  <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-white/30">Security Layers</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] flex items-center justify-between group hover:bg-white/[0.03] transition-all">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                        <LuKey className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1">Master Password</h4>
                        <p className="text-xs text-white/30">Last updated 14 days ago. High complexity active.</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white transition-colors">
                      Change <LuChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] flex items-center justify-between group hover:bg-white/[0.03] transition-all">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
                        <LuSmartphone className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1">Two-Factor Authentication</h4>
                        <p className="text-xs text-white/30">Enhance security with Google Authenticator or Authy.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Recommended</span>
                      <button className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                        Setup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Preferences & Devices */}
            <div className="lg:col-span-4 space-y-8">
              <div className="flex items-center gap-3 px-4">
                <div className="h-2 w-2 rounded-full bg-purple-400" />
                <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-white/30">Preferences</h3>
              </div>

              <div className="space-y-4">
                <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03] space-y-6">
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">
                      <LuGlobe className="h-3 w-3" /> Interface Language
                    </label>
                    <select className="w-full bg-black/60 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-white/20 transition-all appearance-none cursor-pointer">
                      <option>English (US)</option>
                      <option>Turkish (TR)</option>
                      <option>German (DE)</option>
                    </select>
                  </div>
                </div>

                {/* Sessions Pod */}
                <div className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-white">Active Sessions</h4>
                    <LuMonitor className="h-4 w-4 text-white/20" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-white/80 font-medium">Desktop - Chrome</p>
                        <p className="text-[10px] text-white/20 uppercase tracking-widest">Istanbul, TR • Current</p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                    <div className="flex items-center justify-between opacity-50">
                      <div>
                        <p className="text-xs text-white/80 font-medium">iPhone 15 Pro</p>
                        <p className="text-[10px] text-white/20 uppercase tracking-widest">London, UK • 2h ago</p>
                      </div>
                      <button className="text-[9px] font-bold text-white/30 hover:text-red-400 uppercase tracking-widest">Revoke</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
