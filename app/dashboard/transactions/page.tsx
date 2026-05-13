"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LuArrowUpRight, 
  LuArrowDownLeft, 
  LuRefreshCw, 
  LuSearch, 
  LuFilter,
  LuTrendingUp,
  LuWallet,
  LuLoader,
  LuExternalLink
} from "react-icons/lu";

type TransactionStatus = "Completed" | "Pending" | "Failed";
type TransactionType = "Deposit" | "Withdrawal" | "Trade" | "Profit" | "Rebalance" | "Investment";

interface Transaction {
  id: string;
  type: TransactionType;
  asset: string;
  amount: number;
  priceAmount?: number;
  status: TransactionStatus;
  date: string;
  txId: string;
  address?: string;
  network?: string;
}

const TYPE_ICONS: Record<TransactionType, any> = {
  Deposit: LuArrowDownLeft,
  Withdrawal: LuArrowUpRight,
  Trade: LuRefreshCw,
  Profit: LuTrendingUp,
  Rebalance: LuRefreshCw,
  Investment: LuWallet,
};

const STATUS_COLORS: Record<TransactionStatus, string> = {
  Completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Failed: "text-red-400 bg-red-400/10 border-red-400/20",
};

const getExplorerUrl = (tx: Transaction) => {
  if (!tx.address) return "#";
  const address = tx.address;
  const network = tx.network?.toLowerCase() || "";

  if (tx.asset === "BTC") return `https://www.blockchain.com/explorer/addresses/btc/${address}`;
  if (tx.asset === "ETH") return `https://etherscan.io/address/${address}`;
  if (tx.asset === "SOL") return `https://solscan.io/account/${address}`;
  
  // USDT Networks
  if (network.includes("erc20")) return `https://etherscan.io/address/${address}`;
  if (network.includes("trc20")) return `https://tronscan.org/#/address/${address}`;
  if (network.includes("bep20")) return `https://bscscan.com/address/${address}`;
  if (network.includes("polygon")) return `https://polygonscan.com/address/${address}`;
  if (network.includes("solana")) return `https://solscan.io/account/${address}`;

  return `https://etherscan.io/address/${address}`; // Default
};

export default function TransactionsPage() {
  const [filter, setFilter] = useState<"All" | TransactionType>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | TransactionStatus>("All");
  const [dateRange, setDateRange] = useState<"All" | "24h" | "7d" | "30d">("All");
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchTransactions() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        const formatted: Transaction[] = data.map(tx => {
          const d = new Date(tx.created_at);
          const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
          
          return {
            id: tx.id,
            type: tx.type as TransactionType,
            asset: tx.asset,
            amount: Number(tx.amount),
            priceAmount: tx.price_amount ? Number(tx.price_amount) : undefined,
            status: tx.status as TransactionStatus,
            date: dateStr,
            txId: tx.tx_id || "N/A",
            address: tx.address,
            network: tx.network,
          };
        });
        setTransactions(formatted);
      }
      setLoading(false);
    }
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === "All" || tx.type === filter;
    const matchesStatus = statusFilter === "All" || tx.status === statusFilter;
    
    let matchesDate = true;
    if (dateRange !== "All") {
      const txDate = new Date(tx.date);
      const now = new Date();
      if (dateRange === "24h") matchesDate = txDate > new Date(now.getTime() - 24 * 60 * 60 * 1000);
      else if (dateRange === "7d") matchesDate = txDate > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      else if (dateRange === "30d") matchesDate = txDate > new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const matchesSearch = tx.asset.toLowerCase().includes(search.toLowerCase()) || 
                         tx.txId.toLowerCase().includes(search.toLowerCase()) ||
                         tx.type.toLowerCase().includes(search.toLowerCase());
    
    return matchesFilter && matchesStatus && matchesDate && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />
      
      <div className="flex min-h-screen w-full flex-col lg:flex-row relative z-10">
        <DashboardSidebar currentPath="/dashboard/transactions" />

        <section className="flex-1 px-6 py-8 md:px-10 lg:ml-72 min-w-0 max-w-[100vw]">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Transactions</h1>
              <p className="text-white/50">History of all your assets and AI trading activities.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative group">
                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-white/60 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search by asset or TxID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-white/20 transition-all w-full md:w-64"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 border rounded-2xl text-sm font-medium transition ${
                  showFilters ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                }`}
              >
                <LuFilter className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </header>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-white/[0.03] border border-white/10 rounded-[32px] backdrop-blur-xl">
                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 block">Status</label>
                    <div className="flex flex-wrap gap-2">
                      {["All", "Completed", "Pending", "Failed"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatusFilter(s as any)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                            statusFilter === s ? "bg-white/20 text-white" : "bg-white/5 text-white/40 hover:bg-white/10"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 block">Date Range</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "All", label: "All Time" },
                        { id: "24h", label: "Last 24h" },
                        { id: "7d", label: "Last 7d" },
                        { id: "30d", label: "Last 30d" }
                      ].map((d) => (
                        <button
                          key={d.id}
                          onClick={() => setDateRange(d.id as any)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                            dateRange === d.id ? "bg-white/20 text-white" : "bg-white/5 text-white/40 hover:bg-white/10"
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 block">Quick Actions</label>
                    <button 
                      onClick={() => {
                        setFilter("All");
                        setStatusFilter("All");
                        setDateRange("All");
                        setSearch("");
                      }}
                      className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold transition"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Type Filters */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {["All", "Deposit", "Withdrawal", "Trade", "Profit", "Rebalance", "Investment"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 whitespace-nowrap ${
                  filter === type 
                  ? "bg-white text-black" 
                  : "bg-white/5 text-white/40 hover:bg-white/10"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Transactions Table */}
          <div className="rounded-[32px] border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden custom-scrollbar">
            
            {/* Mobile Card View */}
            <div className="block md:hidden divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <div className="py-20 text-center">
                    <LuLoader className="h-8 w-8 animate-spin text-white/20 mx-auto" />
                  </div>
                ) : filteredTransactions.map((tx) => {
                  const Icon = TYPE_ICONS[tx.type] || LuRefreshCw;
                  const isPositive = (tx.priceAmount && tx.priceAmount > 0) || tx.amount > 0;
                  return (
                    <motion.div
                      key={`mobile-${tx.id}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-6 space-y-4 hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white/60 border border-white/5`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-base">
                              {tx.type}
                            </p>
                            <span className={`inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${STATUS_COLORS[tx.status]}`}>
                              {tx.status === 'Pending' ? 'Processing' : tx.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-mono text-base font-bold ${
                            tx.status === 'Pending' ? 'text-amber-400' : (isPositive ? "text-emerald-400" : "text-red-400")
                          }`}>
                            {isPositive ? "+" : ""}{tx.priceAmount 
                              ? tx.priceAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                              : tx.amount.toLocaleString(undefined, { minimumFractionDigits: tx.asset === 'USDT' ? 2 : 6, maximumFractionDigits: tx.asset === 'USDT' ? 2 : 8 })
                            }
                            <span className="text-[10px] ml-1 uppercase">{tx.priceAmount ? 'USDT' : tx.asset}</span>
                          </p>
                          {tx.priceAmount && tx.asset !== 'USDT' && (
                            <p className="text-[10px] text-white/40 mt-0.5 font-medium italic">
                              ≈ {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })} {tx.asset}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Date</span>
                          <span className="text-white/80 text-xs font-medium">{tx.date}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">TxID / Hash</span>
                          <a 
                            href={getExplorerUrl(tx)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-cyan-400 transition"
                          >
                            <span className="font-mono">{tx.txId.slice(0, 8)}...</span>
                            <LuExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="px-6 py-5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Activity</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Amount</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Date</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-6 py-5 text-right text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-20 text-center">
                          <LuLoader className="h-8 w-8 animate-spin text-white/20 mx-auto" />
                        </td>
                      </tr>
                    ) : filteredTransactions.map((tx) => {
                      const Icon = TYPE_ICONS[tx.type] || LuRefreshCw;
                      const isPositive = (tx.priceAmount && tx.priceAmount > 0) || tx.amount > 0;
                      return (
                        <motion.tr 
                          key={tx.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="hover:bg-white/[0.03] transition-colors group"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 group-hover:bg-white/10 transition-colors`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-semibold text-white">
                                  {tx.type}
                                  {tx.type === "Investment" && tx.txId.includes("_") && (
                                    <span className="ml-2 text-xs font-normal text-white/40">
                                      ({tx.txId.split("_")[1]})
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-white/40">{tx.asset}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <p className={`font-mono text-sm ${
                              tx.status === 'Pending' ? 'text-amber-400' : (isPositive ? "text-emerald-400" : "text-red-400")
                            }`}>
                              {isPositive ? "+" : ""}{tx.priceAmount
                                ? tx.priceAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                : tx.amount.toLocaleString(undefined, { minimumFractionDigits: tx.asset === 'USDT' ? 2 : 6, maximumFractionDigits: tx.asset === 'USDT' ? 2 : 8 })
                              }
                              <span className="text-[10px] ml-1 uppercase">{tx.priceAmount ? 'USDT' : tx.asset}</span>
                            </p>
                            {tx.priceAmount && tx.asset !== 'USDT' && (
                              <p className="text-[10px] text-white/20 mt-1 italic">
                                ≈ {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })} {tx.asset}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sm text-white/80">{tx.date.split(" ")[0]}</p>
                            <p className="text-[10px] text-white/30 mt-1">{tx.date.split(" ")[1]}</p>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border ${STATUS_COLORS[tx.status]}`}>
                              {tx.status === 'Pending' ? 'Processing' : tx.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <a 
                              href={getExplorerUrl(tx)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-cyan-400 transition"
                            >
                              <span className="font-mono">{tx.txId.slice(0, 10)}...</span>
                              <LuExternalLink className="h-3 w-3" />
                            </a>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
              
              {!loading && filteredTransactions.length === 0 && (
                <div className="py-20 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 mb-4">
                    <LuSearch className="h-8 w-8 text-white/20" />
                  </div>
                  <p className="text-white/60 font-medium">No transactions found</p>
                  <p className="text-sm text-white/40 mt-1">Try adjusting your filters or search term.</p>
                </div>
              )}
            
            <div className="px-6 py-5 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
              <p className="text-xs text-white/30 font-medium">Showing {filteredTransactions.length} results</p>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/40 cursor-not-allowed">Previous</button>
                <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/40 cursor-not-allowed">Next</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
  );
}
