"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuChevronDown, LuExternalLink, LuBookOpen, LuCpu, LuUsers, LuZap } from "react-icons/lu";
import auralogo from "@/app/auralogo.png";

export function LandingHeader() {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  return (
    <header className="flex items-center justify-between py-5">
      <div className="flex items-center gap-8">
        <Link href="/" className="inline-flex items-center p-1">
          <Image
            src={auralogo}
            alt="Aura logo"
            className="h-10 w-10 rounded-full object-contain"
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/#pricing" className="text-sm font-medium text-white/50 hover:text-white transition-colors">Pricing</Link>
          <Link href="/#features" className="text-sm font-medium text-white/50 hover:text-white transition-colors">Features</Link>
          <Link href="/#results" className="text-sm font-medium text-white/50 hover:text-white transition-colors">Results</Link>
          <Link href="/#case-studies" className="text-sm font-medium text-white/50 hover:text-white transition-colors">Case Studies</Link>

          {/* Resources Mega Menu Trigger */}
          <div
            className="relative"
            onMouseEnter={() => setIsResourcesOpen(true)}
            onMouseLeave={() => setIsResourcesOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-white/50 hover:text-white transition-colors py-2">
              Resources
              <LuChevronDown className={`h-4 w-4 transition-transform duration-300 ${isResourcesOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isResourcesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50"
                >
                  <div className="w-[500px] rounded-3xl border border-white/10 bg-black/90 p-8 backdrop-blur-2xl shadow-2xl grid grid-cols-3 gap-8">
                    {/* Insights */}
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
                        <LuZap className="h-3 w-3" /> Insights
                      </h3>
                      <div className="flex flex-col gap-3">
                        <Link href="/blog" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Blog</Link>
                        <Link href="/customer-stories" className="text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center justify-between group/item">
                          Customer stories
                          <span className="text-[8px] px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/40 group-hover/item:text-cyan-400 group-hover/item:border-cyan-500/30 transition-all uppercase font-bold tracking-tighter">Soon</span>
                        </Link>


                        <Link href="/aura-news" className="text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center justify-between">
                          Aura news <LuExternalLink className="h-3 w-3 opacity-40" />
                        </Link>
                      </div>
                    </div>

                    {/* Learn */}
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
                        <LuBookOpen className="h-3 w-3" /> Learn
                      </h3>
                      <div className="flex flex-col gap-3">
                        <Link href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center justify-between">
                          Academy <LuExternalLink className="h-3 w-3 opacity-40" />
                        </Link>
                        <Link href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Courses</Link>
                        <Link href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Tutorials</Link>
                        <Link href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Use cases</Link>
                      </div>
                    </div>

                    {/* Connect */}
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
                        <LuUsers className="h-3 w-3" /> Connect
                      </h3>
                      <div className="flex flex-col gap-3">
                        <Link href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Community</Link>
                        <Link href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center justify-between">
                          Events <LuExternalLink className="h-3 w-3 opacity-40" />
                        </Link>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/#faq" className="text-sm font-medium text-white/50 hover:text-white transition-colors">FAQ</Link>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/contact-sales"
          className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Contact sales
        </Link>
        <Link
          href="/login"
          className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/85"
        >
          Try Now
        </Link>
      </div>


    </header>
  );
}

