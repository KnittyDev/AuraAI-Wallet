import { IconType } from "react-icons";
import { SiBitcoin, SiEthereum, SiSolana, SiTether } from "react-icons/si";

type HoldingRow = {
  asset: string;
  amount: string;
  value: string;
  change: string;
  icon: IconType;
};

const ASSET_MAP: Record<string, { name: string; icon: IconType }> = {
  BTC: { name: "Bitcoin", icon: SiBitcoin },
  ETH: { name: "Ethereum", icon: SiEthereum },
  SOL: { name: "Solana", icon: SiSolana },
  USDT: { name: "Tether", icon: SiTether },
};

interface DashboardHoldingsTableProps {
  investments: { 
    id: string; 
    asset_code: string; 
    amount: number; 
    risk_profile: string; 
    duration_days: number; 
  }[];
  prices: Record<string, number>;
  changes: Record<string, number>;
}

export function DashboardHoldingsTable({ investments, prices, changes }: DashboardHoldingsTableProps) {
  const holdings = investments.map((inv) => {
    const assetInfo = ASSET_MAP[inv.asset_code] || { name: inv.asset_code, icon: SiTether };
    const price = prices[inv.asset_code] || 1;
    const change = changes[inv.asset_code] || 0;
    
    // Calculate how much of the asset was "bought" with the USDT capital
    // In a real system, this would be stored at time of purchase.
    const assetAmount = Number(inv.amount) / price;
    const value = assetAmount * price; // Current value in USD

    return {
      id: inv.id,
      asset: assetInfo.name,
      symbol: inv.asset_code,
      initialCapital: `$${Number(inv.amount).toLocaleString()}`,
      amount: `${assetAmount.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${inv.asset_code}`,
      value: `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      profit: value - Number(inv.amount),
      change: `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`,
      icon: assetInfo.icon,
      risk: inv.risk_profile,
      duration: `${inv.duration_days} Days`,
    };
  });

  return (
    <section className="rounded-3xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white">Active Investment Strategies</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead className="text-white/55">
            <tr>
              <th className="pb-3 font-medium">Strategy Asset</th>
              <th className="pb-3 font-medium">Risk Profile</th>
              <th className="pb-3 font-medium">Initial Capital</th>
              <th className="pb-3 font-medium">Asset Amount</th>
              <th className="pb-3 font-medium">Current Value</th>
              <th className="pb-3 font-medium">Profit (USDT)</th>
              <th className="pb-3 font-medium">Duration</th>
              <th className="pb-3 font-medium text-right">24h <span className="text-[10px] opacity-40 font-normal ml-1">(Crypto Prices)</span></th>
            </tr>
          </thead>
          <tbody className="text-white/85">
            {holdings.length > 0 ? (
              holdings.map((row) => (
                <tr key={row.id} className="border-t border-white/10">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <row.icon className="h-4 w-4 text-white/80" aria-hidden />
                      <span>{row.asset}</span>
                    </div>
                  </td>
                  <td className="py-3 font-medium text-white/60">{row.risk}</td>
                  <td className="py-3">{row.initialCapital}</td>
                  <td className="py-3 text-white/70">{row.amount}</td>
                  <td className="py-3 font-bold text-white">{row.value}</td>
                  <td className={`py-3 font-bold ${row.profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {row.profit >= 0 ? "+" : ""}${Math.abs(row.profit).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 text-white/50">{row.duration}</td>
                  <td
                    className={`py-3 font-medium text-right ${
                      row.change.startsWith("-") ? "text-red-300" : "text-emerald-300"
                    }`}
                  >
                    {row.change}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-10 text-center text-white/30 italic">
                  No active strategies found. Start your first investment plan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
