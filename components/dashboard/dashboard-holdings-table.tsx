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
  balances: { asset_code: string; amount: number }[];
  prices: Record<string, number>;
  changes: Record<string, number>;
}

export function DashboardHoldingsTable({ balances, prices, changes }: DashboardHoldingsTableProps) {
  const holdings = balances.map((b) => {
    const assetInfo = ASSET_MAP[b.asset_code] || { name: b.asset_code, icon: SiTether };
    const price = prices[b.asset_code] || 0;
    const change = changes[b.asset_code] || 0;
    const value = b.amount * price;

    return {
      asset: assetInfo.name,
      amount: `${b.amount.toLocaleString()} ${b.asset_code}`,
      value: `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      change: `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`,
      icon: assetInfo.icon,
    };
  });

  return (
    <section className="rounded-3xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white">Your investments</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="text-white/55">
            <tr>
              <th className="pb-3 font-medium">Asset</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Value (USD)</th>
              <th className="pb-3 font-medium">24h <span className="text-[10px] opacity-40 font-normal ml-1">(Crypto Prices)</span></th>
            </tr>
          </thead>
          <tbody className="text-white/85">
            {holdings.length > 0 ? (
              holdings.map((row) => (
                <tr key={row.asset} className="border-t border-white/10">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <row.icon className="h-4 w-4 text-white/80" aria-hidden />
                      <span>{row.asset}</span>
                    </div>
                  </td>
                  <td className="py-3">{row.amount}</td>
                  <td className="py-3">{row.value}</td>
                  <td
                    className={`py-3 font-medium ${
                      row.change.startsWith("-") ? "text-red-300" : "text-emerald-300"
                    }`}
                  >
                    {row.change}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-10 text-center text-white/30 italic">
                  No active holdings found. Start by making a deposit.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
