import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-white/50 mb-10">Have questions or feedback? We&apos;d love to hear from you.</p>
        
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <Mail className="h-8 w-8 text-teal-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Email</h3>
            <p className="text-sm text-white/50">support@resumeforge.ai</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <MessageCircle className="h-8 w-8 text-teal-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Response Time</h3>
            <p className="text-sm text-white/50">We typically respond within 24 hours</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-xl font-semibold mb-6">Send a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Name</label>
              <input
                type="text"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Message</label>
              <textarea
                rows={5}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
                placeholder="How can we help?"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-teal-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-400 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
