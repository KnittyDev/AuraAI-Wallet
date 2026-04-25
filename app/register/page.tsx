import { AuthCard } from "@/components/auth/auth-card";
import { AuroraBackground } from "@/components/landing/aurora-background";

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-12 text-white">
      <AuroraBackground />
      <div className="landing-grid-overlay" />
      <div className="relative z-10 w-full">
        <AuthCard mode="register" />
      </div>
    </main>
  );
}
