"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import Link from "next/link";
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
  LuEyeOff,
  LuShieldCheck,
  LuCopy,
  LuLifeBuoy
} from "react-icons/lu";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import Image from "next/image";
import auraLogo from "@/app/auralogo.png";
import { useLanguage } from "@/context/language-context";

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
  const { language, setLanguage, t } = useLanguage();
  const [settings, setSettings] = useState({
    notifyTradeOpen: true,
    notifyTradeClose: true,
    notifyInvestmentMaturity: true,
    notifyDeposit: true,
    notifyWithdraw: true,
    notifyWalletMovements: true,
    twoFactor: false,
    emailMarketing: false,
    autoReinvest: true,
  });

  const [profileData, setProfileData] = useState<{ plan: string; expiry: string | null }>({
    plan: "free",
    expiry: null
  });

  useEffect(() => {
    async function loadProfileData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("notify_trade_open, notify_trade_close, notify_investment_maturity, notify_wallet_movements, plan, subscription_period_end")
        .eq("id", user.id)
        .single();
        
      if (data) {
        setSettings(prev => ({
          ...prev,
          notifyTradeOpen: data.notify_trade_open ?? true,
          notifyTradeClose: data.notify_trade_close ?? true,
          notifyInvestmentMaturity: data.notify_investment_maturity ?? true,
          notifyWalletMovements: data.notify_wallet_movements ?? true,
        }));
        setProfileData({
          plan: data.plan || "free",
          expiry: data.subscription_period_end || null
        });
      }
    }
    loadProfileData();
  }, []);

  const toggleSetting = async (key: keyof typeof settings) => {
    const newValue = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newValue }));

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (key === 'notifyTradeOpen') {
      await supabase.from("profiles").update({ notify_trade_open: newValue }).eq("id", user.id);
    } else if (key === 'notifyTradeClose') {
      await supabase.from("profiles").update({ notify_trade_close: newValue }).eq("id", user.id);
    } else if (key === 'notifyInvestmentMaturity') {
      await supabase.from("profiles").update({ notify_investment_maturity: newValue }).eq("id", user.id);
    } else if (key === 'notifyWalletMovements') {
      await supabase.from("profiles").update({ notify_wallet_movements: newValue }).eq("id", user.id);
    }
  };

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  // ── 2FA State ──
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [totpQR, setTotpQR] = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [totpStep, setTotpStep] = useState<"scan" | "verify" | "done">("scan");
  const [totpLoading, setTotpLoading] = useState(false);
  const [totpError, setTotpError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [secretCopied, setSecretCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function load2FAStatus() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      setUserEmail(user.email ?? null);

      const { data } = await supabase
        .from("profiles")
        .select("totp_enabled")
        .eq("id", user.id)
        .single();
      if (data?.totp_enabled) setTotpEnabled(true);
    }
    load2FAStatus();
  }, []);

  const handle2FASetup = async () => {
    if (!userId) return;
    setTotpLoading(true);
    setTotpError(null);
    setTotpStep("scan");
    setTotpCode("");

    const res = await fetch("/api/auth/totp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setup", user_id: userId, email: userEmail }),
    });
    const data = await res.json();

    if (data.qr) {
      setTotpQR(data.qr);
      setTotpSecret(data.secret);
      setShow2FAModal(true);
    } else {
      setTotpError(data.error || "Setup failed.");
    }
    setTotpLoading(false);
  };

  const handle2FAVerify = async () => {
    if (!userId || totpCode.length !== 6) return;
    setTotpLoading(true);
    setTotpError(null);

    const res = await fetch("/api/auth/totp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify", user_id: userId, token: totpCode }),
    });
    const data = await res.json();

    if (data.success) {
      setTotpEnabled(true);
      setTotpStep("done");
    } else {
      setTotpError(data.error || "Invalid code.");
    }
    setTotpLoading(false);
  };

  const handle2FADisable = async () => {
    if (!userId) return;
    setTotpLoading(true);

    await fetch("/api/auth/totp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "disable", user_id: userId }),
    });

    setTotpEnabled(false);
    setShow2FAModal(false);
    setTotpLoading(false);
  };

  const copySecret = () => {
    navigator.clipboard.writeText(totpSecret);
    setSecretCopied(true);
    setTimeout(() => setSecretCopied(false), 2000);
  };

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
      setMessage({ type: "error", text: t("settings.passwordModal.dontMatch") });
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: t("settings.passwordModal.success") });
      setTimeout(() => setShowPasswordModal(false), 2000);
    }
    setLoading(false);
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // 1. Fetch Profile and 2FA status
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      // 2. Fetch Balances
      const { data: balances } = await supabase
        .from("balances")
        .select("*")
        .eq("user_id", user.id);

      // 3. Fetch Recent AI Actions (Opened & Closed)
      const { data: recentActions } = await supabase
        .from("ai_actions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      // Dynamic imports for PDF
      const { default: jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const isTr = language === "tr";

      // Header
      doc.setFillColor(10, 10, 10);
      doc.rect(0, 0, pageWidth, 40, "F");
      
      // Add Logo
      try {
        doc.addImage(auraLogo.src, "PNG", 14, 10, 10, 10);
      } catch (e) {
        console.error("Logo add error:", e);
      }

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("AURA AI WALLET", 28, 20);
      doc.setFontSize(10);
      doc.text(isTr ? "KULLANICI PROFİL VERİLERİ DIŞA AKTARIMI" : "USER PROFILE DATA EXPORT", 28, 30);
      doc.text(`${isTr ? "Oluşturulma" : "Generated"}: ${new Date().toLocaleString(isTr ? "tr-TR" : "en-US")}`, pageWidth - 14, 30, { align: "right" });

      // Section: Account Overview
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text(isTr ? "1. Hesap Özeti" : "1. Account Overview", 14, 55);
      
      autoTable(doc, {
        startY: 60,
        head: [[isTr ? "Özellik" : "Attribute", isTr ? "Detaylar" : "Details"]],
        body: [
          [isTr ? "Tam Adı" : "Full Name", profile?.full_name || "N/A"],
          [isTr ? "E-posta" : "Email", user.email || "N/A"],
          [isTr ? "Son Giriş" : "Last Sign In", user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString(isTr ? "tr-TR" : "en-US") : "N/A"],
          [isTr ? "Plan Türü" : "Plan Type", (profile?.plan || "free").toUpperCase()],
          [isTr ? "İki Faktörlü Doğrulama" : "Two-Factor Auth", totpEnabled ? (isTr ? "ETKİN (Güvenli)" : "ENABLED (Secure)") : (isTr ? "DEVRE DIŞI (Eylem Gerekli)" : "DISABLED (Action Required)")],
          [isTr ? "Hesap Oluşturulma" : "Account Created", new Date(user.created_at).toLocaleDateString(isTr ? "tr-TR" : "en-US")],
        ],
        theme: "striped",
        headStyles: { fillColor: [30, 30, 30] }
      });

      // Section: Asset Balances
      const balancesY = (doc as any).lastAutoTable.finalY + 15;
      doc.text(isTr ? "2. Varlık Bakiyeleri" : "2. Asset Balances", 14, balancesY);
      
      const balanceRows = (balances || []).map(b => [
        b.asset_code,
        Number(b.amount).toLocaleString(undefined, { minimumFractionDigits: 2 }),
        isTr ? "Cüzdan Varlığı" : "Wallet Asset"
      ]);

      autoTable(doc, {
        startY: balancesY + 5,
        head: [[isTr ? "Varlık" : "Asset", isTr ? "Miktar" : "Amount", isTr ? "Tür" : "Type"]],
        body: balanceRows.length > 0 ? balanceRows : [[isTr ? "Varlık bulunamadı" : "No assets found", "-", "-"]],
        theme: "grid",
        headStyles: { fillColor: [30, 30, 30] }
      });

      // Section: Recent AI Strategies
      const actionsY = (doc as any).lastAutoTable.finalY + 15;
      doc.text(isTr ? "3. Son Yapay Zeka İşlem Pozisyonları" : "3. Recent AI Trading Positions", 14, actionsY);

      const actionRows = (recentActions || []).map(a => [
        new Date(a.created_at).toLocaleDateString(isTr ? "tr-TR" : "en-US"),
        a.asset_code,
        a.action_type.toUpperCase(),
        `$${Number(a.entry_price).toLocaleString()}`,
        a.status.toUpperCase(),
        a.profit_usd ? `${a.profit_usd >= 0 ? "+" : ""}${Number(a.profit_usd).toFixed(2)} USD` : "-"
      ]);

      autoTable(doc, {
        startY: actionsY + 5,
        head: [[isTr ? "Tarih" : "Date", isTr ? "Varlık" : "Asset", isTr ? "Tür" : "Type", isTr ? "Giriş Fiyatı" : "Entry Price", isTr ? "Durum" : "Status", isTr ? "Kâr/Zarar" : "P&L"]],
        body: actionRows.length > 0 ? actionRows : [[isTr ? "Son pozisyon bulunamadı" : "No recent positions", "-", "-", "-", "-", "-"]],
        theme: "striped",
        headStyles: { fillColor: [30, 30, 30] }
      });

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          isTr 
            ? `Bu rapor Aura AI Cüzdanı tarafından otomatik olarak oluşturulmuştur. Sayfa ${i} / ${totalPages}`
            : `This is an automated report from Aura AI Wallet. Page ${i} of ${totalPages}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }

      doc.save(`aura-profile-data-${new Date().getTime()}.pdf`);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: isTr ? "Profil verileri dışa aktarılamadı." : "Failed to export profile data." });
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      <div className="flex min-h-screen w-full flex-col lg:flex-row relative z-10">
        <DashboardSidebar currentPath="/dashboard/settings" />

        <section className="flex-1 px-6 py-8 md:px-10 lg:ml-72 min-w-0 max-w-[100vw]">
        <div className="mx-auto max-w-6xl">

          {/* Top Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-8 rounded-[3rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent)]" />

            <div className="flex items-center gap-6 relative z-10 w-full sm:w-auto">
              <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-zinc-800 to-black p-0.5 border border-white/10 shrink-0">
                <div className="h-full w-full rounded-[1.9rem] bg-black flex items-center justify-center overflow-hidden p-4">
                  <Image src={auraLogo} alt="Aura Logo" className="w-full h-full object-contain opacity-80" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-1">{t("settings.title")}</h1>
                <p className="text-white/40 text-sm font-medium">{t("settings.subtitle")}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <Link href="/dashboard/settings/support">
                <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">
                  {t("settings.supportCenter")}
                </button>
              </Link>
              <button 
                onClick={handleExportData}
                disabled={exporting}
                className="px-8 py-4 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-[0_10px_40px_rgba(255,255,255,0.2)] disabled:opacity-50"
              >
                {exporting ? t("settings.exporting") : t("settings.exportProfileData")}
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">

            {/* Left Column: Notifications & Activity */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center gap-3 px-4">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-white/30">{t("settings.systemNotifications")}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SettingCard
                  label={t("settings.notifications.tradeOpen.label")}
                  description={t("settings.notifications.tradeOpen.description")}
                  enabled={settings.notifyTradeOpen}
                  onToggle={() => toggleSetting('notifyTradeOpen')}
                  icon={LuZap}
                  accentColor="yellow"
                />
                <SettingCard
                  label={t("settings.notifications.tradeClose.label")}
                  description={t("settings.notifications.tradeClose.description")}
                  enabled={settings.notifyTradeClose}
                  onToggle={() => toggleSetting('notifyTradeClose')}
                  icon={LuArrowUpRight}
                  accentColor="emerald"
                />
                <SettingCard
                  label={t("settings.notifications.investmentMaturity.label")}
                  description={t("settings.notifications.investmentMaturity.description")}
                  enabled={settings.notifyInvestmentMaturity}
                  onToggle={() => toggleSetting('notifyInvestmentMaturity')}
                  icon={LuCheck}
                  accentColor="blue"
                />
                <SettingCard
                  label={t("settings.notifications.walletMovements.label")}
                  description={t("settings.notifications.walletMovements.description")}
                  enabled={settings.notifyWalletMovements}
                  onToggle={() => toggleSetting('notifyWalletMovements')}
                  icon={LuWallet}
                  accentColor="purple"
                />
              </div>

              <div className="mt-12 space-y-4">
                <div className="flex items-center gap-3 px-4">
                  <div className="h-2 w-2 rounded-full bg-cyan-400" />
                  <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-white/30">{t("settings.securityLayers")}</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] flex items-center justify-between group hover:bg-white/[0.03] transition-all">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-2xl bg-white text-black flex items-center justify-center border border-white shrink-0 shadow-2xl">
                        <LuKey className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1">{t("settings.security.masterPassword.label")}</h4>
                        <p className="text-xs text-white/30">{t("settings.security.masterPassword.description")}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowPasswordModal(true)}
                      className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white transition-colors"
                    >
                      {t("settings.security.change")} <LuChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-6 md:p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:bg-white/[0.03] transition-all">
                    <div className="flex items-center gap-6">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border shrink-0 shadow-2xl ${
                        totpEnabled
                          ? "bg-white text-black border-white"
                          : "bg-white/5 text-white/20 border-white/10"
                      }`}>
                        {totpEnabled ? <LuShieldCheck className="h-6 w-6" /> : <LuSmartphone className="h-6 w-6" />}
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1">{t("settings.security.twoFactor.label")}</h4>
                        <p className="text-xs text-white/30 leading-relaxed">
                          {totpEnabled
                            ? t("settings.security.twoFactor.activeDescription")
                            : t("settings.security.twoFactor.inactiveDescription")
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center sm:justify-end gap-4 w-full sm:w-auto pt-4 sm:pt-0 border-t border-white/5 sm:border-none">
                      {totpEnabled ? (
                        <>
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {t("settings.security.twoFactor.protected")}
                          </span>
                          <button
                            onClick={() => setShow2FAModal(true)}
                            className="px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-all ml-auto sm:ml-0"
                          >
                            {t("settings.security.twoFactor.disable")}
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">{t("settings.security.twoFactor.recommended")}</span>
                          <button
                            onClick={handle2FASetup}
                            disabled={totpLoading}
                            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50 ml-auto sm:ml-0"
                          >
                            {totpLoading ? t("settings.security.twoFactor.loading") : t("settings.security.twoFactor.setup")}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Preferences & Devices */}
            <div className="lg:col-span-4 space-y-8">
              <div className="flex items-center gap-3 px-4">
                <div className="h-2 w-2 rounded-full bg-purple-400" />
                <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-white/30">{t("settings.preferences")}</h3>
              </div>

              <div className="space-y-4">
                <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03] space-y-6">
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">
                      <LuGlobe className="h-3 w-3" /> {t("settings.interfaceLanguage")}
                    </label>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as "en" | "tr")}
                      className="w-full bg-black/60 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-white/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="en">English (US)</option>
                      <option value="tr">Türkçe (TR)</option>
                    </select>
                  </div>
                </div>

                <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03] space-y-6">
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">
                      <LuCpu className="h-3 w-3" /> {t("settings.activeMembership")}
                    </label>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                          profileData.plan === 'pro' ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/30'
                        }`}>
                          <LuZap className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white capitalize">{profileData.plan === 'pro' ? "Pro" : "Free"} {t("dashboardHome.yield24h").includes("24s") ? "Planı" : "Plan"}</h4>
                          <p className="text-[10px] text-white/30 font-medium tracking-tight">
                            {profileData.plan === 'pro' ? (language === "tr" ? "Nöral AI Önceliği" : "Neural AI Priority") : (language === "tr" ? "Standart Kimlik" : "Standard Identity")}
                          </p>
                        </div>
                      </div>
                      {profileData.plan === 'free' && (
                        <Link href="/dashboard/investments">
                          <button className="text-[9px] font-bold text-white uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                            {t("settings.upgrade")}
                          </button>
                        </Link>
                      )}
                    </div>
                    
                    {profileData.plan !== 'free' && profileData.expiry && (
                      <div className="px-1 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                          <span className="text-white/30">{t("settings.validityPeriod")}</span>
                          <span className="text-emerald-400 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {(() => {
                              const expiry = new Date(profileData.expiry).getTime();
                              const now = new Date().getTime();
                              const diffMs = expiry - now;
                              const diffDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
                              if (diffDays === 0) return t("settings.expiresToday");
                              if (diffDays === 1) return t("settings.oneDayLeft");
                              return `${diffDays} ${t("settings.daysLeft")}`;
                            })()}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ 
                               width: (() => {
                                 const expiry = new Date(profileData.expiry).getTime();
                                 const now = new Date().getTime();
                                 const diffMs = expiry - now;
                                 const diffDays = diffMs / (1000 * 60 * 60 * 24);
                                 if (diffDays <= 0) return "0%";
                                 const totalDays = diffDays > 4 ? 90 : 4;
                                 const percentage = Math.min(100, Math.max(0, (diffDays / totalDays) * 100));
                                 return `${percentage}%`;
                               })()
                             }}
                             className="h-full bg-emerald-500/50" 
                           />
                        </div>
                        <p className="text-[10px] text-white/40 leading-relaxed">
                          {t("settings.membershipExpiryText")} <span className="text-white font-bold">{new Date(profileData.expiry).toLocaleDateString(language === "tr" ? "tr-TR" : "en-US")}</span>.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
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

              <h2 className="text-3xl font-bold text-white mb-2">{t("settings.passwordModal.title")}</h2>
              <p className="text-white/40 text-sm mb-8">{t("settings.passwordModal.subtitle")}</p>

              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1 block mb-2">{t("settings.passwordModal.newPasswordLabel")}</label>
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
                          {calculateStrength(newPassword) <= 2 ? t("settings.passwordModal.weak") : calculateStrength(newPassword) === 3 ? t("settings.passwordModal.moderate") : t("settings.passwordModal.secure")}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1 block mb-2">{t("settings.passwordModal.confirmPasswordLabel")}</label>
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
                  {loading ? t("settings.passwordModal.updating") : t("settings.passwordModal.confirm")}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── 2FA Setup / Disable Modal ── */}
      <AnimatePresence>
        {show2FAModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => !totpLoading && setShow2FAModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md rounded-[2.5rem] border border-white/10 bg-zinc-900 p-8 md:p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 h-64 w-64 bg-cyan-500/10 blur-[80px] rounded-full" />
              <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-purple-500/10 blur-[80px] rounded-full" />

              <button
                onClick={() => setShow2FAModal(false)}
                className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors z-20"
              >
                <LuX className="h-5 w-5" />
              </button>

              <div className="relative z-10">
                {/* ── If 2FA is currently enabled → show disable view ── */}
                {totpEnabled && totpStep !== "done" ? (
                  <div className="text-center space-y-6">
                    <div className="mx-auto h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <LuShieldCheck className="h-8 w-8 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{t("settings.twoFactorModal.disableTitle")}</h2>
                    <p className="text-sm text-white/40 max-w-xs mx-auto">
                      {t("settings.twoFactorModal.disableDescription")}
                    </p>
                    <button
                      onClick={handle2FADisable}
                      disabled={totpLoading}
                      className="w-full py-4 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {totpLoading ? t("settings.twoFactorModal.disabling") : t("settings.twoFactorModal.confirmDisable")}
                    </button>
                  </div>
                ) : totpStep === "done" ? (
                  /* ── Success State ── */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6 py-4"
                  >
                    <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <LuShieldCheck className="h-10 w-10 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{t("settings.twoFactorModal.activatedTitle")}</h2>
                    <p className="text-sm text-white/40 max-w-xs mx-auto">
                      {t("settings.twoFactorModal.activatedDescription")}
                    </p>
                    <button
                      onClick={() => setShow2FAModal(false)}
                      className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all active:scale-[0.98]"
                    >
                      {t("settings.twoFactorModal.done")}
                    </button>
                  </motion.div>
                ) : totpStep === "scan" ? (
                  /* ── Step 1: Scan QR Code ── */
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{t("settings.twoFactorModal.setupTitle")}</h2>
                      <p className="text-sm text-white/40">
                        {t("settings.twoFactorModal.setupDescription")}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10">
                        {totpQR && (
                          <img src={totpQR} alt="TOTP QR Code" className="w-56 h-56" />
                        )}
                      </div>
                    </div>

                    {/* Manual entry secret */}
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">{t("settings.twoFactorModal.manualEntryKey")}</p>
                      <div className="flex items-center justify-between gap-2">
                        <code className="text-xs font-mono text-white/60 break-all leading-relaxed">{totpSecret}</code>
                        <button
                          onClick={copySecret}
                          className="shrink-0 p-2 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                        >
                          {secretCopied ? <LuCheck className="h-4 w-4 text-emerald-400" /> : <LuCopy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setTotpStep("verify")}
                      className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all active:scale-[0.98]"
                    >
                      {t("settings.twoFactorModal.scannedNext")}
                    </button>
                  </div>
                ) : (
                  /* ── Step 2: Enter verification code ── */
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{t("settings.twoFactorModal.verifyTitle")}</h2>
                      <p className="text-sm text-white/40">
                        {t("settings.twoFactorModal.verifyDescription")}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={totpCode}
                        onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="000000"
                        className="w-64 text-center text-4xl font-mono font-bold tracking-[0.5em] bg-white/[0.03] border border-white/10 rounded-2xl py-5 text-white outline-none focus:border-cyan-500/50 transition-all placeholder:text-white/10"
                        autoFocus
                      />
                    </div>

                    <p className="text-[10px] text-center text-white/20 font-medium">
                      {t("settings.twoFactorModal.refreshText")}
                    </p>

                    {totpError && (
                      <div className="p-4 rounded-2xl text-xs font-bold bg-red-400/10 text-red-400 border border-red-400/20 text-center">
                        {totpError}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setTotpStep("scan")}
                        className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                      >
                        {t("settings.twoFactorModal.back")}
                      </button>
                      <button
                        onClick={handle2FAVerify}
                        disabled={totpLoading || totpCode.length !== 6}
                        className="flex-1 py-4 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {totpLoading ? t("settings.twoFactorModal.verifying") : t("settings.twoFactorModal.verifyEnable")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
