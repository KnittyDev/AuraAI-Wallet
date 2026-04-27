const activities = [
  "Aura AI opened a BTC long position (+$420 unrealized).",
  "Auto rebalance completed: 8% moved from ETH to BTC.",
  "Risk guard reduced SOL exposure after volatility spike.",
  "Weekly report generated and sent to your email.",
];

export function DashboardRecentActivity() {
  return (
    <section className="rounded-3xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white">Recent activity</h3>
      <ul className="mt-4 space-y-3">
        {activities.map((activity) => (
          <li key={activity} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75">
            {activity}
          </li>
        ))}
      </ul>
    </section>
  );
}
