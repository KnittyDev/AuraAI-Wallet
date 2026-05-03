import Link from "next/link";
import Image from "next/image";

import {
  LuChartBar,
  LuLayoutDashboard,
  LuSettings,
  LuWallet,
  LuWaypoints,
  LuPlus,
  LuSparkles,
  LuLogOut,
  LuTrendingUp,
  LuActivity,
} from "react-icons/lu";





import { SiTether } from "react-icons/si";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LuLayoutDashboard },
  { label: "My Wallet", href: "/dashboard/wallet", icon: LuWallet },
  { label: "Market Data", href: "/dashboard/market-data", icon: LuChartBar },
  { label: "Investments", href: "/dashboard/investments", icon: LuTrendingUp },
  { label: "Transactions", href: "/dashboard/transactions", icon: LuWaypoints },


  { label: "Performance", href: "/dashboard/performance", icon: LuActivity },


  { label: "Ask AI", href: "/dashboard/ask-ai", icon: LuSparkles },

  { label: "Settings", href: "#", icon: LuSettings },
];


type DashboardSidebarProps = {
  currentPath: string;
};

export function DashboardSidebar({ currentPath }: DashboardSidebarProps) {

  return (
    <aside className="relative z-20 w-full border-r border-white/10 bg-black/55 p-5 backdrop-blur-sm lg:flex lg:h-screen lg:w-72 lg:flex-col lg:p-6 lg:sticky lg:top-0">

      <div className="flex-1">
        <div className="mb-8 flex items-center gap-2.5">
          <Image src="/auralogo.png" alt="Aura Logo" width={32} height={32} className="rounded-lg shadow-lg" />
          <h2 className="text-xl font-bold tracking-tight text-white">Aura</h2>
        </div>

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
          
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-white/40 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <LuLogOut className="h-4 w-4" />
            <span>Logout</span>
          </Link>
        </nav>
      </div>

      <div className="lg:mt-auto mt-10 mb-6">


        <div className="flex items-center gap-3 rounded-2xl border border-emerald-300/25 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 px-4 py-3 shadow-[0_10px_30px_rgba(16,185,129,0.15)]">

          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-500/15 text-emerald-200">
            <SiTether className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <p className="text-[10px] uppercase tracking-wide text-emerald-200/60">
              Available Balance
            </p>
            <p className="text-sm font-semibold text-emerald-100">4,120 USDT</p>
          </div>
        </div>
      </div>
    </aside>

  );
}

