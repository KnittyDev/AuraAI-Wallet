"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LuArrowUpRight, 
  LuArrowDownLeft, 
  LuRefreshCw, 
  LuSearch, 
  LuFilter,
  LuExternalLink,
  LuTrendingUp,
  LuWallet
} from "react-icons/lu";

type TransactionStatus = "Completed" | "Pending" | "Failed";
type TransactionType = "Deposit" | "Withdrawal" | "Trade" | "Profit" | "Rebalance";

interface Transaction {
  id: string;
  type: TransactionType;
  asset: string;
  amount: string;
  status: TransactionStatus;
  date: string;
  txId: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "1", type: "Deposit", asset: "USDT", amount: "+12,000.00", status: "Completed", date: "2026-05-04 14:30", txId: "0x742...f44e" },
  { id: "2", type: "Trade", asset: "BTC", amount: "0.24500", status: "Completed", date: "2026-05-04 09:15", txId: "0x891...a12c" },
  { id: "3", type: "Profit", asset: "USDT", amount: "+450.25", status: "Completed", date: "2026-05-03 23:50", txId: "Internal" },
  { id: "4", type: "Withdrawal", asset: "ETH", amount: "-1.20000", status: "Pending", date: "2026-05-03 11:20", txId: "0x452...b992" },
  { id: "5", type: "Rebalance", asset: "SOL/ETH", amount: "Re-weighted", status: "Completed", date: "2026-05-02 18:45", txId: "Internal" },
  { id: "6", type: "Deposit", asset: "SOL", amount: "+50.00", status: "Completed", date: "2026-05-01 16:10", txId: "4j3W...r6r" },
  { id: "7", type: "Trade", asset: "ETH", amount: "2.50000", status: "Failed", date: "2026-04-30 08:30", txId: "0x112...c441" },
];

const TYPE_ICONS: Record<TransactionType, any> = {
  Deposit: LuArrowDownLeft,
  Withdrawal: LuArrowUpRight,
  Trade: LuRefreshCw,
  Profit: LuTrendingUp,
  Rebalance: LuRefreshCw,
};

const STATUS_COLORS: Record<TransactionStatus, string> = {
  Completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Failed: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function TransactionsPage() {
  const [filter, setFilter] = useState<"All" | TransactionType>("All");
  const [search, setSearch] = useState("");

  const filteredTransactions = MOCK_TRANSACTIONS.filter(tx => {
    const matchesFilter = filter === "All" || tx.type === filter;
    const matchesSearch = tx.asset.toLowerCase().includes(search.toLowerCase()) || tx.txId.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />
      
      <DashboardSidebar currentPath="/dashboard/transactions" />

      <section className="relative z-10 flex-1 px-6 py-8 md:px-10 overflow-y-auto">
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
              <button className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium hover:bg-white/10 transition">
                <LuFilter className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </header>

          {/* Type Filters */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {["All", "Deposit", "Withdrawal", "Trade", "Profit", "Rebalance"].map((type) => (
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
          <div className="rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-6 py-5 text-[10px] font-bold tracking-widest text-white/30 uppercase">Transaction</th>
                    <th className="px-6 py-5 text-[10px] font-bold tracking-widest text-white/30 uppercase">Amount</th>
                    <th className="px-6 py-5 text-[10px] font-bold tracking-widest text-white/30 uppercase">Date</th>
                    <th className="px-6 py-5 text-[10px] font-bold tracking-widest text-white/30 uppercase">Status</th>
                    <th className="px-6 py-5 text-[10px] font-bold tracking-widest text-white/30 uppercase text-right">TxID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {filteredTransactions.map((tx) => {
                      const Icon = TYPE_ICONS[tx.type];
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
                                <p className="font-semibold text-white">{tx.type}</p>
                                <p className="text-xs text-white/40">{tx.asset}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <p className={`font-mono text-sm ${
                              tx.amount.startsWith("+") ? "text-emerald-400" : 
                              tx.amount.startsWith("-") ? "text-red-400" : "text-white"
                            }`}>
                              {tx.amount}
                            </p>
                            <p className="text-[10px] text-white/20 mt-1 uppercase tracking-widest">{tx.asset}</p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sm text-white/80">{tx.date.split(" ")[0]}</p>
                            <p className="text-[10px] text-white/30 mt-1">{tx.date.split(" ")[1]}</p>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border ${STATUS_COLORS[tx.status]}`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition">
                              <span className="font-mono">{tx.txId}</span>
                              <LuExternalLink className="h-3 w-3" />
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
              
              {filteredTransactions.length === 0 && (
                <div className="py-20 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 mb-4">
                    <LuSearch className="h-8 w-8 text-white/20" />
                  </div>
                  <p className="text-white/60 font-medium">No transactions found</p>
                  <p className="text-sm text-white/40 mt-1">Try adjusting your filters or search term.</p>
                </div>
              )}
            </div>
            
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
    </main>
  );
}
