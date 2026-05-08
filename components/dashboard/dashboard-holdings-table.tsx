import { IconType } from "react-icons";
import { SiBitcoin, SiEthereum, SiSolana, SiTether } from "react-icons/si";

interface DashboardHoldingsTableProps {
  investments: { 
    id: string; 
    asset_code: string; 
    amount: number; 
    asset_amount?: number;
    entry_price?: number;
    risk_profile: string; 
    duration_days: number; 
  }[];
  prices: Record<string, number>;
  changes: Record<string, number>;
  profits: Record<string, number>;
  profits24h: Record<string, number>;
}

const ASSET_MAP: Record<string, { name: string; icon: IconType }> = {
  BTC: { name: "Bitcoin", icon: SiBitcoin },
  ETH: { name: "Ethereum", icon: SiEthereum },
  SOL: { name: "Solana", icon: SiSolana },
  USDT: { name: "Tether", icon: SiTether },
};

export function DashboardHoldingsTable({ investments, prices, changes, profits, profits24h }: DashboardHoldingsTableProps) {
  const holdings = investments.map((inv) => {
    const assetInfo = ASSET_MAP[inv.asset_code] || { name: inv.asset_code, icon: SiTether };
    const price = prices[inv.asset_code] || 1;
    
    const netProfit = profits[inv.id] || 0;
    const value = Number(inv.amount) + netProfit;
    const netProfit24h = profits24h[inv.id] || 0;
    const yield24h = Number(inv.amount) > 0 ? (netProfit24h / Number(inv.amount)) * 100 : 0;

    const initialAssetAmount = `${(Number(inv.amount) / (inv.entry_price || price)).toLocaleString(undefined, { 
      maximumFractionDigits: 6 
    })} ${inv.asset_code}`;

    const currentAssetAmount = `${(value / price).toLocaleString(undefined, { 
      minimumFractionDigits: 4, 
      maximumFractionDigits: 8 
    })} ${inv.asset_code}`;

    return {
      id: inv.id,
      asset: assetInfo.name,
      symbol: inv.asset_code,
      initialCapital: `$${Number(inv.amount).toLocaleString()}`,
      initialAssetAmount,
      currentAssetAmount,
      value: `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      profit: netProfit,
      yield24h: `${yield24h >= 0 ? "+" : ""}${yield24h.toFixed(2)}%`,
      icon: assetInfo.icon,
      risk: inv.risk_profile,
      duration: `${inv.duration_days} Days`,
    };
  });

  return (
    <section className="rounded-3xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Active Investment Strategies</h3>
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full uppercase tracking-widest">AuraAI Live Engine</span>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead className="text-white/30 text-[10px] font-bold uppercase tracking-widest">
            <tr>
              <th className="pb-4 font-bold">Strategy Asset</th>
              <th className="pb-4 font-bold text-center">Risk</th>
              <th className="pb-4 font-bold text-center">Plan</th>
              <th className="pb-4 font-bold">Initial Capital</th>
              <th className="pb-4 font-bold">Asset Vol.</th>
              <th className="pb-4 font-bold">Current Value</th>
              <th className="pb-4 font-bold">Net Profit (USDT)</th>
              <th className="pb-4 font-bold text-right">24h AI <span className="opacity-40 font-normal ml-1">Yield</span></th>
            </tr>
          </thead>
          <tbody className="text-white/85">
            {holdings.length > 0 ? (
              holdings.map((row) => (
                <tr key={row.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-white/5">
                        <row.icon className="h-4 w-4 text-white/80" aria-hidden />
                      </div>
                      <div>
                        <p className="font-bold text-white leading-tight">{row.asset}</p>
                        <p className="text-[10px] text-white/30 font-mono tracking-tighter">#{row.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                      row.risk === "Aggressive" ? "text-red-400 border-red-400/20 bg-red-400/5" :
                      row.risk === "Growth" ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5" :
                      "text-blue-400 border-blue-400/20 bg-blue-400/5"
                    }`}>
                      {row.risk}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <span className="text-xs font-medium text-white/40">{row.duration}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-white/80 leading-tight">{row.initialCapital}</span>
                      {row.symbol !== 'USDT' && (
                        <span className="text-[10px] text-white/30 font-mono">{row.initialAssetAmount}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 text-white/40 font-mono text-xs">{row.currentAssetAmount}</td>
                  <td className="py-4 font-bold text-white">{row.value}</td>
                  <td className={`py-4 font-mono font-bold ${row.profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {row.profit >= 0 ? "+" : ""}{row.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                  </td>
                  <td
                    className={`py-4 font-bold text-right font-mono ${
                      row.yield24h.startsWith("-") ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {row.yield24h}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-white/20 italic font-medium">
                  Scanning for active strategies... <br/>
                  <span className="text-[10px] opacity-40 uppercase tracking-widest mt-2 block font-bold">Start your first investment to activate AuraAI</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
