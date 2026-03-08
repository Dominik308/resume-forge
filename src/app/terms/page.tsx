import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-white/70">
          <p>Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
          
          <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
          <p>By using ResumeForge AI, you agree to these terms of service. If you do not agree, please do not use the service.</p>
          
          <h2 className="text-xl font-semibold text-white">2. Service Description</h2>
          <p>ResumeForge AI provides AI-powered resume building tools, including content generation, ATS optimization, and template-based formatting.</p>
          
          <h2 className="text-xl font-semibold text-white">3. User Content</h2>
          <p>You retain ownership of all resume content you create. We do not claim any rights to your personal data or resume content.</p>
          
          <h2 className="text-xl font-semibold text-white">4. AI-Generated Content</h2>
          <p>AI suggestions are provided as recommendations. You are responsible for reviewing and ensuring the accuracy of all content in your resume.</p>
          
          <h2 className="text-xl font-semibold text-white">5. Account Termination</h2>
          <p>You may delete your account at any time. We reserve the right to suspend accounts that violate these terms.</p>
        </div>
      </div>
    </div>
  );
}
