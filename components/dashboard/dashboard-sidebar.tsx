"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

import {
  LuChartBar,
  LuLayoutDashboard,
  LuSettings,
  LuWallet,
  LuWaypoints,
  LuSparkles,
  LuLogOut,
  LuTrendingUp,
  LuActivity,
  LuMenu,
  LuX,
} from "react-icons/lu";

import { SiTether } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LuLayoutDashboard },
  { label: "My Wallet", href: "/dashboard/wallet", icon: LuWallet },
  { label: "Market Data", href: "/dashboard/market-data", icon: LuChartBar },
  { label: "Investments", href: "/dashboard/investments", icon: LuTrendingUp },
  { label: "Transactions", href: "/dashboard/transactions", icon: LuWaypoints },
  { label: "Performance", href: "/dashboard/performance", icon: LuActivity },
  { label: "Ask AI", href: "/dashboard/ask-ai", icon: LuSparkles },
  { label: "Settings", href: "/dashboard/settings", icon: LuSettings },
];

type DashboardSidebarProps = {
  currentPath: string;
};

export function DashboardSidebar({ currentPath }: DashboardSidebarProps) {
  const router = useRouter();
  const [totalBalance, setTotalBalance] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    async function fetchTotalBalance() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const [balanceRes, priceRes] = await Promise.all([
          supabase.from('balances').select('asset_code, amount').eq('user_id', user.id),
          fetch('/api/prices').then(res => res.json())
        ]);

        if (!balanceRes.error && balanceRes.data) {
          const prices: Record<string, number> = {
            BTC: priceRes.bitcoin?.usd || 0,
            ETH: priceRes.ethereum?.usd || 0,
            SOL: priceRes.solana?.usd || 0,
            USDT: priceRes.tether?.usd || 1,
          };

          const total = balanceRes.data.reduce((acc, curr) => {
            const price = prices[curr.asset_code] || 0;
            return acc + (Number(curr.amount) * price);
          }, 0);

          setTotalBalance(total);
        }
      } catch (error) {
        console.error("Sidebar balance fetch error:", error);
      }
    }

    fetchTotalBalance();
    const interval = setInterval(fetchTotalBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Mobile Burger Button */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-6 left-6 z-[45] h-11 w-11 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center text-white"
      >
        <LuMenu className="h-6 w-6" />
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-[50] bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed inset-y-0 left-0 z-[55] w-72 transform border-r border-white/10 bg-black/80 p-6 backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:flex lg:flex-col lg:p-6 lg:sticky lg:top-0 lg:bg-black/55
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex-1">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Image src="/auralogo.png" alt="Aura Logo" width={32} height={32} className="rounded-lg shadow-lg" />
              <h2 className="text-xl font-bold tracking-tight text-white">Aura</h2>
            </div>
            
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden h-9 w-9 rounded-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <LuX className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-white text-black font-semibold"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-white/40 hover:bg-red-500/10 hover:text-red-400 transition"
            >
              <LuLogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        <div className="lg:mt-auto mt-10 mb-6">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-300/25 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 px-4 py-3 shadow-[0_10px_30px_rgba(16,185,129,0.15)]">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-500/15 text-emerald-200">
              <SiTether className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <p className="text-[10px] uppercase tracking-wide text-emerald-200/60">
                Total Net Worth
              </p>
              <p className="text-sm font-semibold text-emerald-100">
                {totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
