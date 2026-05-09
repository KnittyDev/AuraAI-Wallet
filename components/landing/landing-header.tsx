"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuChevronDown, LuExternalLink, LuBookOpen, LuCpu, LuUsers, LuZap } from "react-icons/lu";
import auralogo from "@/app/auralogo.png";

export function LandingHeader() {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/#pricing", label: "Pricing" },
    { href: "/#features", label: "Features" },
    { href: "/#results", label: "Results" },
    { href: "/#case-studies", label: "Case Studies" },
    { href: "/#faq", label: "FAQ" },
  ];

  return (
    <header className="flex items-center justify-between py-5 relative z-[60]">
      <div className="flex items-center gap-8">
        <Link href="/" className="inline-flex items-center p-1 relative z-[70]">
          <Image
            src={auralogo}
            alt="Aura logo"
            className="h-10 w-10 rounded-full object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-white/50 hover:text-white transition-colors">{link.label}</Link>
          ))}

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
                  <div className="w-[500px] rounded-3xl border border-white/10 bg-black/90 p-8 backdrop-blur-2xl shadow-2xl grid grid-cols-2 gap-8">
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
                        <Link href="/academy" className="text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center justify-between">
                          Academy <LuExternalLink className="h-3 w-3 opacity-40" />
                        </Link>
                        <Link href="/dashboard/settings/support" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Support Center</Link>
                        <Link href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Tutorials</Link>
                        <Link href="/careers" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Careers</Link>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden lg:flex items-center gap-2">
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

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden relative z-[70] h-10 w-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white"
        >
          <div className="relative h-4 w-5">
            <motion.span 
              animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 6 : 0 }}
              className="absolute top-0 left-0 w-full h-0.5 bg-current rounded-full origin-center"
            />
            <motion.span 
              animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
              className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-0.5 bg-current rounded-full"
            />
            <motion.span 
              animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -6 : 0 }}
              className="absolute bottom-0 left-0 w-full h-0.5 bg-current rounded-full origin-center"
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl lg:hidden flex flex-col p-8 pt-24 overflow-y-auto"
          >
            <div className="flex flex-col gap-6 mb-12">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-bold text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px w-full bg-white/10 my-4" />
              
              <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/30">Resources</h3>
                <Link href="/academy" onClick={() => setIsMobileMenuOpen(false)} className="block text-xl font-medium text-white/70">Academy</Link>
                <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="block text-xl font-medium text-white/70">Blog</Link>
                <Link href="/dashboard/settings/support" onClick={() => setIsMobileMenuOpen(false)} className="block text-xl font-medium text-white/70">Support Center</Link>
                <Link href="#" onClick={() => setIsMobileMenuOpen(false)} className="block text-xl font-medium text-white/70">Tutorials</Link>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-4">
              <Link
                href="/contact-sales"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full rounded-2xl border border-white/20 bg-white/5 py-4 text-center text-lg font-semibold text-white"
              >
                Contact sales
              </Link>
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full rounded-2xl bg-white py-4 text-center text-lg font-semibold text-black"
              >
                Try Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

