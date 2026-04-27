type OpenPosition = {
  pair: string;
  side: "Long" | "Short";
  entry: string;
  current: string;
  pnl: string;
  reason: string;
};

const positions: OpenPosition[] = [
  {
    pair: "BTC/USDT",
    side: "Long",
    entry: "$63,240",
    current: "$64,105",
    pnl: "+$412",
    reason: "Breakout above 4H resistance + rising volume",
  },
  {
    pair: "ETH/USDT",
    side: "Long",
    entry: "$3,145",
    current: "$3,198",
    pnl: "+$173",
    reason: "EMA trend continuation + positive momentum",
  },
  {
    pair: "SOL/USDT",
    side: "Short",
    entry: "$172.80",
    current: "$169.20",
    pnl: "+$96",
    reason: "RSI overbought rejection + weak order flow",
  },
];

export function OpenPositionsTable() {
  return (
    <section className="rounded-3xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold tracking-tight text-white">Open Positions</h2>
        <p className="mt-1 text-sm text-white/65">
          Active trades with strategy reason and live performance.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="text-white/55">
            <tr>
              <th className="pb-3 font-medium">Pair</th>
              <th className="pb-3 font-medium">Side</th>
              <th className="pb-3 font-medium">Entry</th>
              <th className="pb-3 font-medium">Current</th>
              <th className="pb-3 font-medium">PnL</th>
              <th className="pb-3 font-medium">Opened by</th>
            </tr>
          </thead>
          <tbody className="text-white/85">
            {positions.map((position) => (
              <tr key={`${position.pair}-${position.entry}`} className="border-t border-white/10">
                <td className="py-3 font-medium">{position.pair}</td>
                <td className="py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      position.side === "Long"
                        ? "bg-emerald-500/20 text-emerald-200"
                        : "bg-rose-500/20 text-rose-200"
                    }`}
                  >
                    {position.side}
                  </span>
                </td>
                <td className="py-3">{position.entry}</td>
                <td className="py-3">{position.current}</td>
                <td className="py-3 font-semibold text-emerald-300">{position.pnl}</td>
                <td className="py-3 text-white/70">{position.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
