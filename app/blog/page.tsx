"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LandingHeader } from "@/components/landing/landing-header";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LuClock, LuArrowRight, LuCalendar } from "react-icons/lu";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

const BLOG_POSTS = [
  {
    id: 1,
    title: "The Future of Autonomous Trading: How Aura AI is Leading the Way",
    excerpt: "Exploring the evolution of AI in financial markets and why decentralized autonomous trading is the next logical step for institutional investors.",
    category: "Technology",
    author: "Arif Can",
    date: "May 12, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Understanding Layer 1 Scalability: SOL vs ETH vs BTC",
    excerpt: "A deep dive into the technical differences between the world's leading L1 protocols and what they mean for your portfolio strategy.",
    category: "Market Analysis",
    author: "Elena Rodriguez",
    date: "May 10, 2026",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1622790698141-94e30457ef12?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Maximizing Returns in High-Volatility Markets",
    excerpt: "Strategies for leveraging AI-driven insights to protect capital and capture upside during periods of extreme market turbulence.",
    category: "Strategy",
    author: "Marcus Chen",
    date: "May 8, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1611974714658-dd472454b6c8?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    title: "The Impact of Global Macro Trends on Crypto Assets",
    excerpt: "How interest rate hikes and geopolitical shifts are influencing the long-term adoption curve of digital currencies.",
    category: "Economy",
    author: "Sarah Jenkins",
    date: "May 5, 2026",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1494412574743-0194849a6421?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    title: "Security Best Practices for Institutional Custody",
    excerpt: "Ensuring your digital assets are protected by bank-grade security protocols while maintaining immediate liquidity.",
    category: "Security",
    author: "James Wilson",
    date: "May 1, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    title: "AI & Neural Networks: The Core of Aura's Intelligence",
    excerpt: "A technical breakdown of the machine learning models that power our autonomous decision-making engine.",
    category: "AI",
    author: "Dr. Thomas Miller",
    date: "April 28, 2026",
    readTime: "15 min read",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
  }
];

const CATEGORIES = ["All Posts", "Technology", "Market Analysis", "Strategy", "Economy", "Security", "AI"];

export default function BlogPage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All Posts");

  const getCategoryLabel = (cat: string) => {
    if (cat === "All Posts") return t("blog.categories.all");
    if (cat === "Technology") return t("blog.categories.tech");
    if (cat === "Market Analysis") return t("blog.categories.market");
    if (cat === "Strategy") return t("blog.categories.strategy");
    if (cat === "Economy") return t("blog.categories.economy");
    if (cat === "Security") return t("blog.categories.security");
    if (cat === "AI") return t("blog.categories.ai");
    return cat;
  };

  const localizedPosts = BLOG_POSTS.map(post => {
    const postsTrans = t("blog.posts") || [];
    const translation = postsTrans.find((p: any) => p.id === post.id);
    return {
      ...post,
      title: translation?.title || post.title,
      excerpt: translation?.excerpt || post.excerpt,
      category: getCategoryLabel(post.category),
      date: translation?.date || post.date,
      readTime: translation?.readTime || post.readTime,
    };
  });

  const filteredPosts = activeCategory === "All Posts"
    ? localizedPosts
    : localizedPosts.filter(post => post.category === getCategoryLabel(activeCategory));

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <AuroraBackground />
      <div className="landing-grid-overlay" />

      {/* Sticky Navigation */}
      <div className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <LandingHeader />
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-10">
        {/* Header Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center max-w-xl mx-auto"
          >
            <p className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase mb-3">
              {t("blog.subtitle")}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {t("blog.title")}
            </h1>
            <p className="text-sm text-white/40 leading-relaxed">
              {t("blog.desc")}
            </p>
          </motion.div>
        </section>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border ${
                activeCategory === cat
                  ? "bg-white/10 border-white/20 text-white"
                  : "bg-transparent border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Regular Posts Grid */}
        <motion.section 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, i) => (
              <motion.article
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.01] hover:bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20"
              >
                <div>
                  {/* Clean Visual Header (Unified aspect ratio) */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl mb-5">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-white/70 text-[9px] font-bold uppercase tracking-wider">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-wider text-white/30 mb-3">
                    <span className="flex items-center gap-1">
                      <LuCalendar className="h-2.5 w-2.5" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <LuClock className="h-2.5 w-2.5" /> {post.readTime}
                    </span>
                  </div>

                  {/* Title & Excerpt */}
                  <h3 className="text-base font-bold text-white group-hover:text-white/80 transition-colors mb-3 leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>
                </div>

                {/* Footer Section */}
                <div className="border-t border-white/5 pt-5 mt-auto flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-white/60">
                    {post.author}
                  </span>
                  
                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-white/40 group-hover:text-white transition-all"
                  >
                    <span>{t("blog.readArticle")}</span>
                    <LuArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.section>

        {/* Minimalist Newsletter Box */}
        <section className="mt-28 p-8 md:p-12 rounded-3xl border border-white/10 bg-white/[0.01] backdrop-blur-md text-center max-w-2xl mx-auto relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl md:text-2xl font-bold mb-2">{t("blog.stayAhead")}</h2>
            <p className="text-xs text-white/40 mb-6 max-w-md mx-auto">
              {t("blog.newsletterDesc")}
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t("blog.emailPlaceholder")}
                className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.02] transition-all"
              />
              <button className="bg-white text-black px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-white/90 transition-all">
                {t("blog.subscribe")}
              </button>
            </form>
          </div>
        </section>

        <LandingFooter />
      </main>
    </div>
  );
}
