import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Authentication",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-brand-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white font-bold text-xl">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500">
              <Sparkles className="h-5 w-5" />
            </div>
            ResumeForge <span className="text-teal-400">AI</span>
          </Link>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
          {children}
        </div>
        <p className="text-center text-sm text-white/30 mt-6">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-white/60">Terms</Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-white/60">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
