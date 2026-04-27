import { DashboardHoldingsTable } from "@/components/dashboard/dashboard-holdings-table";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";

const allocations = [
  { name: "Core Holdings", ratio: "58%", note: "BTC + ETH long-term" },
  { name: "Growth Bucket", ratio: "24%", note: "SOL, AI and high-beta tokens" },
  { name: "Stable Reserve", ratio: "18%", note: "USDT liquidity for entries" },
];

export default function InvestmentsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <DashboardSidebar currentPath="/dashboard/investments" />

        <section className="flex-1 space-y-4 px-6 py-8 md:px-10">
          <header className="rounded-3xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Investments
            </h1>
            <p className="mt-2 text-sm text-white/65">
              Review your allocations, exposure, and active crypto positions.
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-3">
            <DashboardStatCard
              title="Total invested capital"
              value="$67,820"
              note="Across all active crypto positions"
            />
            <DashboardStatCard title="Open positions" value="12" note="9 long / 3 short" />
            <DashboardStatCard
              title="Best performing asset"
              value="BTC"
              note="+11.2% this month"
            />
          </div>

          <section className="rounded-3xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white">Allocation strategy</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {allocations.map((item) => (
                <article
                  key={item.name}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-sm text-white/65">{item.name}</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{item.ratio}</p>
                  <p className="mt-2 text-xs text-white/55">{item.note}</p>
                </article>
              ))}
            </div>
          </section>

          <DashboardHoldingsTable />
        </section>
      </div>
    </main>
  );
}
