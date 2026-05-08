"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import {
  LuLifeBuoy,
  LuPlus,
  LuClock,
  LuCircleCheck,
  LuCircleAlert,
  LuChevronRight,
  LuMessageSquare,
  LuArrowLeft
} from "react-icons/lu";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Ticket {
  id: string;
  subject: string;
  status: 'Open' | 'Pending' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  created_at: string;
  category: string;
}

export default function SupportCenterPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('tickets')
        .select('id, subject, status, priority, created_at, category')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setTickets(data as Ticket[]);
      }
      setLoading(false);
    }
    fetchTickets();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Pending': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Closed': return 'text-white/30 bg-white/5 border-white/10';
      default: return 'text-white/40 bg-white/5 border-white/10';
    }
  };



  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      <DashboardSidebar currentPath="/dashboard/settings" />

      <section className="relative z-10 flex-1 px-6 py-8 md:px-10 overflow-y-auto">
        <div className="mx-auto max-w-6xl">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="space-y-1">
              <Link 
                href="/dashboard/settings"
                className="inline-flex items-center gap-2 text-xs font-bold text-white/30 uppercase tracking-widest hover:text-white transition-colors mb-4"
              >
                <LuArrowLeft className="h-3 w-3" /> Back to Settings
              </Link>
              <h1 className="text-4xl font-bold tracking-tight">Support Center</h1>
              <p className="text-white/40 font-medium">How can we help you today?</p>
            </div>
            
            <Link href="/dashboard/settings/support/new">
              <button className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-bold text-sm hover:scale-105 transition-all active:scale-95 shadow-[0_10px_40px_rgba(255,255,255,0.2)]">
                <LuPlus className="h-4 w-4" /> New Ticket
              </button>
            </Link>
          </div>

          {/* Tickets List */}
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 rounded-3xl border border-white/5 bg-white/[0.01] animate-pulse" />
              ))
            ) : tickets.length > 0 ? (
              tickets.map((ticket, idx) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link href={`/dashboard/settings/support/${ticket.id}`}>
                    <div className="group p-6 md:p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${
                          ticket.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          ticket.status === 'Pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                          'bg-white/5 text-white/20 border-white/10'
                        }`}>
                          {ticket.status === 'Closed' ? <LuCircleCheck className="h-6 w-6" /> : <LuCircleAlert className="h-6 w-6" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{ticket.subject}</h4>
                            <span className={`px-2 py-0.5 rounded-lg border text-[8px] font-bold uppercase tracking-widest ${getStatusColor(ticket.status)}`}>
                              {ticket.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-white/20 font-medium">
                            <span className="flex items-center gap-1.5"><LuClock className="h-3 w-3" /> {new Date(ticket.created_at).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{ticket.category}</span>
                            <span>•</span>
                            <span className={ticket.priority === 'High' ? 'text-red-400' : 'text-white/20'}>{ticket.priority} Priority</span>
                          </div>
                        </div>
                      </div>
                      <LuChevronRight className="hidden md:block h-5 w-5 text-white/10 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="h-20 w-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto opacity-20">
                  <LuLifeBuoy className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-white/40">No tickets found</h3>
                <p className="text-sm text-white/20 max-w-xs mx-auto">You haven&apos;t created any support requests yet. If you need help, feel free to open a ticket.</p>
              </div>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}
