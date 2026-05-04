import Image from "next/image";
import auralogo from "@/app/auralogo.png";
import { SiEuropeanunion } from "react-icons/si";

const footerColumns = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "/#features" },
      { name: "Pricing", href: "/#pricing" },
      { name: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Careers", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Security", href: "#" },
    ],

  },
];

export function LandingFooter() {
  return (
    <footer className="mx-auto mt-16 w-full max-w-6xl rounded-3xl border border-white/15 bg-black/50 px-6 py-8 text-left backdrop-blur-sm md:px-8">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="mb-4 inline-flex items-center gap-2">
            <Image
              src={auralogo}
              alt="Aura logo"
              className="h-9 w-9 rounded-full object-contain"
            />
            <span className="text-xl font-semibold text-white">Aura</span>
          </div>
          <p className="max-w-xs text-sm text-white/65">
            Autonomous portfolio intelligence with always-on execution and clear performance insights.
          </p>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/80">
              {column.title}
            </h3>
            <ul className="space-y-2 text-sm text-white/65">
              {column.links.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="transition hover:text-white">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-6 gap-4">
        <div className="text-xs text-white/50">
          © {new Date().getFullYear()} Aura. All rights reserved.
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {/* Binance Partnership */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors group cursor-default">
            <Image 
              src="/binance.svg" 
              alt="Binance" 
              width={80} 
              height={16} 
              className="opacity-40 group-hover:opacity-100 transition-opacity"
            />
            <span className="h-4 w-[1px] bg-white/10" />
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Verified Broker</span>
          </div>

          {/* EU Compliance */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors group cursor-default">
            <div className="bg-[#003399] p-1 rounded-sm shadow-sm group-hover:scale-110 transition-transform text-[#FFCC00]">
              <SiEuropeanunion className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-white/80 leading-none">Compliant with EU Standards</span>
              <span className="text-[8px] text-white/30 uppercase tracking-widest mt-0.5">EU Compliant Platform</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
