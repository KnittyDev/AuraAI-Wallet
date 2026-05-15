"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuSearch,
  LuArrowDownLeft,
  LuClock,
  LuCircleCheck,
  LuCircleX,
  LuExternalLink,
  LuFilter,
  LuWallet,
  LuMail,
  LuUser
} from "react-icons/lu";

type Transaction = {
  id: string;
  user_id: string;
  type: string;
  asset: string;
  amount: number;
  price_amount: number;
  status: string;
  tx_id: string;
  address: string;
  network: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
    avatar_url: string;
  };
};

export default function AdminDepositsPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [deposits, setDeposits] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    async function checkAdminAndFetch() {
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
        fetchDeposits();
      } else {
        setIsAdmin(false);
        router.push("/dashboard");
      }
    }

    checkAdminAndFetch();
  }, [router]);

  async function fetchDeposits() {
    setLoading(true);
    try {
      let query = supabase
        .from("transactions")
        .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            avatar_url
          )
        `)
        .eq("type", "Deposit")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDeposits(data || []);
    } catch (err) {
      console.error("Error fetching deposits:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAdmin) fetchDeposits();
  }, [statusFilter]);

  const filteredDeposits = deposits.filter(dep =>
    dep.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dep.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dep.tx_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dep.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'failed': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return LuCircleCheck;
      case 'pending': return LuClock;
      case 'failed': return LuCircleX;
      default: return LuClock;
    }
  };

  if (isAdmin === null || loading && deposits.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AdminSidebar currentPath="/admin/deposits" />

      <section className="relative z-10 flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <LuArrowDownLeft className="h-6 w-6" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">Recent Deposits</h1>
              </div>
              <p className="text-white/40 font-medium">Monitor and track all incoming asset transfers.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative group">
                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search user, hash or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-2xl pl-11 pr-5 py-3 text-sm text-white outline-none focus:border-red-500/50 focus:bg-white/[0.08] transition-all w-full md:w-80"
                />
              </div>

              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-1">
                {['all', 'Pending', 'Completed', 'Failed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${statusFilter === status
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-white/30">User</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-white/30">Asset / Amount</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-white/30">Value (USD)</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-white/30">Network / Hash</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-white/30">Date</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-white/30 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredDeposits.map((dep) => {
                    const StatusIcon = getStatusIcon(dep.status);
                    return (
                      <motion.tr
                        key={dep.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20 overflow-hidden">
                              {dep.profiles?.avatar_url ? (
                                <img src={dep.profiles.avatar_url} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <LuUser className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                                {dep.profiles?.full_name || "Unknown User"}
                              </p>
                              <p className="text-xs text-white/30 font-medium">{dep.profiles?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center font-bold text-[10px] text-white/40 border border-white/10">
                              {dep.asset}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{dep.amount.toLocaleString()} {dep.asset}</p>
                              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{dep.network}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-bold text-emerald-400">
                            +${dep.price_amount?.toLocaleString() || "0"}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="max-w-[160px]">
                            <p className="text-xs text-white/60 font-mono truncate mb-1" title={dep.tx_id || "No hash"}>
                              {dep.tx_id || "N/A"}
                            </p>
                            <p className="text-[10px] text-white/20 font-mono truncate" title={dep.address}>
                              {dep.address}
                            </p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm text-white/60">
                            {new Date(dep.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">
                            {new Date(dep.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest ${getStatusColor(dep.status)}`}>
                            <StatusIcon className="h-3 w-3" />
                            {dep.status}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredDeposits.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="h-16 w-16 rounded-3xl bg-white/5 flex items-center justify-center text-white/10 mb-4 border border-white/10">
                    <LuWallet className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">No deposits found</h3>
                  <p className="text-white/40 max-w-xs mx-auto mt-2">No incoming transactions matching your criteria were found in the database.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
