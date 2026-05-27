"use client";

import { motion } from "framer-motion";
import { LandingHeader } from "@/components/landing/landing-header";
import { AuroraBackground } from "@/components/landing/aurora-background";
import {
  LuGlobe,
  LuShieldCheck,
  LuChartLine,
  LuMessageSquare,
  LuArrowRight,
  LuBuilding,
  LuUser,
  LuMail,
  LuLayers,
  LuLoaderCircle,
  LuCircleCheck
} from "react-icons/lu";
import { useLanguage } from "@/context/language-context";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ContactSalesPage() {
  const { language, t } = useLanguage();

  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [expectedAum, setExpectedAum] = useState("under_100k");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const aumOptions = [
    { value: "under_100k", label: language === "tr" ? "100.000$ Altı" : "Under $100K" },
    { value: "100k_500k", label: "$100K - $500K" },
    { value: "500k_1m", label: "$500K - $1M" },
    { value: "1m_5m", label: "$1M - $5M" },
    { value: "5m_25m", label: "$5M - $25M" },
    { value: "25m_100m", label: "$25M - $100M" },
    { value: "100m_plus", label: "$100M+" }
  ];

  const features = [
    {
      icon: LuShieldCheck,
      title: t("sales.securityTitle"),
      desc: t("sales.securityDesc")
    },
    {
      icon: LuGlobe,
      title: t("sales.liquidityTitle"),
      desc: t("sales.liquidityDesc")
    },
    {
      icon: LuChartLine,
      title: t("sales.strategiesTitle"),
      desc: t("sales.strategiesDesc")
    },
    {
      icon: LuLayers,
      title: t("sales.apiTitle"),
      desc: t("sales.apiDesc")
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccess(false);

    if (!fullName.trim() || !organization.trim() || !email.trim() || !message.trim()) {
      setErrorMsg(t("sales.validationError"));
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("contact_sales")
        .insert({
          full_name: fullName,
          organization: organization,
          email: email,
          expected_aum: expectedAum,
          message: message
        });

      if (error) throw error;
      setSuccess(true);
      
      // Reset form
      setFullName("");
      setOrganization("");
      setEmail("");
      setExpectedAum("under_100k");
      setMessage("");
    } catch (err: any) {
      console.error("Sales contact submission error:", err);
      setErrorMsg(t("sales.errorMessage"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      {/* Sticky Navigation */}
      <div className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <LandingHeader />
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
              {t("sales.title1")}<br />
              <span className="text-white">{t("sales.title2")}</span>
            </h1>

            <p className="text-lg text-white/60 leading-relaxed mb-12 max-w-lg">
              {t("sales.subtitle")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-white/40">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/10 to-blue-600/10 rounded-[2.5rem] blur-2xl" />

            <div className="relative rounded-[2rem] border border-white/15 bg-black/40 p-8 md:p-10 backdrop-blur-2xl">
              <h2 className="text-2xl font-bold mb-8">{t("sales.formTitle")}</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm font-medium"
                  >
                    <LuCircleCheck className="h-5 w-5 shrink-0" />
                    <span>{t("sales.successMessage")}</span>
                  </motion.div>
                )}

                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-medium"
                  >
                    {errorMsg}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <LuUser className="h-3 w-3" /> {t("sales.fullName")}
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20 text-white"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <LuBuilding className="h-3 w-3" /> {t("sales.organization")}
                    </label>
                    <input
                      type="text"
                      placeholder="Amazon Inc."
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20 text-white"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <LuMail className="h-3 w-3" /> {t("sales.businessEmail")}
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20 text-white"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <LuLayers className="h-3 w-3" /> {t("sales.expectedAum")}
                  </label>
                  <div className="relative">
                    <select 
                      value={expectedAum}
                      onChange={(e) => setExpectedAum(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-all appearance-none text-white cursor-pointer"
                      disabled={isLoading}
                    >
                      {aumOptions.map((opt) => (
                        <option key={opt.value} className="bg-black text-white" value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 text-xs">▼</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <LuMessageSquare className="h-3 w-3" /> {t("sales.howHelp")}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={t("sales.helpPlaceholder")}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-all resize-none placeholder:text-white/20 text-white"
                    disabled={isLoading}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full group relative flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-bold text-black transition-all hover:bg-white/90 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <LuLoaderCircle className="h-4 w-4 animate-spin text-black" />
                  ) : (
                    <>
                      {t("sales.submit")}
                      <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-white/30 uppercase tracking-widest leading-relaxed">
                  {t("sales.policy")}<br />
                  <span className="text-white/60 underline cursor-pointer">{t("sales.termsLink")}</span>{t("sales.policyAnd")}<span className="text-white/60 underline cursor-pointer">{t("sales.privacyLink")}</span>{t("sales.policyEnd") || "."}
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
