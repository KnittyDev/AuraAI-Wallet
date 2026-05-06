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
  LuArrowUpRight,
  LuX,
  LuEye,
  LuEyeOff
} from "react-icons/lu";
import { supabase } from "@/lib/supabase";
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

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 6) score++;
    if (pass.length > 10) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;
    return score || 1;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Master password updated successfully." });
      setTimeout(() => setShowPasswordModal(false), 2000);
    }
    setLoading(false);
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
                    <button 
                      onClick={() => setShowPasswordModal(true)}
                      className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white transition-colors"
                    >
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
              </div>
            </div>
          </div>

        </div>
      </section>
      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => !loading && setShowPasswordModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg rounded-[2.5rem] border border-white/10 bg-zinc-900 p-8 md:p-12 shadow-2xl overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 h-64 w-64 bg-cyan-500/10 blur-[80px] rounded-full" />
            
            <button 
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
            >
              <LuX className="h-6 w-6" />
            </button>

            <div className="relative z-10">
              <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <LuKey className="h-8 w-8 text-white" />
              </div>

              <h2 className="text-3xl font-bold text-white mb-2">Update Password</h2>
              <p className="text-white/40 text-sm mb-8">Secure your account with a new master key.</p>

              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1 block mb-2">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-black/50 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-500/50 transition-all"
                      placeholder="••••••••"
                    />
                    
                    {/* Strength Meter */}
                    {newPassword && (
                      <div className="mt-3 px-1 space-y-2">
                        <div className="flex gap-1 h-1">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-full flex-1 rounded-full transition-all duration-500 ${
                                i < calculateStrength(newPassword)
                                  ? calculateStrength(newPassword) <= 2 ? "bg-red-500" : calculateStrength(newPassword) === 3 ? "bg-yellow-500" : "bg-emerald-500"
                                  : "bg-white/5"
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${
                          calculateStrength(newPassword) <= 2 ? "text-red-500" : calculateStrength(newPassword) === 3 ? "text-yellow-500" : "text-emerald-500"
                        }`}>
                          {calculateStrength(newPassword) <= 2 ? "Weak Password" : calculateStrength(newPassword) === 3 ? "Moderate Strength" : "Highly Secure"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1 block mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-black/50 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-500/50 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {message && (
                  <div className={`p-4 rounded-2xl text-xs font-bold ${
                    message.type === "success" ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20" : "bg-red-400/10 text-red-400 border border-red-400/20"
                  }`}>
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating Master Key..." : "Confirm Update"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
