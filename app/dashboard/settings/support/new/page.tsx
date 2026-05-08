"use client";

import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import {
  LuArrowLeft,
  LuSend,
  LuCircleAlert,
  LuCircleCheck
} from "react-icons/lu";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTicketPage() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Technical");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: insertError } = await supabase
        .from('tickets')
        .insert({
          user_id: user.id,
          subject,
          category,
          priority,
          description,
          status: 'Open'
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => router.push("/dashboard/settings/support"), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to submit ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      <DashboardSidebar currentPath="/dashboard/settings" />

      <section className="relative z-10 flex-1 px-6 py-8 md:px-10 overflow-y-auto">
        <div className="mx-auto max-w-4xl">
          
          <Link 
            href="/dashboard/settings/support"
            className="inline-flex items-center gap-2 text-xs font-bold text-white/30 uppercase tracking-widest hover:text-white transition-colors mb-8"
          >
            <LuArrowLeft className="h-3 w-3" /> Back to Support
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 md:p-12 rounded-[3rem] border border-white/10 bg-white/[0.02] backdrop-blur-2xl"
          >
            <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Ticket</h1>
            <p className="text-white/40 mb-10 font-medium">Describe your issue and we&apos;ll get back to you as soon as possible.</p>

            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-6"
              >
                <div className="h-20 w-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <LuCircleCheck className="h-10 w-10 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Ticket Submitted!</h3>
                  <p className="text-white/40">Redirecting you back to the support center...</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Category</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-white/20 transition-all appearance-none cursor-pointer"
                    >
                      <option>Technical</option>
                      <option>Account</option>
                      <option>Payments</option>
                      <option>Security</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Priority</label>
                    <select 
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-white/20 transition-all appearance-none cursor-pointer"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Subject</label>
                  <input 
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of your issue"
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium text-white outline-none focus:border-white/20 transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Description</label>
                  <textarea 
                    required
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide as much detail as possible..."
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium text-white outline-none focus:border-white/20 transition-all resize-none"
                  />
                </div>

                {error && (
                  <div className="p-4 rounded-2xl bg-red-400/10 border border-red-400/20 text-red-400 text-xs font-bold flex items-center gap-3">
                    <LuCircleAlert className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 rounded-2xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? "Submitting..." : <><LuSend className="h-4 w-4" /> Submit Ticket</>}
                </button>
              </form>
            )}
          </motion.div>

          <div className="mt-12 p-8 rounded-3xl border border-white/5 bg-white/[0.01] flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                <LuCircleAlert className="h-5 w-5" />
              </div>
              <p className="text-xs text-white/40 font-medium max-w-md">Our neural support agents typically respond within 2-4 business hours for high priority requests.</p>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
