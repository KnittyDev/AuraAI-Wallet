import Link from "next/link";
import {
  LuChartBar,
  LuLayoutDashboard,
  LuSettings,
  LuWallet,
  LuWaypoints,
} from "react-icons/lu";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LuLayoutDashboard },
  { label: "Market Data", href: "/dashboard/market-data", icon: LuChartBar },
  { label: "Investments", href: "#", icon: LuWallet },
  { label: "Transactions", href: "#", icon: LuWaypoints },
  { label: "Performance", href: "#", icon: LuChartBar },
  { label: "Settings", href: "#", icon: LuSettings },
];

type DashboardSidebarProps = {
  currentPath: string;
};

export function DashboardSidebar({ currentPath }: DashboardSidebarProps) {
  return (
    <aside className="w-full border-r border-white/10 bg-black/55 p-5 backdrop-blur-sm lg:min-h-screen lg:w-72 lg:p-6">
      <h2 className="mb-5 text-lg font-semibold text-white">Aura Dashboard</h2>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-white text-black font-semibold"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
