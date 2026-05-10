import { LuTrendingUp, LuTrendingDown } from "react-icons/lu";

type DashboardStatCardProps = {
  title: string;
  value: string;
  note: string;
  trend?: "up" | "down";
};

export function DashboardStatCard({ title, value, note, trend }: DashboardStatCardProps) {
  return (
    <article className="rounded-2xl md:rounded-3xl border border-white/10 bg-white/[0.03] p-4 md:p-6 backdrop-blur-md transition-all hover:bg-white/[0.05] group flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 truncate pr-2">{title}</p>
          {trend && (
            <div className={`p-1 md:p-1.5 rounded-lg shrink-0 ${trend === "up" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
              {trend === "up" ? <LuTrendingUp className="h-3 w-3" /> : <LuTrendingDown className="h-3 w-3" />}
            </div>
          )}
        </div>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mb-1 md:mb-0 group-hover:scale-[1.02] transition-transform origin-left truncate">{value}</p>
      </div>
      <p className={`mt-1 md:mt-2 text-[9px] md:text-xs font-medium leading-snug line-clamp-2 ${trend === "up" ? "text-emerald-400/70" : trend === "down" ? "text-red-400/70" : "text-white/40"}`}>
        {note}
      </p>
    </article>
  );
}
