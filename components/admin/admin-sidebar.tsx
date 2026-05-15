"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import {
  LuLayoutDashboard,
  LuUsers,
  LuLifeBuoy,
  LuSettings,
  LuLogOut,
  LuMenu,
  LuX,
  LuShieldAlert,
  LuArrowUpRight,
  LuArrowDownLeft,
  LuNewspaper
} from "react-icons/lu";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { label: "Admin Overview", href: "/admin", icon: LuLayoutDashboard },
  { label: "Users", href: "/admin/users", icon: LuUsers },
  { label: "Deposits", href: "/admin/deposits", icon: LuArrowDownLeft },
  { label: "Withdrawals", href: "/admin/withdrawals", icon: LuArrowUpRight },
  { label: "Market News", href: "/admin/news", icon: LuNewspaper },
  { label: "Support Tickets", href: "/admin/tickets", icon: LuLifeBuoy },
  { label: "System Settings", href: "/admin/settings", icon: LuSettings },
];

type AdminSidebarProps = {
  currentPath: string;
};

export function AdminSidebar({ currentPath }: AdminSidebarProps) {
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {/* Mobile Burger Button */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-6 left-6 z-[45] h-11 w-11 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center text-white"
      >
        <LuMenu className="h-6 w-6" />
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-[50] bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed inset-y-0 left-0 z-[55] w-72 transform border-r border-white/10 bg-black/80 p-6 backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:flex lg:flex-col lg:p-6 lg:sticky lg:top-0 lg:bg-black/55
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex-1">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Image src="/auralogo.png" alt="Aura Logo" width={32} height={32} className="rounded-lg shadow-lg" />
              <div className="leading-tight">
                <h2 className="text-xl font-bold tracking-tight text-white">Aura</h2>
                <span className="text-[10px] font-bold tracking-widest uppercase text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">Admin</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden h-9 w-9 rounded-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <LuX className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-red-500 text-white font-semibold"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* Link back to User Dashboard */}
            <div className="pt-4 mt-4 border-t border-white/10">
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-cyan-400 hover:bg-cyan-500/10 transition"
              >
                <LuLayoutDashboard className="h-4 w-4" />
                <span>Return to Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-white/40 hover:bg-red-500/10 hover:text-red-400 transition mt-2"
              >
                <LuLogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>

        <div className="lg:mt-auto mt-10 mb-6">
          <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-500/10 to-transparent px-4 py-3">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
              <LuShieldAlert className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <p className="text-[10px] uppercase tracking-wide text-red-400/60 font-bold">
                Access Level
              </p>
              <p className="text-sm font-semibold text-red-400">
                Super Administrator
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
