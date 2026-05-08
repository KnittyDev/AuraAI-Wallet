"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { 
  LuLifeBuoy, 
  LuChevronLeft, 
  LuUser, 
  LuClock, 
  LuSend, 
  LuCircleCheck, 
  LuTriangleAlert,
  LuLoaderCircle,
  LuEllipsisVertical
} from "react-icons/lu";
import { motion } from "framer-motion";

interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  profiles: {
    full_name: string | null;
    username: string | null;
  } | null;
}

interface Reply {
  id: string;
  message: string;
  is_admin_reply: boolean;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
  } | null;
}

export default function AdminTicketDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    async function checkAdminAndFetchData() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { router.push("/login"); return; }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", authUser.id).single();

      if (profile?.role === "admin") {
        setIsAdmin(true);
        
        // Fetch Ticket
        const { data: ticketData } = await supabase
          .from("tickets")
          .select("*, profiles:user_id(full_name, username)")
          .eq("id", id)
          .single();
        
        setTicket(ticketData);

        // Fetch Replies
        const { data: repliesData } = await supabase
          .from("ticket_replies")
          .select("*, profiles:user_id(full_name)")
          .eq("ticket_id", id)
          .order("created_at", { ascending: true });
        
        setReplies(repliesData || []);
      } else {
        router.push("/dashboard");
      }
      setLoading(false);
    }

    checkAdminAndFetchData();
  }, [id, router]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || isSending) return;

    setIsSending(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { data: newReply, error } = await supabase
      .from("ticket_replies")
      .insert({
        ticket_id: id,
        user_id: user?.id,
        message: replyMessage,
        is_admin_reply: true
      })
      .select("*, profiles:user_id(full_name)")
      .single();

    if (!error && newReply) {
      setReplies([...replies, newReply]);
      setReplyMessage("");
      
      // Auto-update status to Pending if it was Open
      if (ticket?.status === 'Open') {
        await updateTicketStatus('Pending');
      }
    }
    setIsSending(false);
  };

  const updateTicketStatus = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    const { error } = await supabase
      .from("tickets")
      .update({ status: newStatus })
      .eq("id", id);
    
    if (!error) {
      setTicket(prev => prev ? { ...prev, status: newStatus } : null);
    }
    setIsUpdatingStatus(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <LuLoaderCircle className="h-8 w-8 text-red-500 animate-spin" />
    </div>
  );

  if (!ticket) return null;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay opacity-50" />

      <AdminSidebar currentPath="/admin/tickets" />

      <section className="relative z-10 flex-1 flex flex-col h-screen">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push("/admin/tickets")}
              className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
            >
              <LuChevronLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white line-clamp-1">{ticket.subject}</h1>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest flex items-center gap-2">
                Ticket ID: {ticket.id.slice(0, 8)}
                <span className={`px-2 py-0.5 rounded border ${
                  ticket.status === 'Open' ? 'border-emerald-500/20 text-emerald-400' :
                  ticket.status === 'Pending' ? 'border-orange-500/20 text-orange-400' :
                  'border-white/10 text-white/30'
                }`}>
                  {ticket.status}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select 
              value={ticket.status}
              disabled={isUpdatingStatus}
              onChange={(e) => updateTicketStatus(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white/60 focus:outline-none focus:ring-2 focus:ring-white/10 appearance-none cursor-pointer hover:bg-white/10 transition-all"
            >
              <option value="Open">Set Open</option>
              <option value="Pending">Set Pending</option>
              <option value="Closed">Set Closed</option>
            </select>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Original Request */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <LuUser className="h-5 w-5 text-white/40" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{ticket.profiles?.full_name}</p>
                  <p className="text-xs text-white/20">Initial Request • {new Date(ticket.created_at).toLocaleString()}</p>
                </div>
              </div>
              <p className="text-white/70 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
            </div>

            {/* Replies */}
            <div className="space-y-6">
              {replies.map((reply) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={reply.id}
                  className={`flex ${reply.is_admin_reply ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-[1.5rem] p-5 ${
                    reply.is_admin_reply 
                      ? 'bg-red-500/10 border border-red-500/20 text-white rounded-tr-none' 
                      : 'bg-white/5 border border-white/10 text-white/70 rounded-tl-none'
                  }`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-40">
                      {reply.is_admin_reply ? 'Admin Support' : ticket.profiles?.full_name} • {new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{reply.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Reply Box */}
        <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-xl shrink-0">
          <form onSubmit={handleSendReply} className="max-w-4xl mx-auto relative group">
            <textarea 
              placeholder={ticket.status === 'Closed' ? "Ticket is closed. Re-open to reply." : "Type your response..."}
              disabled={ticket.status === 'Closed' || isSending}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/30 transition-all min-h-[80px] max-h-[200px] disabled:opacity-30"
            />
            <button 
              type="submit"
              disabled={!replyMessage.trim() || isSending || ticket.status === 'Closed'}
              className="absolute right-4 bottom-4 h-10 w-10 rounded-xl bg-red-500 text-white flex items-center justify-center hover:bg-red-600 disabled:bg-white/5 disabled:text-white/20 transition-all shadow-lg active:scale-95"
            >
              {isSending ? <LuLoaderCircle className="h-5 w-5 animate-spin" /> : <LuSend className="h-5 w-5" />}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
