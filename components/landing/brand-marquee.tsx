"use client";

import { motion } from "framer-motion";

const brands = [
  "AdriGo",
  "Vendora",
  "SolidChain",
  "KuCoin",
  "Rivora",
  "Polybit",
];

export function BrandMarquee() {
  // Duplicate the list to create a seamless loop
  const duplicatedBrands = [...brands, ...brands, ...brands, ...brands];

  return (
    <div className="w-full mt-24 mb-12 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-10 text-center">
        Trusted by Institutional Partners & Crypto Apps
      </p>

      <div className="flex overflow-hidden">
        <motion.div
          className="flex gap-20 items-center whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity
          }}
        >
          {duplicatedBrands.map((brand, i) => (
            <div
              key={`${brand}-${i}`}
              className="flex items-center gap-3 group"
            >
              <span className="text-3xl font-black italic tracking-tighter text-white/10 group-hover:text-white/40 transition-colors uppercase select-none">
                {brand}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
