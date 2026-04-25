import Image from "next/image";
import Link from "next/link";
import auralogo from "@/app/auralogo.png";

export function LandingHeader() {
  return (
    <header className="flex items-center justify-between">
      <div className="inline-flex items-center p-1">
        <Image
          src={auralogo}
          alt="Aura logo"
          className="h-10 w-10 rounded-full object-contain"
          priority
        />
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
