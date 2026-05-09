"use client";

import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AuroraBackground } from "@/components/landing/aurora-background";
import {
  LuArrowLeft,
  LuSend,
  LuCircleAlert,
  LuPaperclip,
  LuLifeBuoy,
  LuMessageSquare,
  LuShield
} from "react-icons/lu";
import Link from "next/link";
import { useState } from "react";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NewTicketPage() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      let attachment_url = null;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('support-attachments')
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        attachment_url = data.path;
      }

      const { error } = await supabase
        .from("tickets")
        .insert([
          {
            user_id: user.id,
            subject,
            category,
            description: message,
            status: "Open",
            priority: "Medium",
            attachment_url
          }
        ]);

      if (error) throw error;

      router.push("/dashboard/settings/support/tickets");
    } catch (error: any) {
      alert(error.message || "Failed to submit ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      <DashboardSidebar currentPath="/dashboard/settings" />

      <section className="relative z-10 flex-1 px-4 py-8 md:px-10 overflow-y-auto">
        <div className="mx-auto max-w-3xl pb-24">
          
          {/* Back Button */}
          <Link href="/dashboard/settings/support">
            <motion.button 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group text-xs font-bold uppercase tracking-widest"
            >
              <LuArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Support
            </motion.button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Create New Ticket</h1>
            <p className="text-white/40 font-medium">Describe your issue and our team will get back to you within 24 hours.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Category Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Issue Category</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "General", label: "General", icon: LuMessageSquare },
                    { id: "Account", label: "Account", icon: LuShield },
                    { id: "Finance", label: "Finance", icon: LuCircleAlert },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                        category === cat.id 
                        ? "bg-white/10 border-white/20 text-white" 
                        : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                      }`}
                    >
                      <cat.icon className="h-4 w-4" />
                      <span className="text-sm font-bold">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Withdrawal pending for 2 hours"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-colors"
                  required
                />
              </div>

              {/* Message */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Message Detail</label>
                <textarea
                  rows={6}
                  placeholder="Tell us more about your problem..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-colors resize-none"
                  required
                />
              </div>

              {/* Attachment */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Attachments (Optional)</label>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <LuPaperclip className={`h-4 w-4 ${file ? "text-white" : "text-white/40"}`} />
                    <span className={`text-xs font-medium truncate ${file ? "text-white" : "text-white/40 italic"}`}>
                      {file ? file.name : "Attach screenshots or logs"}
                    </span>
                  </div>
                  <label className="cursor-pointer shrink-0">
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*,.pdf,.txt"
                    />
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl">
                      {file ? "Change" : "Browse"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-5 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-widest transition-all shadow-[0_10px_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 ${
                  submitting ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95"
                }`}
              >
                <LuSend className={`h-4 w-4 ${submitting ? "animate-pulse" : ""}`} />
                {submitting ? "Submitting Ticket..." : "Submit Ticket"}
              </button>
            </form>
          </motion.div>

          {/* Quick Help Tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5"
          >
            <LuLifeBuoy className="h-4 w-4 text-white/20" />
            <p className="text-xs text-white/20 font-medium">
              Did you know? Most withdrawal issues are resolved automatically within 24 hours. Check our <Link href="/dashboard/settings/support/ai-tutorial" className="text-white/40 underline hover:text-white">AI Tutorial</Link> first.
            </p>
          </motion.div>

        </div>
      </section>
    </main>
  );
}
