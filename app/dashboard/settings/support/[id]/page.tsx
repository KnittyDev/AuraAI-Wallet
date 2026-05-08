"use client";

import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import {
  LuArrowLeft,
  LuClock,
  LuTag,
  LuCircleAlert,
  LuCircleCheck,
  LuMessageSquare,
  LuSend,
  LuUser
} from "react-icons/lu";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'Open' | 'Pending' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  category: string;
  created_at: string;
}

interface Reply {
  id: string;
  message: string;
  is_admin_reply: boolean;
  created_at: string;
}

export default function TicketDetailPage() {
  const params = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function fetchTicketData() {
      if (!params.id) return;

      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', params.id)
        .single();

      if (!ticketError && ticketData) {
        setTicket(ticketData as Ticket);
        
        const { data: replyData, error: replyError } = await supabase
          .from('ticket_replies')
          .select('*')
          .eq('ticket_id', params.id)
          .order('created_at', { ascending: true });

        if (!replyError && replyData) {
          setReplies(replyData as Reply[]);
        }
      }
      setLoading(false);
    }
    fetchTicketData();
  }, [params.id]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !ticket) return;
    setSending(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('ticket_replies')
        .insert({
          ticket_id: ticket.id,
          user_id: user.id,
          message: newMessage,
          is_admin_reply: false
        })
        .select()
        .single();

      if (error) throw error;

      setReplies([...replies, data as Reply]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send reply:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Ticket not found</h1>
        <Link href="/dashboard/settings/support" className="px-8 py-3 rounded-2xl bg-white text-black font-bold">Back to Support</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      <DashboardSidebar currentPath="/dashboard/settings" />

      <section className="relative z-10 flex-1 px-6 py-8 md:px-10 overflow-y-auto">
        <div className="mx-auto max-w-5xl">
          
          <Link 
            href="/dashboard/settings/support"
            className="inline-flex items-center gap-2 text-xs font-bold text-white/30 uppercase tracking-widest hover:text-white transition-colors mb-8"
          >
            <LuArrowLeft className="h-3 w-3" /> Back to Support
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Ticket Content & Conversation */}
            <div className="lg:col-span-8 space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold">{ticket.subject}</h1>
                  <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${
                    ticket.status === 'Open' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' :
                    ticket.status === 'Pending' ? 'text-orange-400 bg-orange-400/10 border-orange-400/20' :
                    'text-white/30 bg-white/5 border-white/10'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <div className="text-white/60 leading-relaxed whitespace-pre-wrap text-sm border-l-2 border-white/5 pl-6 py-2">
                  {ticket.description}
                </div>
              </motion.div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 px-4">
                  <LuMessageSquare className="h-4 w-4 text-white/20" />
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/20">Conversation History</h3>
                </div>

                <div className="space-y-4">
                  {replies.map((reply, idx) => (
                    <motion.div
                      key={reply.id}
                      initial={{ opacity: 0, x: reply.is_admin_reply ? -10 : 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${reply.is_admin_reply ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-[80%] p-6 rounded-3xl border ${
                        reply.is_admin_reply 
                          ? 'bg-white/5 border-white/10 rounded-bl-none' 
                          : 'bg-cyan-500/10 border-cyan-500/20 rounded-br-none'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`h-6 w-6 rounded-lg flex items-center justify-center border ${
                            reply.is_admin_reply ? 'bg-white/10 border-white/10 text-white' : 'bg-cyan-500/20 border-cyan-500/20 text-cyan-400'
                          }`}>
                            {reply.is_admin_reply ? <LuCircleAlert className="h-3 w-3" /> : <LuUser className="h-3 w-3" />}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                            {reply.is_admin_reply ? 'Aura Support' : 'You'}
                          </span>
                          <span className="text-[9px] text-white/20 ml-2">
                            {new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed">{reply.message}</p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {replies.length === 0 && (
                    <div className="p-8 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                      <p className="text-xs text-white/20 font-medium italic">Waiting for initial response from support...</p>
                    </div>
                  )}
                </div>

                {ticket.status !== 'Closed' && (
                  <form onSubmit={handleSendReply} className="relative mt-8">
                    <textarea 
                      rows={3}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your reply here..."
                      className="w-full bg-white/[0.02] border border-white/10 rounded-[2rem] p-6 pr-20 text-sm text-white outline-none focus:border-cyan-500/50 transition-all resize-none shadow-2xl"
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="absolute bottom-4 right-4 h-12 w-12 rounded-2xl bg-white text-black flex items-center justify-center hover:scale-105 transition-all active:scale-95 disabled:opacity-50 shadow-xl"
                    >
                      <LuSend className="h-5 w-5" />
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right: Ticket Info Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03] space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Ticket Metadata</h4>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs text-white/40"><LuTag className="h-4 w-4" /> Category</span>
                      <span className="text-xs font-bold text-white">{ticket.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs text-white/40"><LuCircleAlert className="h-4 w-4" /> Priority</span>
                      <span className={`text-xs font-bold ${ticket.priority === 'High' ? 'text-red-400' : 'text-white'}`}>{ticket.priority}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs text-white/40"><LuClock className="h-4 w-4" /> Created</span>
                      <span className="text-xs font-bold text-white">{new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-4 text-center">
                  <LuCircleCheck className="h-8 w-8 text-white/10 mx-auto" />
                  <p className="text-[10px] text-white/20 font-medium leading-relaxed italic">
                    All support conversations are logged and reviewed for quality assurance.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </main>
  );
}
