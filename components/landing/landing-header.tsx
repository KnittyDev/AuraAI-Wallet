import Image from "next/image";
import Link from "next/link";
import auralogo from "@/app/auralogo.png";

export function LandingHeader() {
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
          <Link href="/#faq" className="text-sm font-medium text-white/50 hover:text-white transition-colors">FAQ</Link>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Contact sales
        </button>
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
