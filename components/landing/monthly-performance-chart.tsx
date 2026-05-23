"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLanguage } from "@/context/language-context";

export function MonthlyPerformanceChart() {
  const { t } = useLanguage();

  const comparisonData = [
    { method: t("results.manualLabel"), investedUsd: 17400, profitUsd: 1520 },
    { method: t("results.auraLabel"), investedUsd: 17400, profitUsd: 3350 },
  ];

  return (
    <div className="mt-8 rounded-2xl border border-white/12 bg-black/35 p-4">
      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-white/80">
          <p className="text-white/60">{t("results.monthlyInvested")}</p>
          <p className="mt-1 text-xl font-semibold text-white">$17,400</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-white/80">
          <p className="text-white/60">{t("results.profitDifference")}</p>
          <p className="mt-1 text-xl font-semibold text-white">+$1,830</p>
        </div>
      </div>

      <div className="h-56 w-full md:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={comparisonData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
          <XAxis
            dataKey="method"
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 13 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
            width={76}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(10, 12, 18, 0.95)",
              color: "#fff",
            }}
            labelStyle={{ color: "rgba(255,255,255,0.8)" }}
            formatter={(value: any, name: any) => [
              `$${Math.round(Number(value) || 0).toLocaleString()}`,
              name || "",
            ]}


          />
          <Bar
            dataKey="profitUsd"
            name={t("results.monthlyProfitUsd")}
            fill="#b463d4"
            radius={[6, 6, 0, 0]}
            barSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}

