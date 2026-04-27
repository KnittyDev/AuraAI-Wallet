type DashboardStatCardProps = {
  title: string;
  value: string;
  note: string;
};

export function DashboardStatCard({ title, value, note }: DashboardStatCardProps) {
  return (
    <article className="rounded-2xl border border-white/15 bg-black/45 p-4 backdrop-blur-sm">
      <p className="text-sm text-white/65">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-xs text-white/55">{note}</p>
    </article>
  );
}
