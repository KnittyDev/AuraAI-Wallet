"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingFooter } from "@/components/landing/landing-footer";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { LuArrowLeft, LuShare2, LuCalendar, LuTag, LuExternalLink } from "react-icons/lu";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

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
  const { language, t } = useLanguage();
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

  const getNewsCategoryLabel = (cat: string) => {
    if (!cat) return "";
    if (language === "tr") {
      if (cat.toLowerCase() === "announcement") return "Duyuru";
      if (cat.toLowerCase() === "update") return "Güncelleme";
      if (cat.toLowerCase() === "milestone") return "Kilometre Taşı";
      if (cat.toLowerCase() === "security") return "Güvenlik";
      if (cat.toLowerCase() === "tech") return "Teknoloji";
    }
    return cat;
  };

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
        <h1 className="text-4xl font-bold mb-4">{t("newsroom.notFound")}</h1>
        <p className="text-white/40 mb-8">{t("newsroom.notFoundDesc")}</p>
        <Link href="/aura-news" className="px-8 py-3 rounded-2xl bg-white text-black font-bold">{t("newsroom.backToNewsroom")}</Link>
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
            {t("newsroom.backToNewsroom")}
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
              {getNewsCategoryLabel(news.category)}
            </span>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <LuCalendar className="h-3.5 w-3.5" />
              {new Date(news.published_at).toLocaleDateString(language === "tr" ? "tr-TR" : "en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
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
        {news.image_url && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 mb-16 shadow-2xl"
          >
            <img 
              src={news.image_url} 
              alt={news.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </motion.div>
        )}

        {/* Article Body */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert prose-cyan max-w-none mb-20"
        >
          <div 
            className="news-content text-white/70 text-lg leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: news.body }}
          />
        </motion.article>

        {/* Footer Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: news.title,
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert(language === "tr" ? "Bağlantı panoya kopyalandı!" : "Link copied to clipboard!");
                }
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-bold"
            >
              <LuShare2 className="h-4 w-4" /> {t("newsroom.shareArticle")}
            </button>
            {news.external_url && news.external_url !== '#' && (
              <a 
                href={news.external_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cyan-400 text-sm font-bold hover:underline"
              >
                {t("newsroom.sourceLink")} <LuExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          
          <Link 
            href="/aura-news" 
            className="text-white/30 hover:text-white transition-colors text-sm font-medium"
          >
            {t("newsroom.allUpdates")}
          </Link>
        </motion.div>
      </main>

      <div className="pb-20">
        <LandingFooter />
      </div>

      <style jsx global>{`
        .news-content h1, .news-content h2, .news-content h3 {
          color: white;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .news-content h1 { font-size: 2rem; }
        .news-content h2 { font-size: 1.5rem; }
        .news-content h3 { font-size: 1.25rem; }
        .news-content p { margin-bottom: 1.5rem; }
        .news-content ul, .news-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .news-content ul { list-style-type: disc; }
        .news-content ol { list-style-type: decimal; }
        .news-content li { margin-bottom: 0.5rem; }
        .news-content a {
          color: #22d3ee;
          text-decoration: underline;
        }
        .news-content blockquote {
          border-left: 4px solid #22d3ee;
          padding-left: 1.5rem;
          font-style: italic;
          color: rgba(255, 255, 255, 0.5);
          margin: 2rem 0;
        }
      `}</style>
    </div>
  );
}
