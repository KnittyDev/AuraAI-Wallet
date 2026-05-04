"use client";

import { DashboardHoldingsTable } from "@/components/dashboard/dashboard-holdings-table";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import { LuPlus, LuLoader } from "react-icons/lu";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Investment {
  id: string;
  asset_code: string;
  amount: number;
  risk_profile: string;
  duration_days: number;
  status: string;
}

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

export default function DashboardPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [changes, setChanges] = useState<Record<string, number>>({});
  const [availableUSDT, setAvailableUSDT] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalInvested, setTotalInvested] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch balances, investments and prices in parallel
      const [balanceRes, investmentRes, priceRes] = await Promise.all([
        supabase.from('balances').select('amount').eq('user_id', user.id).eq('asset_code', 'USDT').single(),
        supabase.from('investments').select('*').eq('user_id', user.id).eq('status', 'active'),
        fetch('/api/prices')
          .then(res => res.json())
          .catch(() => ({
            bitcoin: { usd: 65000, usd_24h_change: 0 },
            ethereum: { usd: 3500, usd_24h_change: 0 },
            solana: { usd: 145, usd_24h_change: 0 },
            tether: { usd: 1, usd_24h_change: 0 }
          }))
      ]);

      const fetchedPrices: Record<string, number> = {
        BTC: priceRes.bitcoin?.usd || 0,
        ETH: priceRes.ethereum?.usd || 0,
        SOL: priceRes.solana?.usd || 0,
        USDT: priceRes.tether?.usd || 0,
      };

      const fetchedChanges: Record<string, number> = {
        BTC: priceRes.bitcoin?.usd_24h_change || 0,
        ETH: priceRes.ethereum?.usd_24h_change || 0,
        SOL: priceRes.solana?.usd_24h_change || 0,
        USDT: priceRes.tether?.usd_24h_change || 0,
      };

      setPrices(fetchedPrices);
      setChanges(fetchedChanges);

      if (!balanceRes.error && balanceRes.data) {
        setAvailableUSDT(Number(balanceRes.data.amount));
      }

      if (!investmentRes.error && investmentRes.data) {
        setInvestments(investmentRes.data);
        const total = investmentRes.data.reduce((acc, curr) => acc + Number(curr.amount), 0);
        setTotalInvested(total);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LuLoader className="h-8 w-8 text-white/20 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <DashboardSidebar currentPath="/dashboard" />

        <section className="flex-1 space-y-4 px-6 py-8 md:px-10">
          <header className="rounded-3xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  Investment Dashboard
                </h1>
                <p className="mt-2 text-sm text-white/65">
                  Track your portfolio value, returns, and AI trading actions in one place.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/deposit"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <LuPlus className="h-4 w-4" />
                  Deposit
                </Link>
                
                <Link
                  href="/dashboard/new-investment"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/85"
                >
                  <LuWallet className="h-4 w-4" />
                  New Investment
                  <LuArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-3">
            <DashboardStatCard
              title="Total capital invested"
              value={`$${totalInvested.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              note="+0.0% from last month"
            />
            <DashboardStatCard
              title="Monthly profit"
              value="$0.00"
              note="Aura AI strategy projection"
            />
            <DashboardStatCard
              title="Available USDT"
              value={`$${availableUSDT.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              note="Ready for new positions"
            />
          </div>

          <DashboardHoldingsTable investments={investments} prices={prices} changes={changes} />
        </section>
      </div>
    </main>
  );
}
