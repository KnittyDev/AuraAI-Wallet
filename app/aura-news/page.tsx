"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LandingHeader } from "@/components/landing/landing-header";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LuClock, LuExternalLink, LuNewspaper, LuArrowRight } from "react-icons/lu";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/language-context";

type NewsItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  body: string;
  imageurl: string;
  category: string;
  published_on: number;
};

// Helper function to strip HTML tags for preview
const stripHtml = (html: string) => {
  if (typeof window === 'undefined') return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

export default function AuraNewsPage() {
  const { language, t } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data: auraNews, error } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false });

        if (!error && auraNews) {
          const mappedNews = auraNews.map((item: any) => ({
            id: item.id,
            title: item.title,
            url: item.external_url || "#",
            source: item.source,
            body: item.body,
            category: item.category,
            imageurl: item.image_url || `https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800`,
            published_on: Math.floor(new Date(item.published_at || item.created_at).getTime() / 1000)
          }));
          setNews(mappedNews);
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNews();
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(language === "tr" ? "tr-TR" : language === "de" ? "de-DE" : language === "sv" ? "sv-SE" : language === "es" ? "es-ES" : language === "el" ? "el-GR" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getNewsCategoryLabel = (cat: string) => {
    if (!cat) return "";
    const catLower = cat.toLowerCase();
    const mappings: Record<string, Record<string, string>> = {
      tr: {
        announcement: "Duyuru",
        update: "Güncelleme",
        milestone: "Kilometre Taşı",
        security: "Güvenlik",
        tech: "Teknoloji",
      },
      es: {
        announcement: "Anuncio",
        update: "Actualización",
        milestone: "Hito",
        security: "Seguridad",
        tech: "Tecnología",
      },
      el: {
        announcement: "Ανακοίνωση",
        update: "Ενημέρωση",
        milestone: "Ορόσημο",
        security: "Ασφάλεια",
        tech: "Τεχνολογία",
      },
      de: {
        announcement: "Ankündigung",
        update: "Aktualisierung",
        milestone: "Meilenstein",
        security: "Sicherheit",
        tech: "Technologie",
      },
      sv: {
        announcement: "Meddelande",
        update: "Uppdatering",
        milestone: "Milstolpe",
        security: "Säkerhet",
        tech: "Teknologi",
      }
    };
    return mappings[language]?.[catLower] || cat;
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      <div className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <LandingHeader />
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10">
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              {t("newsroom.liveUpdates")}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              {t("newsroom.title")}
            </h1>

            <p className="text-lg text-white/50 leading-relaxed">
              {t("newsroom.desc")}
            </p>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[450px] rounded-[2.5rem] border border-white/5 bg-white/[0.02] animate-pulse" />
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {news.map((item, index) => (
                <Link key={item.id} href={`/aura-news/${item.id}`}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] transition-all hover:border-white/20 hover:bg-white/[0.04] backdrop-blur-sm h-full"
                  >
                    <div className="relative h-56 w-full overflow-hidden">
                      <img 
                        src={item.imageurl} 
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                      />
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-bold uppercase tracking-widest text-white">
                          {getNewsCategoryLabel(item.category)}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    </div>
                    
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                          {item.source}
                        </span>
                        <div className="flex items-center gap-2 text-white/20">
                          <LuClock className="h-3 w-3" />
                          <span className="text-[10px] font-medium">{formatDate(item.published_on)}</span>
                        </div>
                      </div>
                      
                      <h3 className="mb-4 text-xl font-bold leading-tight text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-white/40 mb-8 line-clamp-3">
                        {stripHtml(item.body)}
                      </p>
                      
                      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white transition-colors cursor-pointer">
                        <span>{t("newsroom.readStory")}</span>
                        <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </AnimatePresence>
          )}
        </section>

        {!isLoading && news.length === 0 && (
          <div className="py-32 text-center">
            <LuNewspaper className="h-12 w-12 text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t("newsroom.noUpdates")}</h3>
            <p className="text-white/40">{t("newsroom.noUpdatesDesc")}</p>
          </div>
        )}

        <LandingFooter />
      </main>
    </div>
  );
}
