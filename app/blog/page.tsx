"use client";

import { motion } from "framer-motion";
import { LandingHeader } from "@/components/landing/landing-header";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LuCalendar, LuClock, LuArrowRight, LuTag } from "react-icons/lu";
import Image from "next/image";
import Link from "next/link";

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
    isFeatured: true
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

export default function BlogPage() {
  const featuredPost = BLOG_POSTS.find(p => p.isFeatured);
  const regularPosts = BLOG_POSTS.filter(p => !p.isFeatured);

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

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10">
        {/* Header Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center max-w-2xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              The Aura Blog
            </h1>

            <p className="text-lg text-white/50 leading-relaxed">
              In-depth analysis, technical research, and strategic insights from the forefront of autonomous finance.
            </p>
          </motion.div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <motion.section 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-24"
          >
            <Link href={`/blog/${featuredPost.id}`} className="group relative block overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-md">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-[300px] lg:h-[500px] overflow-hidden">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent lg:hidden" />
                </div>
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-3 py-1 rounded-lg bg-cyan-500 text-black text-[10px] font-bold uppercase tracking-widest">
                      {featuredPost.category}
                    </span>
                    <span className="text-xs text-white/40 flex items-center gap-2">
                      <LuClock className="h-3 w-3" /> {featuredPost.readTime}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 group-hover:text-cyan-400 transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-lg text-white/50 leading-relaxed mb-8 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold border border-white/10">
                        {featuredPost.author[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{featuredPost.author}</span>
                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{featuredPost.date}</span>
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                      <LuArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.section>
        )}

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {["All Posts", "Technology", "Market Analysis", "Strategy", "Economy", "Security", "AI"].map((cat, i) => (
            <button 
              key={i}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                i === 0 ? "bg-white text-black" : "bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Regular Posts Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/blog/${post.id}`} className="group flex flex-col h-full rounded-[2rem] border border-white/10 bg-white/[0.02] overflow-hidden hover:bg-white/[0.05] transition-all backdrop-blur-sm">
                <div className="relative h-60 w-full overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">
                    <span className="flex items-center gap-1.5"><LuCalendar className="h-3 w-3" /> {post.date}</span>
                    <span className="flex items-center gap-1.5"><LuClock className="h-3 w-3" /> {post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed line-clamp-3 mb-8">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/70">{post.author}</span>
                    <LuArrowRight className="h-4 w-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </section>

        {/* CTA Section */}
        <section className="mt-32 p-12 md:p-20 rounded-[3rem] border border-white/10 bg-gradient-to-tr from-cyan-500/10 via-transparent to-blue-600/10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(white,transparent_85%)]" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Stay ahead of the curve.</h2>
          <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto relative z-10">
            Get our latest research and institutional analysis delivered straight to your inbox.
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto relative z-10">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 bg-black border border-white/10 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-all"
            />
            <button className="bg-white text-black px-8 py-3 rounded-xl text-sm font-bold hover:bg-white/90 transition-all">
              Subscribe
            </button>
          </div>
        </section>
        
        <LandingFooter />
      </main>
    </div>
  );
}
