"use client";

import Image from "next/image";
import auralogo from "@/app/auralogo.png";
import { SiEuropeanunion } from "react-icons/si";
import { useLanguage } from "@/context/language-context";

export function LandingFooter() {
  const { t } = useLanguage();

  const footerColumns = [
    {
      title: t("footer.product"),
      links: [
        { name: t("header.features"), href: "/#features" },
        { name: t("header.pricing"), href: "/#pricing" },
        { name: t("header.faq"), href: "/#faq" },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { name: t("footer.about"), href: "#" },
        { name: t("footer.contact"), href: "#" },
        { name: t("header.careers"), href: "/careers" },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { name: t("footer.privacy"), href: "/privacy" },
        { name: t("footer.terms"), href: "/terms" },
        { name: t("footer.status"), href: "/status" },
      ],
    },
  ];

  return (
    <footer className="mx-auto mt-16 w-full max-w-6xl rounded-3xl border border-white/15 bg-black/55 px-6 py-8 text-left backdrop-blur-sm md:px-8">
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
            {t("footer.desc")}
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
          © {new Date().getFullYear()} {t("footer.rights")}
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
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t("footer.binance")}</span>
          </div>

          {/* EU Compliance for footer */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors group cursor-default">
            <div className="bg-[#003399] p-1 rounded-sm shadow-sm group-hover:scale-110 transition-transform text-[#FFCC00]">
              <SiEuropeanunion className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-white/80 leading-none">{t("footer.euCompliant")}</span>
              <span className="text-[8px] text-white/30 uppercase tracking-widest mt-0.5">{t("footer.euPlatform")}</span>
            </div>
          </div>

          {/* Swiss Engineering */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors group cursor-default">
            <div className="bg-[#FF0000] p-1 rounded-sm shadow-sm group-hover:scale-110 transition-transform flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-4 w-4">
                <rect width="32" height="32" fill="#FF0000" />
                <rect x="13" y="6" width="6" height="20" fill="#fff" />
                <rect x="6" y="13" width="20" height="6" fill="#fff" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-white/80 leading-none">{t("footer.swissEng")}</span>
              <span className="text-[8px] text-white/30 uppercase tracking-widest mt-0.5">{t("footer.swissQuality")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
