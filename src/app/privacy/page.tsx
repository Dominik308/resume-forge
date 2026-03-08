import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-white/70">
          <p>Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
          
          <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
          <p>We collect information you provide when creating an account, building resumes, and using our AI features. This includes your name, email, and resume content.</p>
          
          <h2 className="text-xl font-semibold text-white">2. How We Use Your Information</h2>
          <p>Your data is used to provide our resume building service, generate AI suggestions, and improve your experience. We never sell your personal data to third parties.</p>
          
          <h2 className="text-xl font-semibold text-white">3. AI Processing</h2>
          <p>When using local AI (Ollama), your data is processed entirely on your machine. No resume content is sent to external servers unless you explicitly use cloud AI features.</p>
          
          <h2 className="text-xl font-semibold text-white">4. Data Storage</h2>
          <p>Your resumes are stored securely in our database. You can delete your account and all associated data at any time from your settings page.</p>
          
          <h2 className="text-xl font-semibold text-white">5. Contact</h2>
          <p>For privacy-related questions, please reach out through our contact page.</p>
        </div>
      </div>
    </div>
  );
}
