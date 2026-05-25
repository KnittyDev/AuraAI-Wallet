"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { OpenPositionsTable } from "@/components/dashboard/open-positions-table";
import { TradingviewMarketWidget } from "@/components/dashboard/tradingview-market-widget";
import { MarketNews } from "@/components/dashboard/market-news";
import { useLanguage } from "@/context/language-context";

export default function MarketDataPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <DashboardSidebar currentPath="/dashboard/market-data" />

        <section className="flex-1 space-y-8 px-6 py-8 md:px-10 lg:ml-72 min-w-0 max-w-[100vw]">
          <header className="rounded-3xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {t("marketData.title")}
            </h1>
            <p className="mt-2 text-sm text-white/65">
              {t("marketData.subtitle")}
            </p>
          </header>

          <section className="rounded-3xl border border-white/15 bg-black/45 p-3 backdrop-blur-sm md:p-5">
            <TradingviewMarketWidget />
          </section>

          <OpenPositionsTable />

          <MarketNews />
        </section>

      </div>
    </main>
  );
}

