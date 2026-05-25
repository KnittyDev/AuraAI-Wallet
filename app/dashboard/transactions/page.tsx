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
  LuExternalLink,
  LuLock,
  LuZap
} from "react-icons/lu";

import { PlanUpgradeModal } from "@/components/dashboard/plan-upgrade-modal";
import { useLanguage } from "@/context/language-context";

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
  customLabel?: string;
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
  const { language, t } = useLanguage();
  const [filter, setFilter] = useState<"All" | TransactionType>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | TransactionStatus>("All");
  const [dateRange, setDateRange] = useState<"All" | "24h" | "7d" | "30d">("All");
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  useEffect(() => {
    async function fetchTransactions() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [txRes, invRes, profitRes, profileRes] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('investments').select('*').eq('user_id', user.id),
        supabase.from('ai_actions').select('investment_id, profit_usd').eq('user_id', user.id),
        supabase.from('profiles').select('*').eq('id', user.id).single()
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
      }

      if (txRes.data) {
        const formatted: Transaction[] = txRes.data.map(tx => {
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

        // Generate dynamic return transactions for completed investments
        const dynamicTxs: Transaction[] = [];
        if (invRes.data && invRes.data.length > 0) {
          const profitMap: Record<string, number> = {};
          if (profitRes.data) {
            profitRes.data.forEach(p => {
              profitMap[p.investment_id] = (profitMap[p.investment_id] || 0) + Number(p.profit_usd || 0);
            });
          }

          invRes.data.forEach(inv => {
            if (inv.status !== 'active') {
              const maturityDate = new Date(inv.created_at);
              maturityDate.setDate(maturityDate.getDate() + inv.duration_days);
              const d = maturityDate;
              const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

              // 1. Principal Return (Ana Para İadesi)
              dynamicTxs.push({
                id: `principal-${inv.id}`,
                type: "Investment" as TransactionType,
                asset: "USDT",
                amount: Number(inv.amount),
                status: "Completed" as TransactionStatus,
                date: dateStr,
                txId: `RET-${inv.id.slice(0, 8)}-${inv.asset_code}`,
                customLabel: `${t("wallet.principalReturn")} (${inv.asset_code} ${t("wallet.planLabel")})`
              });

              // 2. Strategy Profit (Strateji Kârı)
              const profitAmount = profitMap[inv.id] || 0;
              dynamicTxs.push({
                id: `profit-${inv.id}`,
                type: "Profit" as TransactionType,
                asset: "USDT",
                amount: profitAmount,
                status: "Completed" as TransactionStatus,
                date: dateStr,
                txId: `PRFT-${inv.id.slice(0, 8)}-${inv.asset_code}`,
                customLabel: `${t("wallet.strategyProfit")} (${inv.asset_code} ${t("wallet.planLabel")})`
              });
            }
          });
        }

        const combined = [...formatted, ...dynamicTxs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Filter based on plan
        if (profileRes.data?.plan === 'free') {
          const restrictedTypes = ['Trade', 'Profit', 'Rebalance', 'Investment'];
          setTransactions(combined.filter(tx => !restrictedTypes.includes(tx.type)));
        } else {
          setTransactions(combined);
        }
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
          <div className="mx-auto max-w-6xl space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white mb-2">{t("transactions.title")}</h1>
                <p className="text-white/50 text-sm">{t("transactions.subtitle")}</p>
              </div>
            </header>
            
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white/[0.02] border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl">
              <div className="relative flex-1">
                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input 
                  type="text" 
                  placeholder={t("transactions.searchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-all text-white placeholder-white/20"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl border text-sm font-bold transition-all ${
                    showFilters ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                  }`}
                >
                  <LuFilter className="h-4 w-4" />
                  {t("transactions.filtersBtn")}
                </button>
              </div>
            </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/[0.01] border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl">
                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-2">{t("transactions.filters.type")}</label>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as any)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white/30 transition-all"
                    >
                      <option value="All">{t("transactions.filters.allTypes")}</option>
                      <option value="Deposit">{t("wallet.typeDeposit")}</option>
                      <option value="Withdrawal">{t("wallet.typeWithdrawal")}</option>
                      <option value="Trade">{t("transactions.typeTrade")}</option>
                      <option value="Profit">{t("wallet.typeProfit")}</option>
                      <option value="Rebalance">{t("transactions.typeRebalance")}</option>
                      <option value="Investment">{t("wallet.typeInvestment")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-2">{t("transactions.filters.status")}</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white/30 transition-all"
                    >
                      <option value="All">{t("transactions.filters.allStatuses")}</option>
                      <option value="Completed">{t("wallet.statusCompleted")}</option>
                      <option value="Pending">{t("wallet.statusProcessing")}</option>
                      <option value="Failed">{t("transactions.statusFailed")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-2">{t("transactions.filters.dateRange")}</label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value as any)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white/30 transition-all"
                    >
                      <option value="All">{t("transactions.filters.allTime")}</option>
                      <option value="24h">{t("transactions.filters.last24h")}</option>
                      <option value="7d">{t("transactions.filters.last7d")}</option>
                      <option value="30d">{t("transactions.filters.last30d")}</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                              {tx.customLabel || t(tx.type === "Deposit" ? "wallet.typeDeposit" : tx.type === "Withdrawal" ? "wallet.typeWithdrawal" : tx.type === "Profit" ? "wallet.typeProfit" : tx.type === "Investment" ? "wallet.typeInvestment" : tx.type === "Trade" ? "transactions.typeTrade" : "transactions.typeRebalance")}
                            </p>
                            <span className={`inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${STATUS_COLORS[tx.status]}`}>
                              {tx.status === 'Pending' ? t("wallet.statusProcessing") : tx.status === 'Completed' ? t("wallet.statusCompleted") : t("transactions.statusFailed")}
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
                          <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">{t("wallet.dateLabel")}</span>
                          <span className="text-white/80 text-xs font-medium">{tx.date}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">{t("transactions.mobile.txIdLabel")}</span>
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
                    <th className="px-6 py-5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{t("transactions.headers.activity")}</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{t("wallet.amountHeader")}</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{t("wallet.dateHeader")}</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{t("wallet.statusHeader")}</th>
                    <th className="px-6 py-5 text-right text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{t("transactions.headers.hash")}</th>
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
                                  {tx.customLabel || t(tx.type === "Deposit" ? "wallet.typeDeposit" : tx.type === "Withdrawal" ? "wallet.typeWithdrawal" : tx.type === "Profit" ? "wallet.typeProfit" : tx.type === "Investment" ? "wallet.typeInvestment" : tx.type === "Trade" ? "transactions.typeTrade" : "transactions.typeRebalance")}
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
                              {tx.status === 'Pending' ? t("wallet.statusProcessing") : tx.status === 'Completed' ? t("wallet.statusCompleted") : t("transactions.statusFailed")}
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
                  <p className="text-white/60 font-medium">{t("transactions.empty.title")}</p>
                  <p className="text-sm text-white/40 mt-1">{t("transactions.empty.subtitle")}</p>
                </div>
              )}
            
            <div className="px-6 py-5 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
              <p className="text-xs text-white/30 font-medium">
                {language === "tr"
                  ? `${filteredTransactions.length} ${t("transactions.footer.results")}`
                  : `${t("transactions.footer.showing")} ${filteredTransactions.length} ${t("transactions.footer.results")}`
                }
              </p>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/40 cursor-not-allowed">{t("transactions.footer.prev")}</button>
                <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/40 cursor-not-allowed">{t("transactions.footer.next")}</button>
              </div>
            </div>
          </div>

          {profile?.plan === 'free' && (
            <div className="mt-8 p-8 rounded-[2rem] border border-red-500/20 bg-red-500/[0.02] backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0">
                  <LuLock className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">{t("transactions.locked.title")}</h4>
                  <p className="text-sm text-white/40">{t("transactions.locked.subtitle")}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsUpgradeModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap shadow-lg shadow-red-500/20"
              >
                <LuZap className="h-3.5 w-3.5" />
                {t("transactions.locked.unlockBtn")}
              </button>
            </div>
          )}
        </div>
      </section>

      <PlanUpgradeModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)}
        title={t("transactions.modal.title")}
        description={t("transactions.modal.description")}
      />
    </div>
  </main>
  );
}
