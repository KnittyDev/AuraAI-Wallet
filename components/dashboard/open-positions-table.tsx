"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LuLoader } from "react-icons/lu";

interface OpenPosition {
  id: string;
  asset_code: string;
  action_type: 'long' | 'short';
  entry_price: number;
  created_at: string;
  investment_id: string;
}

export function OpenPositionsTable() {
  const [positions, setPositions] = useState<OpenPosition[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOpenPositions() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ai_actions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPositions(data);
      }
      setLoading(false);
    }

    async function fetchMarketPrices() {
      try {
        const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];
        const newPrices: Record<string, number> = {};
        
        await Promise.all(symbols.map(async (symbol) => {
          const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
          const data = await res.json();
          if (data.price) {
            newPrices[symbol.replace("USDT", "")] = parseFloat(data.price);
          }
        }));
        
        setPrices(newPrices);
      } catch (err) {
        console.error("Market price fetch error:", err);
      }
    }

    fetchOpenPositions();
    fetchMarketPrices();
    
    // Refresh prices every 30 seconds
    const interval = setInterval(fetchMarketPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="rounded-3xl border border-white/15 bg-black/45 p-12 backdrop-blur-sm flex flex-col items-center justify-center text-white/20">
        <LuLoader className="h-8 w-8 animate-spin mb-4" />
        <p className="text-sm font-medium uppercase tracking-widest">Accessing Neural Link...</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Live Open Positions</h2>
          <p className="mt-1 text-sm text-white/65">
            Real-time execution feed from AuraAI neural engine.
          </p>
        </div>
      </div>

      {positions.length === 0 ? (
        <div className="py-12 text-center text-white/20 italic font-medium border border-white/5 bg-white/[0.02] rounded-2xl">
          Scanning for high-probability entries... <br />
          <span className="text-[10px] opacity-40 uppercase tracking-widest mt-2 block font-bold">AuraAI is monitoring the markets</span>
        </div>
      ) : (
        <>
          {/* Desktop View (Table) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="text-white/30 text-[10px] font-bold uppercase tracking-widest border-b border-white/5">
                <tr>
                  <th className="pb-4 font-bold">Pair</th>
                  <th className="pb-4 font-bold">Side</th>
                  <th className="pb-4 font-bold">Entry Price</th>
                  <th className="pb-4 font-bold">Current Price</th>
                  <th className="pb-4 font-bold">Time</th>
                  <th className="pb-4 font-bold">Strategy Logic</th>
                </tr>
              </thead>
              <tbody className="text-white/85 divide-y divide-white/5">
                {positions.map((pos) => {
                  const currentPrice = prices[pos.asset_code];
                  
                  return (
                    <tr key={pos.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{pos.asset_code}/USDT</span>
                          <span className="text-[9px] text-white/20 font-mono tracking-tighter">#{pos.id.slice(0, 8)}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${pos.action_type === "long"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                            }`}
                        >
                          {pos.action_type}
                        </span>
                      </td>
                      <td className="py-4 font-mono text-white/60">${Number(pos.entry_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="py-4 font-mono text-white/40">${currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "---"}</td>
                      <td className="py-4 text-white/40 text-xs">
                        {new Date(pos.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-4 text-white/30 text-xs italic">
                        {pos.action_type === 'long' ? "Bullish trend divergence detected" : "Overbought rejection signal confirmed"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile View (Cards) */}
          <div className="md:hidden space-y-4">
            {positions.map((pos) => {
              const currentPrice = prices[pos.asset_code];

              return (
                <div key={pos.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex flex-col gap-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{pos.asset_code}/USDT</span>
                      <span className="text-[9px] text-white/20 font-mono tracking-tighter">#{pos.id.slice(0, 8)}</span>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${pos.action_type === "long"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                        }`}
                    >
                      {pos.action_type}
                    </span>
                  </div>
                  
                  {/* Price Info */}
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">Entry Price</span>
                      <span className="font-mono text-white/60 text-sm">${Number(pos.entry_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">Current Price</span>
                      <span className="font-mono text-white/40 text-sm">${currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "---"}</span>
                    </div>
                  </div>

                  {/* Time & Logic */}
                  <div className="flex justify-between items-center border-t border-white/5 pt-3">
                    <div className="text-xs text-white/40">
                      {new Date(pos.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-[10px] text-white/30 italic">
                      {pos.action_type === 'long' ? "Bullish trend divergence" : "Overbought rejection"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
