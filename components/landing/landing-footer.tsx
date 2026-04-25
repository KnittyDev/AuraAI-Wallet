import Image from "next/image";
import auralogo from "@/app/auralogo.png";

const footerColumns = [
  {
    title: "Product",
    links: ["Features", "Pricing", "FAQ"],
  },
  {
    title: "Company",
    links: ["About", "Contact", "Careers"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security"],
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
                <li key={link}>
                  <a href="#" className="transition hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-white/10 pt-4 text-xs text-white/50">
        © {new Date().getFullYear()} Aura. All rights reserved.
      </div>
    </footer>
  );
}
