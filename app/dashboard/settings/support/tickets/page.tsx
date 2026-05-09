"use client";

import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import {
  LuArrowLeft,
  LuPlus,
  LuClock,
  LuCircleCheck,
  LuLifeBuoy,
  LuChevronRight,
  LuSearch,
  LuMessageCircle
} from "react-icons/lu";
import Link from "next/link";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function TicketsListPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ active: 0, resolved: 0, total: 0 });

  useEffect(() => {
    const fetchTickets = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setTickets(data);
        const active = data.filter(t => t.status !== "Closed").length;
        const resolved = data.filter(t => t.status === "Closed").length;
        setStats({ active, resolved, total: data.length });
      }
      setLoading(false);
    };

    fetchTickets();
  }, [supabase]);
  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      <DashboardSidebar currentPath="/dashboard/settings" />

      <section className="relative z-10 flex-1 px-4 py-8 md:px-10 overflow-y-auto">
        <div className="mx-auto max-w-5xl pb-24">
          
          {/* Back Button */}
          <Link href="/dashboard/settings/support">
            <motion.button 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group text-xs font-bold uppercase tracking-widest"
            >
              <LuArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Support Center
            </motion.button>
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-bold tracking-tight text-white mb-4">My Support Tickets</h1>
              <p className="text-white/40 font-medium">Track your active and resolved support requests.</p>
            </motion.div>

            <Link href="/dashboard/settings/support/new-ticket">
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
              >
                <LuPlus className="h-4 w-4" />
                Create New Ticket
              </motion.button>
            </Link>
          </div>

          {/* Ticket Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[
              { label: "Active", value: stats.active.toString(), icon: LuClock, color: "text-white" },
              { label: "Resolved", value: stats.resolved.toString(), icon: LuCircleCheck, color: "text-white/60" },
              { label: "Total", value: stats.total.toString(), icon: LuMessageCircle, color: "text-white/40" },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Search & Filter Placeholder */}
          <div className="mb-6 flex items-center bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4">
            <LuSearch className="h-5 w-5 text-white/20 mr-4" />
            <input type="text" placeholder="Search for tickets..." className="bg-transparent border-none outline-none text-white placeholder:text-white/20 w-full text-sm" />
          </div>

          {/* Ticket List Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl"
          >
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center text-white/20 font-bold uppercase tracking-widest text-xs">
                  Syncing with Aura neural link...
                </div>
              ) : tickets.length === 0 ? (
                <div className="p-12 text-center text-white/20 font-bold uppercase tracking-widest text-xs">
                  No tickets found in your history.
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-8 py-6 text-[10px] font-bold text-white/30 uppercase tracking-widest">ID</th>
                      <th className="px-8 py-6 text-[10px] font-bold text-white/30 uppercase tracking-widest">Subject</th>
                      <th className="px-8 py-6 text-[10px] font-bold text-white/30 uppercase tracking-widest">Category</th>
                      <th className="px-8 py-6 text-[10px] font-bold text-white/30 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-6 text-[10px] font-bold text-white/30 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {tickets.map((ticket, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6">
                          <span className="text-[10px] font-mono text-white/40 uppercase">#{ticket.id.split("-")[0]}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-sm font-bold text-white">{ticket.subject}</div>
                          <div className="text-[10px] text-white/20 mt-1">
                            {new Date(ticket.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-xs text-white/60">{ticket.category}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                            ticket.status === 'Open' ? 'bg-white/10 text-white' : 
                            ticket.status === 'Pending' ? 'bg-white/5 text-white/40' : 'bg-white/5 text-white/10'
                          }`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <Link href={`/dashboard/settings/support/tickets/${ticket.id}`}>
                            <button className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all ml-auto">
                              <LuChevronRight className="h-4 w-4" />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>

          {/* Empty State Help */}
          <div className="mt-12 text-center p-12 rounded-[2.5rem] border border-dashed border-white/10">
            <LuLifeBuoy className="h-12 w-12 text-white/10 mx-auto mb-4" />
            <h3 className="text-white/60 font-bold mb-2">Can't find what you need?</h3>
            <p className="text-xs text-white/30 mb-6">Our automated AI assistant handles 90% of requests in seconds.</p>
            <Link href="/dashboard/settings/support/ai-tutorial">
              <button className="text-xs font-bold text-white hover:underline uppercase tracking-widest">Visit AI Help Center</button>
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
