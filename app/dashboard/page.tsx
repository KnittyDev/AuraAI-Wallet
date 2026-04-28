import { DashboardHoldingsTable } from "@/components/dashboard/dashboard-holdings-table";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import { LuArrowUpRight, LuWallet, LuPlus } from "react-icons/lu";
import { SiTether } from "react-icons/si";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <DashboardSidebar currentPath="/dashboard" />

        <section className="flex-1 space-y-4 px-6 py-8 md:px-10">
          <div className="flex justify-end">
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-300/25 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 px-4 py-2.5 shadow-[0_10px_30px_rgba(16,185,129,0.15)]">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-500/15 text-emerald-200">
                <SiTether className="h-4 w-4" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] uppercase tracking-wide text-emerald-200/70">
                  Available Balance
                </p>
                <p className="text-sm font-semibold text-emerald-100">4,120 USDT</p>
              </div>
            </div>
          </div>

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

              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/deposit"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <LuPlus className="h-4 w-4" />
                  Deposit
                </Link>
                
                <Link
                  href="/dashboard/new-investment"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/85"
                >
                  <LuWallet className="h-4 w-4" />
                  New Investment
                  <LuArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
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
