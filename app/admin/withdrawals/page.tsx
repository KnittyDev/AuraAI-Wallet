"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { 
  LuArrowUpRight, 
  LuSearch, 
  LuFilter,
  LuRefreshCcw,
  LuCircleCheck,
  LuCircleX,
  LuClock,
  LuCopy,
  LuExternalLink
} from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  asset: string;
  status: string;
  address: string;
  network: string;
  tx_id: string;
  created_at: string;
  profiles: {
    email: string;
    full_name: string;
  }
}

export default function AdminWithdrawalsPage() {
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchWithdrawals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        profiles:user_id (email, full_name)
      `)
      .ilike('type', 'Withdrawal')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setWithdrawals(data as any);
    }
    setLoading(false);
  };

  useEffect(() => {
    async function checkAdmin() {
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
        fetchWithdrawals();
      } else {
        router.push("/dashboard");
      }
    }
    checkAdmin();
  }, [router]);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('transactions')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: newStatus } : w));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const filteredWithdrawals = withdrawals.filter(w => {
    const matchesSearch = w.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          w.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          w.tx_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isAdmin) return null;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay opacity-50" />

      <AdminSidebar currentPath="/admin/withdrawals" />

      <section className="relative z-10 flex-1 px-6 py-8 md:px-10 overflow-y-auto">
        <div className="mx-auto max-w-6xl">
          <header className="mb-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
                  Withdrawal Management
                  <LuArrowUpRight className="h-6 w-6 text-red-500" />
                </h1>
                <p className="text-white/40 font-medium">Review and process user withdrawal requests.</p>
              </div>
              <button 
                onClick={fetchWithdrawals}
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all"
              >
                <LuRefreshCcw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </header>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="relative group">
              <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-red-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search by email, address or txid..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <LuFilter className="h-5 w-5 text-white/20" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all appearance-none"
              >
                <option value="All">All Statuses</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-[2rem] border border-white/5 bg-white/[0.01] backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-white/40">User / Date</th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-white/40">Amount / Asset</th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-white/40">Destination</th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-white/40">Status</th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-white/40">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                    {filteredWithdrawals.map((w) => (
                      <motion.tr 
                        key={w.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="px-6 py-6">
                          <div className="font-medium text-white">{w.profiles?.email || 'Unknown'}</div>
                          <div className="text-[10px] text-white/20 mt-1 uppercase tracking-tighter">
                            {new Date(w.created_at).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="text-lg font-bold text-white tabular-nums">
                            {Math.abs(w.amount).toLocaleString()} {w.asset}
                          </div>
                          <div className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">
                            Ref: {w.tx_id.substring(0, 12)}...
                          </div>
                        </td>
                        <td className="px-6 py-6 max-w-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-white/60 truncate">{w.address}</span>
                            <button onClick={() => copyToClipboard(w.address)} className="p-1 hover:text-white transition-colors text-white/20">
                              <LuCopy className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="text-[10px] text-red-400 font-bold mt-1 uppercase tracking-widest">
                            {w.network}
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                            w.status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                            w.status === 'Processing' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' :
                            w.status === 'Failed' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                            'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          }`}>
                            {w.status === 'Completed' && <LuCircleCheck className="h-3 w-3" />}
                            {w.status === 'Processing' && <LuClock className="h-3 w-3 animate-pulse" />}
                            {w.status === 'Failed' && <LuCircleX className="h-3 w-3" />}
                            {w.status}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-1.5">
                            <button 
                              onClick={() => updateStatus(w.id, 'Processing')}
                              className={`h-8 px-2.5 rounded-lg border text-[9px] font-black tracking-tighter transition-all ${
                                w.status === 'Processing' 
                                ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                                : 'bg-white/5 border-white/10 text-white/30 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              PROC
                            </button>
                            <button 
                              onClick={() => updateStatus(w.id, 'Completed')}
                              className={`h-8 px-2.5 rounded-lg border text-[9px] font-black tracking-tighter transition-all ${
                                w.status === 'Completed' 
                                ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                                : 'bg-white/5 border-white/10 text-white/30 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              DONE
                            </button>
                            <button 
                              onClick={() => updateStatus(w.id, 'Failed')}
                              className={`h-8 px-2.5 rounded-lg border text-[9px] font-black tracking-tighter transition-all ${
                                w.status === 'Failed' 
                                ? 'bg-red-500 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                                : 'bg-white/5 border-white/10 text-white/30 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              FAIL
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            
            {filteredWithdrawals.length === 0 && !loading && (
              <div className="py-20 text-center">
                <LuArrowUpRight className="h-12 w-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/40 font-medium text-lg">No withdrawal requests found.</p>
                <p className="text-white/20 text-sm">When users request funds, they will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
