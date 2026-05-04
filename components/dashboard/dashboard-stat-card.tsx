import { LuTrendingUp, LuTrendingDown } from "react-icons/lu";

type DashboardStatCardProps = {
  title: string;
  value: string;
  note: string;
  trend?: "up" | "down";
};

export function DashboardStatCard({ title, value, note, trend }: DashboardStatCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-all hover:bg-white/[0.05] group">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{title}</p>
        {trend && (
          <div className={`p-1.5 rounded-lg ${trend === "up" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
            {trend === "up" ? <LuTrendingUp className="h-3 w-3" /> : <LuTrendingDown className="h-3 w-3" />}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold tracking-tight text-white group-hover:scale-[1.02] transition-transform origin-left">{value}</p>
      <p className={`mt-2 text-xs font-medium ${trend === "up" ? "text-emerald-400/70" : trend === "down" ? "text-red-400/70" : "text-white/40"}`}>
        {note}
      </p>
    </article>
  );
}
