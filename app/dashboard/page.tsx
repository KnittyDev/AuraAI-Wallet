import { DashboardHoldingsTable } from "@/components/dashboard/dashboard-holdings-table";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <DashboardSidebar currentPath="/dashboard" />

        <section className="flex-1 space-y-4 px-6 py-8 md:px-10">
          <header className="rounded-3xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  Investment Dashboard
                </h1>
                <p className="mt-2 text-sm text-white/65">
                  Track your portfolio value, returns, and AI trading actions in one place.
                </p>
              </div>

              <button
                type="button"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/85"
              >
                Yatırım Yap
              </button>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-3">
            <DashboardStatCard
              title="Total portfolio value"
              value="$67,820"
              note="+6.4% from last month"
            />
            <DashboardStatCard
              title="Monthly profit"
              value="$3,350"
              note="Aura AI strategy projection"
            />
            <DashboardStatCard
              title="Available balance"
              value="$4,120"
              note="Ready for new positions"
            />
          </div>

          <DashboardHoldingsTable />
        </section>
      </div>
    </main>
  );
}
