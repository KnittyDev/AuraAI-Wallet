"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuNewspaper, LuExternalLink, LuClock } from "react-icons/lu";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type NewsItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  body: string;
  imageurl: string;
  published_on: number;
};

export function MarketNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data: auraNews, error } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(6);

        if (!error && auraNews && auraNews.length > 0) {
          const mappedNews = auraNews.map((item: any) => ({
            id: item.id,
            title: item.title,
            url: item.external_url || "#",
            source: item.source,
            body: item.body,
            imageurl: item.image_url || `https://images.unsplash.com/photo-1611974714658-dd472454b6c8?auto=format&fit=crop&q=80&w=800`,
            published_on: Math.floor(new Date(item.published_at).getTime() / 1000)
          }));
          setNews(mappedNews);
        } else {
          // Fallback to RSS if no news in DB
          const query = encodeURIComponent("finance economy crypto");
          const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fq%3D${query}%26hl%3Den-US%26gl%3DUS%26ceid%3DUS%3Aen`);
          const data = await res.json();
          
          if (data.items && Array.isArray(data.items)) {
            const rssNews = data.items.slice(0, 6).map((item: any) => ({
              id: item.guid,
              title: item.title,
              url: item.link,
              source: item.author || "Global News",
              body: item.description.replace(/<[^>]*>?/gm, "").slice(0, 150) + "...",
              imageurl: item.enclosure?.link || `https://images.unsplash.com/photo-1611974714658-dd472454b6c8?auto=format&fit=crop&q=80&w=800`,
              published_on: Math.floor(new Date(item.pubDate).getTime() / 1000)
            }));
            setNews(rssNews);
          }
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNews();
  }, []);

const MOCK_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "US Markets React to Donald Trump's Latest Economic Policy Proposal",
    url: "https://www.google.com/search?q=Trump+Economic+Policy",
    source: "Wall Street Journal",
    body: "Former President Donald Trump outlined a new trade tariff strategy that has sent ripples through global markets, with analysts debating the long-term impact on inflation.",
    imageurl: "https://images.unsplash.com/photo-1580130775562-455b572c57f8?auto=format&fit=crop&q=80&w=800",
    published_on: Math.floor(Date.now() / 1000) - 3600
  },
  {
    id: "2",
    title: "Federal Reserve Signals Potential Rate Cuts Amid Cooling Inflation Data",
    url: "https://www.google.com/search?q=Federal+Reserve+Rate+Cuts",
    source: "Bloomberg",
    body: "The Fed Chairman's recent remarks suggest a shift in monetary policy, leading to a surge in both equity and bond markets as investors price in a softer economic landing.",
    imageurl: "https://images.unsplash.com/photo-1611974714658-dd472454b6c8?auto=format&fit=crop&q=80&w=800",
    published_on: Math.floor(Date.now() / 1000) - 7200
  },
  {
    id: "3",
    title: "Global Supply Chains Brace for New Round of Trade Negotiations",
    url: "https://www.google.com/search?q=Global+Trade+Negotiations",
    source: "Reuters",
    body: "As major economies prepare for upcoming summits, trade ministers are signaling a move towards more protective measures, impacting tech and manufacturing sectors.",
    imageurl: "https://images.unsplash.com/photo-1494412574743-0194849a6421?auto=format&fit=crop&q=80&w=800",
    published_on: Math.floor(Date.now() / 1000) - 10800
  },
  {
    id: "4",
    title: "Oil Prices Stabilize After Sudden Shift in OPEC Production Strategy",
    url: "https://www.google.com/search?q=OPEC+Oil+Prices",
    source: "Financial Times",
    body: "Energy markets saw volatile trading earlier this week as major producers reached a surprise agreement on output levels through the end of the year.",
    imageurl: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?auto=format&fit=crop&q=80&w=800",
    published_on: Math.floor(Date.now() / 1000) - 14400
  },
  {
    id: "5",
    title: "Tech Giants Announce Major AI Infrastructure Investments in US",
    url: "https://www.google.com/search?q=AI+Infrastructure+Investments",
    source: "CNBC",
    body: "A coalition of Silicon Valley's biggest names has pledged billions in new data centers, citing the strategic importance of domestic AI capabilities.",
    imageurl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    published_on: Math.floor(Date.now() / 1000) - 18000
  },
  {
    id: "6",
    title: "Consumer Sentiment Hits 2-Year High as Employment Remains Strong",
    url: "https://www.google.com/search?q=Consumer+Sentiment+US",
    source: "Forbes",
    body: "Despite high interest rates, American consumers remain optimistic about their personal finances, providing a resilient backdrop for the broader economy.",
    imageurl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    published_on: Math.floor(Date.now() / 1000) - 21600
  }
];




  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-1">
        <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <LuNewspaper className="h-4 w-4 text-white/60" />
        </div>
        <h2 className="text-xl font-semibold text-white">Global Market Updates</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[300px] rounded-3xl border border-white/5 bg-white/[0.02] animate-pulse" />
          ))
        ) : (
          <AnimatePresence>
            {news.map((item, index) => (
              <Link
                key={item.id}
                href={item.url === "#" ? `/aura-news/${item.id}` : item.url}
                target={item.url === "#" ? undefined : "_blank"}
                rel={item.url === "#" ? undefined : "noopener noreferrer"}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-white/20 hover:bg-white/[0.05] backdrop-blur-sm min-h-[200px] h-full"
                >
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-lg bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white/60 border border-white/10">
                    {item.source}
                  </span>
                  <div className="flex items-center gap-1.5 text-white/40">
                    <LuClock className="h-3 w-3" />
                    <span className="text-[10px] font-medium">{formatDate(item.published_on)}</span>
                  </div>
                </div>
                
                <div className="flex flex-1 flex-col">
                  <h3 className="mb-3 line-clamp-3 text-base font-semibold leading-relaxed text-white group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="line-clamp-3 text-xs leading-relaxed text-white/50">
                    {item.body}
                  </p>
                  
                  <div className="mt-auto pt-6 flex items-center justify-end text-[10px] font-bold uppercase tracking-widest text-white/30 group-hover:text-white transition-colors">
                    <span>Read Full Story</span>
                    <LuExternalLink className="ml-1.5 h-3 w-3" />
                  </div>
                </div>
              </motion.div>
            </Link>

            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
