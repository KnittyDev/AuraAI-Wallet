"use client";

import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import {
  LuArrowLeft,
  LuClock,
  LuCircleCheck,
  LuMessageCircle,
  LuPaperclip,
  LuDownload,
  LuExternalLink,
  LuUser,
  LuShield
} from "react-icons/lu";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("id", ticketId)
        .single();

      if (data) setTicket(data);
      setLoading(false);
    };

    if (ticketId) fetchTicket();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/20 uppercase tracking-widest text-xs font-bold">
        Accessing ticket data...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/40 uppercase tracking-widest text-xs font-bold">
        Ticket not found.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      <DashboardSidebar currentPath="/dashboard/settings" />

      <section className="relative z-10 flex-1 px-4 py-8 md:px-10 overflow-y-auto">
        <div className="mx-auto max-w-4xl pb-24">
          
          {/* Back Button */}
          <Link href="/dashboard/settings/support/tickets">
            <motion.button 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group text-xs font-bold uppercase tracking-widest"
            >
              <LuArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Tickets
            </motion.button>
          </Link>

          {/* Ticket Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-3xl mb-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] blur-[80px] rounded-full -mr-32 -mt-32" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
                    {ticket.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                    ticket.status === 'Open' ? 'bg-white/5 border-white/20 text-white' : 'bg-black/40 border-white/5 text-white/20'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white">{ticket.subject}</h1>
                <div className="flex items-center gap-4 text-xs text-white/30">
                  <div className="flex items-center gap-1.5">
                    <LuClock className="h-3.5 w-3.5" />
                    {new Date(ticket.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div className="flex items-center gap-1.5 uppercase tracking-tighter font-mono">
                    ID: #{ticket.id.split("-")[0]}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                  <LuShield className="h-6 w-6" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Message Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* User Original Message */}
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <LuUser className="h-5 w-5 text-white/60" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-white/80 leading-relaxed shadow-sm">
                  {ticket.description}
                </div>

                {/* Attachment View */}
                {ticket.attachment_url && (
                  <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-between group max-w-sm">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <LuPaperclip className="h-4 w-4 text-white/60" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Attachment</span>
                        <span className="text-xs text-white/80 truncate">View shared document</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={async () => {
                          const { data } = await supabase.storage.from('support-attachments').createSignedUrl(ticket.attachment_url, 60);
                          if (data?.signedUrl) window.open(data.signedUrl, '_blank');
                        }}
                        className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <LuExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Support Response Placeholder */}
            <div className="flex gap-4 justify-end">
              <div className="flex-1 space-y-4 text-right">
                <div className="p-6 rounded-3xl bg-white/10 border border-white/10 text-white leading-relaxed inline-block max-w-[80%] text-left">
                  Hello! Your ticket has been received. Our team is currently reviewing your request regarding &quot;{ticket.subject}&quot;. We will get back to you shortly.
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center shrink-0 border border-white/10">
                <LuMessageCircle className="h-5 w-5" />
              </div>
            </div>
          </motion.div>

          {/* Quick Action Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] text-center"
          >
            <p className="text-xs text-white/20 font-medium mb-6 uppercase tracking-widest">Do you have more information?</p>
            <div className="flex justify-center gap-4">
              <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                Add Reply
              </button>
              <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all">
                Close Ticket
              </button>
            </div>
          </motion.div>

        </div>
      </section>
    </main>
  );
}
