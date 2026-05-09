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

interface Reply {
  id: string;
  message: string;
  is_admin_reply: boolean;
  created_at: string;
  user_id: string;
  attachment_url: string | null;
}

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const [ticket, setTicket] = useState<any>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const fetchTicketAndReplies = async () => {
    const { data: ticketData } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", ticketId)
      .single();

    if (ticketData) {
      setTicket(ticketData);
      
      const { data: repliesData } = await supabase
        .from("ticket_replies")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });
      
      setReplies(repliesData || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (ticketId) fetchTicketAndReplies();
  }, [ticketId]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || isSending || !ticket) return;

    setIsSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let uploaded_attachment_url = null;
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('support-attachments')
          .upload(fileName, file);
        
        if (uploadError) throw uploadError;
        uploaded_attachment_url = data.path;
      }

      const { data: newReply, error } = await supabase
        .from("ticket_replies")
        .insert({
          ticket_id: ticketId,
          user_id: user.id,
          message: replyMessage,
          is_admin_reply: false,
          attachment_url: uploaded_attachment_url
        })
        .select("*")
        .single();

      if (error) throw error;
      
      setReplies([...replies, newReply]);
      setReplyMessage("");
      setFile(null);

      // Update ticket status to Open if it was Pending
      if (ticket.status === 'Pending') {
        await supabase.from("tickets").update({ status: 'Open' }).eq("id", ticketId);
        setTicket({ ...ticket, status: 'Open' });
      }
    } catch (err: any) {
      alert(err.message || "Failed to send reply");
    } finally {
      setIsSending(false);
    }
  };

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

      <section className="relative z-10 flex-1 px-4 py-8 md:px-10 overflow-y-auto custom-scrollbar">
        <div className="mx-auto max-w-4xl pb-32">
          
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
            className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-3xl mb-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] blur-[80px] rounded-full -mr-32 -mt-32" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
                    {ticket.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                    ticket.status === 'Open' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                    ticket.status === 'Pending' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                    'bg-white/5 border-white/5 text-white/20'
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

          {/* Messages Thread */}
          <div className="space-y-10">
            {/* User Original Message */}
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <LuUser className="h-5 w-5 text-white/60" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-white/80 leading-relaxed shadow-sm">
                  {ticket.description}
                </div>

                {ticket.attachment_url && (
                  <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-between group max-w-sm">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <LuPaperclip className="h-4 w-4 text-white/60" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Attachment</span>
                        <span className="text-xs text-white/80 truncate">View shared document</span>
                      </div>
                    </div>
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
                )}
              </div>
            </div>

            {/* Replies List */}
            {replies.map((reply) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={reply.id} 
                className={`flex gap-4 ${reply.is_admin_reply ? 'justify-end' : ''}`}
              >
                {!reply.is_admin_reply && (
                  <div className="h-10 w-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                    <LuUser className="h-5 w-5 text-white/60" />
                  </div>
                )}
                
                <div className={`flex-1 space-y-4 ${reply.is_admin_reply ? 'text-right' : ''}`}>
                  <div className={`p-6 rounded-3xl leading-relaxed inline-block max-w-[85%] text-left ${
                    reply.is_admin_reply 
                      ? 'bg-red-500/10 border border-red-500/20 text-white shadow-lg' 
                      : 'bg-white/[0.02] border border-white/5 text-white/80'
                  }`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${reply.is_admin_reply ? 'text-white/60' : 'text-white/20'}`}>
                      {reply.is_admin_reply ? 'Aura Support' : 'You'} • {new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm">{reply.message}</p>
                    
                    {reply.attachment_url && (
                      <div className={`mt-4 p-3 rounded-xl border flex items-center justify-between gap-4 ${
                        reply.is_admin_reply ? 'bg-black/20 border-white/5' : 'bg-white/5 border-white/10'
                      }`}>
                        <div className="flex items-center gap-2 overflow-hidden">
                          <LuPaperclip className="h-3.5 w-3.5 text-white/40" />
                          <span className="text-[10px] text-white/60 truncate">Attachment</span>
                        </div>
                        <button 
                          onClick={async () => {
                            const { data } = await supabase.storage.from('support-attachments').createSignedUrl(reply.attachment_url!, 60);
                            if (data?.signedUrl) window.open(data.signedUrl, '_blank');
                          }}
                          className="text-white/40 hover:text-white transition-colors"
                        >
                          <LuExternalLink className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {reply.is_admin_reply && (
                  <div className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center shrink-0 border border-white/10 shadow-lg">
                    <LuMessageCircle className="h-5 w-5" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Reply Form */}
          {ticket.status !== 'Closed' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
              
              <form onSubmit={handleSendReply} className="relative z-10 space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Send a Message</h3>
                  {file && (
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      <LuPaperclip className="h-3 w-3" />
                      {file.name}
                    </span>
                  )}
                </div>
                
                <div className="relative group">
                  <textarea
                    rows={4}
                    placeholder="Type your response here..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 pr-16 text-white placeholder:text-white/20 outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all resize-none text-sm"
                    required
                  />
                  <div className="absolute right-4 bottom-4 flex items-center gap-2">
                    <label className={`h-11 w-11 rounded-2xl border flex items-center justify-center cursor-pointer transition-all ${
                      file ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                    }`}>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                      <LuPaperclip className="h-5 w-5" />
                    </label>
                    <button 
                      type="submit"
                      disabled={!replyMessage.trim() || isSending}
                      className="h-11 w-11 rounded-2xl bg-white text-black flex items-center justify-center hover:bg-white/90 disabled:opacity-20 disabled:hover:scale-100 transition-all shadow-xl active:scale-95 hover:scale-105"
                    >
                      {isSending ? <LuMessageCircle className="h-5 w-5 animate-pulse" /> : <LuMessageCircle className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          ) : (
            <div className="mt-16 p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] text-center">
              <p className="text-xs text-white/20 font-medium uppercase tracking-widest">This ticket is closed.</p>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
