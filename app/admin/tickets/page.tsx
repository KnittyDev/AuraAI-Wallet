"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { 
  LuLifeBuoy, 
  LuSearch, 
  LuMessageSquare, 
  LuClock, 
  LuCircleCheck, 
  LuTriangleAlert,
  LuChevronRight,
  LuFilter,
  LuUser
} from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  profiles: {
    full_name: string | null;
    username: string | null;
  } | null;
}

export default function AdminTicketsPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    async function checkAdminAndFetchTickets() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authUser.id)
        .single();

      if (profile?.role === "admin") {
        setIsAdmin(true);
        
        // Fetch tickets with user profile info
        const { data: ticketsData } = await supabase
          .from("tickets")
          .select(`
            *,
            profiles:user_id (full_name, username)
          `)
          .order("created_at", { ascending: false });
        
        setTickets(ticketsData || []);
      } else {
        setIsAdmin(false);
        router.push("/dashboard");
      }
      setLoading(false);
    }

    checkAdminAndFetchTickets();
  }, [router]);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         ticket.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Pending': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'Closed': return 'text-white/30 bg-white/5 border-white/10';
      default: return 'text-white/50 bg-white/5 border-white/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-orange-400';
      case 'Low': return 'text-emerald-400';
      default: return 'text-white/40';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay opacity-50" />

      <AdminSidebar currentPath="/admin/tickets" />

      <section className="relative z-10 flex-1 px-6 py-8 md:px-10 overflow-y-auto">
        <div className="mx-auto max-w-6xl">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
                Support Tickets
                <LuLifeBuoy className="h-6 w-6 text-white/40" />
              </h1>
              <p className="text-white/40 font-medium">Review and respond to user support requests.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl">
              <div className="relative group flex-1">
                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-white/50 transition-colors" />
                <input 
                  type="text"
                  placeholder="Search tickets or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                />
              </div>
              <div className="relative">
                <LuFilter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-12 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10 appearance-none transition-all cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Open">Open</option>
                  <option value="Pending">Pending</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredTickets.map((ticket) => (
              <motion.div 
                key={ticket.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => router.push(`/admin/tickets/${ticket.id}`)}
                className="group relative bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-[2rem] p-6 backdrop-blur-xl transition-all cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className={`h-12 w-12 rounded-2xl border flex items-center justify-center transition-colors ${getStatusColor(ticket.status)}`}>
                      {ticket.status === 'Open' ? <LuMessageSquare className="h-6 w-6" /> : 
                       ticket.status === 'Pending' ? <LuClock className="h-6 w-6" /> : 
                       <LuCircleCheck className="h-6 w-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">{ticket.subject}</h3>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs">
                        <div className="flex items-center gap-1.5 text-white/40">
                          <LuUser className="h-3.5 w-3.5" />
                          <span className="font-bold text-white/60">{ticket.profiles?.full_name || "Unknown User"}</span>
                          <span className="text-white/20">@{ticket.profiles?.username || "n/a"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/20">
                          <LuClock className="h-3.5 w-3.5" />
                          <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-white/20">Priority:</span>
                          <span className={`font-bold uppercase tracking-tighter ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-auto md:ml-0">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-white group-hover:bg-red-500 transition-all">
                      <LuChevronRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredTickets.length === 0 && (
              <div className="py-24 text-center">
                <LuLifeBuoy className="h-16 w-16 text-white/5 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-white/40 mb-2">No tickets found</h3>
                <p className="text-white/20">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}
