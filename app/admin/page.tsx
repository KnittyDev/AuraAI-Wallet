"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { 
  LuShieldAlert, 
  LuUsers, 
  LuLifeBuoy, 
  LuActivity,
  LuTrendingUp,
  LuDollarSign
} from "react-icons/lu";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [overviewStats, setOverviewStats] = useState({ users: 0, activeTickets: 0, totalDeposits: 0 });
  const [depositData, setDepositData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAdminData() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        setIsAdmin(true);

        // Fetch stats, transactions, and current prices
        const [usersRes, ticketsRes, depositsRes, pricesRes] = await Promise.all([
          supabase.from("profiles").select("*", { count: 'exact', head: true }),
          supabase.from("tickets").select("*", { count: 'exact', head: true }).neq("status", "Closed"),
          supabase.from("transactions").select("amount, asset, created_at").ilike("type", "deposit"),
          fetch('/api/prices').then(res => res.json())
        ]);

        const prices: Record<string, number> = {
          BTC: pricesRes.bitcoin?.usd || 0,
          ETH: pricesRes.ethereum?.usd || 0,
          SOL: pricesRes.solana?.usd || 0,
          USDT: 1,
        };

        let totalDeps = 0;
        const grouped: Record<string, number> = {};

        (depositsRes.data || []).forEach((dep) => {
          const price = prices[dep.asset.toUpperCase()] || 1; // Default to 1 if asset not found (fallback)
          const usdtValue = Number(dep.amount) * price;
          
          totalDeps += usdtValue;

          const date = new Date(dep.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          grouped[date] = (grouped[date] || 0) + usdtValue;
        });

        const chartData = Object.entries(grouped)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => {
            const dateA = new Date(a.name + ", " + new Date().getFullYear());
            const dateB = new Date(b.name + ", " + new Date().getFullYear());
            return dateA.getTime() - dateB.getTime();
          });

        setOverviewStats({
          users: usersRes.count || 0,
          activeTickets: ticketsRes.count || 0,
          totalDeposits: totalDeps
        });
        setDepositData(chartData);

      } else {
        setIsAdmin(false);
        router.push("/dashboard");
      }
      setLoading(false);
    }

    fetchAdminData();
  }, [router]);

  const stats = [
    { label: "Total Users", value: overviewStats.users.toLocaleString(), icon: LuUsers, color: "text-white/70", bg: "bg-white/5", border: "border-white/10" },
    { label: "Active Tickets", value: overviewStats.activeTickets.toLocaleString(), icon: LuLifeBuoy, color: "text-white/70", bg: "bg-white/5", border: "border-white/10" },
    { label: "Total Volume", value: `$${overviewStats.totalDeposits.toLocaleString()}`, icon: LuDollarSign, color: "text-white/70", bg: "bg-white/5", border: "border-white/10" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay opacity-50" />

      <AdminSidebar currentPath="/admin" />

      <section className="relative z-10 flex-1 px-6 py-8 md:px-10 overflow-y-auto">
        <div className="mx-auto max-w-6xl">
          
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
              Admin Overview
              <LuShieldAlert className="h-6 w-6 text-red-500" />
            </h1>
            <p className="text-white/40 font-medium">Platform performance and treasury analytics.</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] flex items-center gap-6 relative overflow-hidden group hover:bg-white/[0.04] transition-all">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border ${stat.bg} ${stat.color} ${stat.border}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deposit Analytics Chart */}
          <div className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] backdrop-blur-md">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-white">Deposit Analytics</h3>
                <p className="text-sm text-white/40 font-medium">Growth of platform treasury over time</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                <LuTrendingUp className="h-3 w-3" /> Live
              </div>
            </div>

            <div className="h-[400px] w-full relative">
              {depositData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={depositData}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 500 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 500 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(10px)',
                        color: '#fff'
                      }}
                      itemStyle={{ color: '#10b981' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10b981" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorVal)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                  <LuTrendingUp className="h-10 w-10 text-white/10 mb-4" />
                  <p className="text-white/40 font-bold">No Deposit Data Available</p>
                  <p className="text-white/20 text-xs mt-1">Real-time statistics will appear here as users fund their accounts.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

