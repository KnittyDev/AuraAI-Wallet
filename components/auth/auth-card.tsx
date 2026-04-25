import Image from "next/image";
import Link from "next/link";
import auralogo from "@/app/auralogo.png";

type AuthCardProps = {
  mode: "login" | "register";
};

export function AuthCard({ mode }: AuthCardProps) {
  const isLogin = mode === "login";

  return (
    <div className="mx-auto w-full max-w-md rounded-[32px] border border-white/15 bg-black/55 p-6 text-left shadow-2xl backdrop-blur-sm md:p-8">
      <div className="mb-8 text-center">
        <Link href="/" className="mx-auto mb-4 inline-flex items-center justify-center">
          <Image
            src={auralogo}
            alt="Aura logo"
            className="h-12 w-12 rounded-full object-contain"
            priority
          />
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-white/60">
          {isLogin
            ? "Log in to manage your autonomous portfolio."
            : "Start building your autonomous investment workflow."}
        </p>
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/85"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
          G
        </span>
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-white/35">
        <div className="h-px flex-1 bg-white/10" />
        or
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form className="space-y-4">
        {!isLogin && (
          <div>
            <label htmlFor="name" className="mb-2 block text-sm text-white/70">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/35 focus:bg-white/10"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-white/70">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/35 focus:bg-white/10"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm text-white/70">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/35 focus:bg-white/10"
          />
        </div>

        {isLogin && (
          <div className="flex justify-end">
            <a href="#" className="text-sm text-white/60 transition hover:text-white">
              Forgot password?
            </a>
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/85"
        >
          {isLogin ? "Log in" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/60">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <Link
          href={isLogin ? "/register" : "/login"}
          className="font-medium text-white transition hover:text-white/80"
        >
          {isLogin ? "Sign up" : "Log in"}
        </Link>
      </p>
    </div>
  );
}
