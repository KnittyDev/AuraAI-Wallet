import { IconType } from "react-icons";
import { SiBitcoin, SiEthereum, SiSolana, SiTether } from "react-icons/si";

type HoldingRow = {
  asset: string;
  amount: string;
  value: string;
  change: string;
  icon: IconType;
};

const holdings: HoldingRow[] = [
  { asset: "Bitcoin", amount: "0.44 BTC", value: "$28,600", change: "+5.3%", icon: SiBitcoin },
  { asset: "Ethereum", amount: "6.12 ETH", value: "$18,740", change: "+3.8%", icon: SiEthereum },
  { asset: "Solana", amount: "210 SOL", value: "$7,980", change: "-1.2%", icon: SiSolana },
  { asset: "USDT", amount: "12,500 USDT", value: "$12,500", change: "0.0%", icon: SiTether },
];

export function DashboardHoldingsTable() {
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
              <th className="pb-3 font-medium">24h</th>
            </tr>
          </thead>
          <tbody className="text-white/85">
            {holdings.map((row) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
