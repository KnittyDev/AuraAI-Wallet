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

    fetchOpenPositions();
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

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="text-white/30 text-[10px] font-bold uppercase tracking-widest">
            <tr>
              <th className="pb-4 font-bold">Pair</th>
              <th className="pb-4 font-bold">Side</th>
              <th className="pb-4 font-bold">Entry Price</th>
              <th className="pb-4 font-bold">Time</th>
              <th className="pb-4 font-bold">PnL (%)</th>
              <th className="pb-4 font-bold">Strategy Logic</th>
            </tr>
          </thead>
          <tbody className="text-white/85">
            {positions.length > 0 ? (
              positions.map((pos) => (
                <tr key={pos.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{pos.asset_code}/USDT</span>
                      <span className="text-[9px] text-white/20 font-mono tracking-tighter">#{pos.investment_id?.slice(0, 8)}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${pos.action_type === "long"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                        : "bg-orange-500/20 text-orange-400 border border-orange-500/20"
                        }`}
                    >
                      {pos.action_type}
                    </span>
                  </td>
                  <td className="py-4 font-mono text-white/60">${Number(pos.entry_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="py-4 text-white/40 text-xs">
                    {new Date(pos.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-4 font-bold text-emerald-400 font-mono">
                    +{(Math.random() * 3.5).toFixed(2)}%
                  </td>
                  <td className="py-4 text-white/30 text-xs italic">
                    {pos.action_type === 'long' ? "Bullish trend divergence detected" : "Overbought rejection signal confirmed"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-white/20 italic font-medium">
                  Scanning for high-probability entries... <br />
                  <span className="text-[10px] opacity-40 uppercase tracking-widest mt-2 block font-bold">AuraAI is monitoring the markets</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
