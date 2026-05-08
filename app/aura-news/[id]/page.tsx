"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingFooter } from "@/components/landing/landing-footer";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { LuArrowLeft, LuClock, LuShare2, LuCalendar, LuTag, LuExternalLink } from "react-icons/lu";
import Link from "next/link";

interface NewsItem {
  id: string;
  title: string;
  body: string;
  source: string;
  image_url: string;
  external_url: string;
  category: string;
  published_at: string;
}

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewsDetail() {
      if (!params.id) return;

      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setNews(data);
      } catch (err) {
        console.error("Error fetching news detail:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNewsDetail();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">News not found</h1>
        <p className="text-white/40 mb-8">The story you are looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/aura-news" className="px-8 py-3 rounded-2xl bg-white text-black font-bold">Back to Newsroom</Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-cyan-500/30">
      <AuroraBackground />
      <div className="landing-grid-overlay fixed inset-0" />

      <div className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <LandingHeader />
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-4xl px-6 py-12 md:py-24">
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link 
            href="/aura-news" 
            className="inline-flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white transition-colors group"
          >
            <LuArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Newsroom
          </Link>
        </motion.div>

        {/* Header Metadata */}
        <div className="space-y-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-4"
          >
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
              {news.category}
            </span>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <LuCalendar className="h-3.5 w-3.5" />
              {new Date(news.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <LuTag className="h-3.5 w-3.5" />
              {news.source}
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]"
          >
            {news.title}
          </motion.h1>
        </div>

        {/* Featured Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 mb-16 shadow-2xl"
        >
          <img 
            src={news.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200'} 
            alt={news.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </motion.div>

        {/* Article Body */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert prose-cyan max-w-none"
        >
          <div className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium mb-12 border-l-4 border-cyan-500 pl-8 py-2 bg-white/5 rounded-r-2xl">
            {news.body.split('.')[0]}.
          </div>
          
          <div className="text-white/60 text-lg leading-relaxed space-y-8">
            <p>
              {news.body.split('.').slice(1).join('.')}
            </p>
            
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>

            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 my-12">
              <h3 className="text-white font-bold text-xl mb-4">Official Statement</h3>
              <p className="italic text-white/50">
                &quot;The development of Aura AI represents a paradigm shift in how individual investors interact with global liquidity. Our neural models are designed to find signal where others see only noise.&quot;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400">A</div>
                <div>
                  <p className="text-sm font-bold text-white">Aura Engineering Team</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/30">Zurich, Switzerland</p>
                </div>
              </div>
            </div>

            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
          </div>
        </motion.article>

        {/* Footer Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-bold">
              <LuShare2 className="h-4 w-4" /> Share Article
            </button>
            {news.external_url && news.external_url !== '#' && (
              <a 
                href={news.external_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cyan-400 text-sm font-bold hover:underline"
              >
                Source Link <LuExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          
          <Link 
            href="/aura-news" 
            className="text-white/30 hover:text-white transition-colors text-sm font-medium"
          >
            All Updates
          </Link>
        </motion.div>
      </main>

      <div className="pb-20">
        <LandingFooter />
      </div>
    </div>
  );
}
